"use client";

import { useEffect, useState } from "react";

export type DiscordStatus = "online" | "idle" | "dnd" | "offline";

export interface LanyardActivity {
  name: string;
  type: number; // 0 = Playing, 1 = Streaming, 2 = Listening, 4 = Custom
  details?: string;
  state?: string;
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
  application_id?: string;
}

export interface LanyardSpotify {
  track_id: string;
  song: string;
  artist: string;
  album: string;
  album_art_url: string;
  timestamps: { start: number; end: number };
}

export interface LanyardData {
  discord_user: {
    id: string;
    username: string;
    avatar: string | null;
    discriminator: string;
    global_name?: string | null;
  };
  discord_status: DiscordStatus;
  activities: LanyardActivity[];
  spotify: LanyardSpotify | null;
  listening_to_spotify: boolean;
}

// Lanyard WebSocket opcodes
const OP_EVENT      = 0; // server → client: event
const OP_HELLO      = 1; // server → client: send heartbeat interval + identify
const OP_INITIALIZE = 2; // client → server: subscribe to a user
const OP_HEARTBEAT  = 3; // client → server: keep-alive ping

const WS_URL      = "wss://api.lanyard.rest/socket";
const REST_URL    = "https://api.lanyard.rest/v1/users";
const PLACEHOLDER = "PUT_DISCORD_ID_HERE";

// Module-level cache: keyed by Discord ID, stores the in-flight REST promise.
// Populated by prefetchLanyard() so the fetch starts before useEffect runs.
const prefetchCache = new Map<string, Promise<LanyardData | null>>();

/** Fire the Lanyard REST fetch immediately (safe to call during render). */
export function prefetchLanyard(discordId: string): void {
  if (!discordId || discordId === PLACEHOLDER) return;
  if (prefetchCache.has(discordId)) return;
  prefetchCache.set(
    discordId,
    fetch(`${REST_URL}/${discordId}`)
      .then((r) => r.json())
      .then((json: { data?: LanyardData }) => json.data ?? null)
      .catch(() => null),
  );
}

/** Returns the CDN URL for a user's Discord avatar. size defaults to 256. */
export function getAvatarUrl(data: LanyardData, size: 128 | 256 | 512 = 256): string {
  const { id, avatar, discriminator } = data.discord_user;
  if (avatar) {
    const ext = avatar.startsWith("a_") ? "gif" : "png";
    return `https://cdn.discordapp.com/avatars/${id}/${avatar}.${ext}?size=${size}`;
  }
  if (discriminator === "0") {
    const index = Number(BigInt(id) >> BigInt(22)) % 6;
    return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
  }
  return `https://cdn.discordapp.com/embed/avatars/${parseInt(discriminator) % 5}.png`;
}

export const STATUS_COLORS: Record<DiscordStatus, string> = {
  online:  "bg-green-500",
  idle:    "bg-yellow-400",
  dnd:     "bg-red-500",
  offline: "bg-gray-500",
};

export const STATUS_LABELS: Record<DiscordStatus, string> = {
  online:  "online",
  idle:    "idle",
  dnd:     "do not disturb",
  offline: "offline",
};

/**
 * Subscribes to a Discord user's presence via the Lanyard WebSocket.
 * Handles the HELLO handshake, heartbeat loop, INIT_STATE, and PRESENCE_UPDATE.
 * Auto-reconnects on unexpected close.
 */
export function useLanyard(discordId: string) {
  const [data, setData] = useState<LanyardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!discordId || discordId === PLACEHOLDER) {
      setLoading(false);
      return;
    }

    let destroyed      = false;
    let wsDataReceived = false; // prevents stale REST response from overwriting live WS data
    let ws: WebSocket | null = null;
    let heartbeatTimer: ReturnType<typeof setInterval>  | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    // Reuse an already-started prefetch, or start one now if prefetchLanyard wasn't called
    const restPromise =
      prefetchCache.get(discordId) ??
      (prefetchLanyard(discordId), prefetchCache.get(discordId)!);

    restPromise.then((d) => {
      if (!destroyed && !wsDataReceived && d) {
        setData(d);
        setLoading(false);
      }
    });

    function cleanup() {
      if (heartbeatTimer) { clearInterval(heartbeatTimer); heartbeatTimer = null; }
      if (reconnectTimer) { clearTimeout(reconnectTimer);  reconnectTimer = null; }
      if (ws) {
        ws.onclose = null; // prevent reconnect trigger
        ws.onerror = null;
        ws.onmessage = null;
        ws.close();
        ws = null;
      }
    }

    function connect() {
      cleanup(); // tear down any previous socket before opening a new one
      console.log(`[Lanyard WS] connecting for ${discordId}…`);
      ws = new WebSocket(WS_URL);

      ws.onmessage = (event: MessageEvent) => {
        let msg: { op: number; t?: string; d?: unknown };
        try { msg = JSON.parse(event.data as string); }
        catch { return; }

        console.log(`[Lanyard WS] ← op=${msg.op}${msg.t ? ` t=${msg.t}` : ""}`, msg.d);

        // ── HELLO: server sends heartbeat interval, we identify ──
        if (msg.op === OP_HELLO) {
          const hello = msg.d as { heartbeat_interval: number };

          // Start heartbeat
          heartbeatTimer = setInterval(() => {
            if (ws?.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ op: OP_HEARTBEAT }));
              console.log("[Lanyard WS] → heartbeat");
            }
          }, hello.heartbeat_interval);

          // Subscribe to the user
          ws!.send(JSON.stringify({ op: OP_INITIALIZE, d: { subscribe_to_id: discordId } }));
          console.log(`[Lanyard WS] → identify ${discordId}`);
        }

        // ── EVENT: INIT_STATE or PRESENCE_UPDATE ──
        if (msg.op === OP_EVENT && (msg.t === "INIT_STATE" || msg.t === "PRESENCE_UPDATE")) {
          const presence = msg.d as LanyardData;
          console.log(`[Lanyard WS] spotify:`, presence?.spotify ?? null);
          if (!destroyed) {
            wsDataReceived = true;
            setData(presence);
            setLoading(false);
          }
        }
      };

      ws.onerror = (err) => {
        console.error("[Lanyard WS] socket error:", err);
      };

      ws.onclose = (ev) => {
        console.warn(`[Lanyard WS] closed (code=${ev.code}) — reconnecting in 5 s`);
        if (heartbeatTimer) { clearInterval(heartbeatTimer); heartbeatTimer = null; }
        if (!destroyed) {
          reconnectTimer = setTimeout(connect, 5_000);
        }
      };
    }

    connect();

    return () => {
      destroyed = true;
      cleanup();
    };
  }, [discordId]);

  return { data, loading };
}
