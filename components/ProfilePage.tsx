"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanyard, prefetchLanyard, getAvatarUrl, STATUS_COLORS, STATUS_LABELS } from "@/hooks/useLanyard";
import CustomCursor from "@/components/CustomCursor";

export interface SocialLink {
  label: string;
  value: string;
  href?: string;
  icon: "tiktok" | "roblox" | "discord" | "twitter" | "instagram" | "youtube" | "twitch";
}

export interface ProfileConfig {
  slug: string;
  username: string;
  tagline?: string;
  location?: string;
  avatarUrl: string;
  discordId: string;
  videoUrl?: string;
  musicUrl?: string;
  accentColor: string;
  defaultVolume?: number;
  viewOffset?: number;
  socials: SocialLink[];
}

const icons = {
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.88a8.16 8.16 0 004.77 1.52V7.01a4.85 4.85 0 01-1-.32z" />
    </svg>
  ),
  roblox: (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/media/roblox.png" alt="Roblox" width={20} height={20} style={{ display: "block", objectFit: "contain", filter: "brightness(0) invert(1)" }} />
  ),
  discord: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  twitch: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
    </svg>
  ),
};

function VolumeOnIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  );
}

function VolumeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z" />
    </svg>
  );
}

function CopyableTag({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors cursor-pointer"
    >
      <span>{value}</span>
      <span className="text-xs text-white/30">{copied ? "copied!" : "(click to copy)"}</span>
    </button>
  );
}

export default function ProfilePage({ config }: { config: ProfileConfig }) {
  // Start the Lanyard REST fetch immediately during render, before useEffect fires
  prefetchLanyard(config.discordId);

  const [views, setViews]           = useState<number | null>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [volume, setVolume]         = useState(config.defaultVolume ?? 0.25);
  const [showSlider, setShowSlider] = useState(false);
  const [mounted, setMounted]       = useState(false);
  const [entered, setEntered]       = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { data: lanyard, loading: lanyardLoading } = useLanyard(config.discordId);

  // Resolved display values
  const displayName   = lanyard?.discord_user.global_name || lanyard?.discord_user.username || config.username;
  const displayAvatar = lanyard != null ? getAvatarUrl(lanyard) : config.avatarUrl;
  const status        = lanyard?.discord_status ?? null;
  const dotColor      = status != null ? STATUS_COLORS[status] : null;
  const statusLabel   = status != null ? STATUS_LABELS[status] : null;

  // Read spotify/game directly — don't rely on listening_to_spotify flag
  const spotify = lanyard?.spotify ?? null;
  const game    = (spotify == null && lanyard != null)
    ? (lanyard.activities?.find((a) => a.type === 0) ?? null)
    : null;

  // Mount: increment + fetch view count from CounterAPI
  useEffect(() => {
    setMounted(true);
    fetch(`/api/counter/${config.slug}`)
      .then((r) => r.json())
      .then((d) => setViews((d.count ?? 0) + (config.viewOffset ?? 0)))
      .catch(() => setViews(0));
  }, [config.slug]);

  // Set initial audio volume — music starts on user entry via the splash screen
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !config.musicUrl) return;
    audio.volume = config.defaultVolume ?? 0.25;
  }, [config.musicUrl, config.defaultVolume]);

  const handleEnter = () => {
    setEntered(true);
    if (audioRef.current && config.musicUrl) {
      audioRef.current.play().catch(() => {});
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value) / 100;
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black flex flex-col items-center justify-center">
      <CustomCursor />

      {/* Splash screen — fades in on load, fades out on click, then starts music */}
      <div
        onClick={handleEnter}
        className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
        style={{
          background:             "rgba(0,0,0,0.88)",
          opacity:                entered ? 0 : mounted ? 1 : 0,
          transition:             entered
            ? "opacity 0.8s ease"
            : "opacity 0.5s ease",
          pointerEvents:          entered ? "none" : "auto",
        }}
      >
        <p
          className="text-white/60 text-sm font-mono tracking-widest uppercase"
          style={{
            transform: mounted && !entered ? "translateY(0)" : "translateY(6px)",
            transition: "transform 0.5s ease",
          }}
        >
          click to enter...
        </p>
      </div>

      {/* Video background — falls back to dark gradient if file missing or load fails */}
      {config.videoUrl && !videoFailed ? (
        <video
          ref={videoRef}
          src={config.videoUrl}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoFailed(true)}
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a]" />
      )}

      <div className="absolute inset-0 bg-black/50" />

      <div
        className="absolute inset-0 opacity-20"
        style={{ background: `radial-gradient(ellipse at center, ${config.accentColor}33 0%, transparent 70%)` }}
      />

      {/* Audio element (hidden) */}
      {config.musicUrl && (
        <audio ref={audioRef} src={config.musicUrl} loop preload="auto" />
      )}

      {/* ── Top-left: back link ── */}
      <Link
        href="/"
        className="absolute top-5 left-5 z-20 text-white/40 hover:text-white/80 text-sm font-mono transition-colors"
      >
        ← back
      </Link>

      {/* ── Bottom-right: volume slider ── */}
      {config.musicUrl && (
        <div
          className="fixed bottom-6 right-6 z-30 flex flex-col items-center gap-2"
          onMouseEnter={() => setShowSlider(true)}
          onMouseLeave={() => setShowSlider(false)}
        >
          {/* Slider panel */}
          <div
            className="flex flex-col items-center gap-2 glass rounded-xl px-3 py-3"
            style={{
              opacity: showSlider ? 1 : 0,
              transform: showSlider ? "translateY(0)" : "translateY(6px)",
              transition: "opacity 0.2s ease, transform 0.2s ease",
              pointerEvents: showSlider ? "auto" : "none",
            }}
          >
            <span className="text-white/60 text-xs font-mono w-8 text-center">
              {Math.round(volume * 100)}%
            </span>
            <div style={{ height: 88, width: 20, position: "relative" }}>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(volume * 100)}
                onChange={handleVolumeChange}
                style={{
                  position: "absolute",
                  width: 88,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%) rotate(-90deg)",
                  cursor: "pointer",
                  accentColor: config.accentColor,
                }}
              />
            </div>
          </div>

          {/* Speaker icon */}
          <button
            title={volume === 0 ? "Unmute" : "Mute"}
            onClick={() => {
              const next = volume === 0 ? (config.defaultVolume ?? 0.25) : 0;
              setVolume(next);
              if (audioRef.current) audioRef.current.volume = next;
            }}
            className="w-11 h-11 rounded-full glass flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
          >
            {volume === 0 ? <VolumeOffIcon /> : <VolumeOnIcon />}
          </button>
        </div>
      )}

      {/* ── Profile card ── */}
      <div
        className="relative z-10 flex flex-col items-center gap-6 px-6 py-10 w-full max-w-sm"
        style={{
          opacity:    mounted ? 1 : 0,
          transform:  mounted ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        {/* Avatar + status dot */}
        <div className="relative">
          <div
            className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-white/10 shadow-2xl"
            style={{ boxShadow: `0 0 40px ${config.accentColor}44` }}
          >
            {/* Skeleton — pulses while Lanyard loads, fades out once data arrives */}
            <div
              className="absolute inset-0 animate-pulse bg-white/10"
              style={{
                opacity: lanyardLoading ? 1 : 0,
                transition: "opacity 0.5s ease",
                pointerEvents: "none",
              }}
            />
            {/* Real avatar — fades in once Lanyard data arrives */}
            <div
              className="absolute inset-0"
              style={{
                opacity: lanyardLoading ? 0 : 1,
                transition: "opacity 0.5s ease",
              }}
            >
              {displayAvatar && (
                <Image src={displayAvatar} alt={displayName} fill className="object-cover" unoptimized />
              )}
            </div>
          </div>
          {dotColor && (
            <span className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-black ${dotColor}`} />
          )}
        </div>

        {/* Name + location + status */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">{displayName}</h1>

          {config.location && (
            <p
              className="text-xs mt-1.5 tracking-widest font-mono"
              style={{
                color: "rgba(186, 230, 253, 0.85)",
                textShadow: [
                  "0 0 6px rgba(147, 197, 253, 0.9)",
                  "0 0 14px rgba(147, 197, 253, 0.5)",
                  "0 0 28px rgba(147, 197, 253, 0.2)",
                ].join(", "),
              }}
            >
              📍 {config.location}
            </p>
          )}

          {statusLabel && (
            <p className={`text-xs font-mono mt-1 ${
              status === "online"  ? "text-green-400/80"  :
              status === "idle"    ? "text-yellow-400/80" :
              status === "dnd"     ? "text-red-400/80"    :
                                     "text-gray-400/60"
            }`}>
              ● {statusLabel}
            </p>
          )}
        </div>

        <div className="w-16 h-px bg-white/10" />

        {/* ── Game activity (above socials) ── */}
        {game != null && (
          <div className="glass flex items-center gap-3 rounded-xl px-4 py-3 w-full">
            <span className="text-xl shrink-0">🎮</span>
            <div className="flex-1 min-w-0">
              <p className="text-white/90 text-sm font-medium truncate">{game.name}</p>
              {game.details != null && (
                <p className="text-white/45 text-xs truncate">{game.details}</p>
              )}
            </div>
            <span className="text-white/30 text-xs font-mono shrink-0">playing</span>
          </div>
        )}

        {/* ── Social links ── */}
        <div className="flex flex-col gap-2.5 w-full">
          {config.socials.map((s) => (
            <div key={s.label}>
              {s.href ? (
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link glass flex items-center gap-3 rounded-xl px-4 py-3 w-full"
                >
                  <span className="inline-flex items-center justify-center w-5 h-5 shrink-0 text-white/60">{icons[s.icon]}</span>
                  <span className="text-xs font-mono text-white/40 uppercase tracking-wider w-16 shrink-0">
                    {s.label}
                  </span>
                  <span className="text-sm text-white/80 truncate">{s.value}</span>
                </a>
              ) : (
                <div className="social-link glass flex items-center gap-3 rounded-xl px-4 py-3 w-full">
                  <span className="inline-flex items-center justify-center w-5 h-5 shrink-0 text-white/60">{icons[s.icon]}</span>
                  <span className="text-xs font-mono text-white/40 uppercase tracking-wider w-16 shrink-0">
                    {s.label}
                  </span>
                  <CopyableTag value={s.value} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Spotify section (below socials) ── */}
        {spotify != null && (
          <div className="glass flex items-center gap-3 rounded-xl px-4 py-3 w-full border border-[#1DB954]/20">
            {/* Album art */}
            <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0 border border-white/10">
              <Image
                src={spotify.album_art_url}
                alt={spotify.album}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Song + artist */}
            <div className="flex-1 min-w-0">
              {/* "Listening to Spotify" label */}
              <div className="flex items-center gap-1.5 mb-0.5">
                {/* Spotify icon */}
                <svg viewBox="0 0 24 24" fill="#1DB954" className="w-3 h-3 shrink-0">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
                <span className="text-[#1DB954] text-xs font-mono">Listening to Spotify</span>
              </div>
              <p className="text-white/90 text-sm font-semibold truncate leading-tight">{spotify.song}</p>
              <p className="text-white/45 text-xs truncate">{spotify.artist}</p>
            </div>
          </div>
        )}

        {/* ── View counter ── */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-white/25 text-xs font-mono">
            {views === null ? "loading..." : `👁 ${views.toLocaleString()} views`}
          </span>
        </div>
      </div>
    </div>
  );
}
