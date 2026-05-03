"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanyard, getAvatarUrl, STATUS_COLORS, STATUS_LABELS } from "@/hooks/useLanyard";

interface ProfileCardProps {
  slug: string;
  discordId: string;
  fallbackName: string;
  fallbackEmoji: string;
  tagline: string;
  color: string;
  border: string;
  glow: string;
  style?: React.CSSProperties;
}

export default function ProfileCard({
  slug, discordId, fallbackName, fallbackEmoji, tagline, color, border, glow, style,
}: ProfileCardProps) {
  const { data } = useLanyard(discordId);

  const status     = data?.discord_status ?? null;
  const dotColor   = status ? STATUS_COLORS[status] : null;
  const statusText = status ? STATUS_LABELS[status] : null;
  const avatarUrl  = data ? getAvatarUrl(data) : null;
  const displayName = data?.discord_user.global_name || data?.discord_user.username || fallbackName;

  let activityText: string | null = null;
  if (data?.listening_to_spotify && data.spotify) {
    activityText = `🎵 ${data.spotify.song} — ${data.spotify.artist}`;
  } else {
    const game = data?.activities?.find((a) => a.type === 0);
    if (game) activityText = `🎮 ${game.name}`;
  }

  return (
    <Link href={`/${slug}`} className="block" style={style}>
      <div
        className={`card-hover glass rounded-2xl p-8 border ${border} bg-gradient-to-br ${color} cursor-pointer hover:shadow-2xl ${glow} group`}
      >
        <div className="flex flex-col items-center gap-4">

          {/* Avatar with status dot, or emoji fallback */}
          <div className="relative">
            {avatarUrl ? (
              <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10 shadow-lg">
                <Image
                  src={avatarUrl}
                  alt={displayName}
                  width={64}
                  height={64}
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="text-5xl leading-none">{fallbackEmoji}</div>
            )}
            {dotColor && (
              <span
                className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#0d0d0d] ${dotColor}`}
              />
            )}
          </div>

          {/* Name + tagline + optional activity */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white tracking-tight mb-1">{displayName}</h2>
            <p className="text-white/40 text-sm font-mono">{tagline}</p>
            {activityText && (
              <p className="text-white/30 text-xs font-mono mt-1.5 truncate max-w-[190px]">
                {activityText}
              </p>
            )}
          </div>

          {/* Status + CTA */}
          <div className="flex items-center gap-2 mt-1">
            <span className={`w-2 h-2 rounded-full ${dotColor ?? "bg-gray-500"}`} />
            <span className="text-white/30 text-xs font-mono">
              {statusText ? `${statusText} · ` : ""}view profile →
            </span>
          </div>

        </div>
      </div>
    </Link>
  );
}
