"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export interface SocialLink {
  label: string;
  value: string;
  href?: string;
  icon: "tiktok" | "roblox" | "discord" | "twitter" | "instagram" | "youtube" | "twitch";
}

export interface ProfileConfig {
  slug: string;
  username: string;
  tagline: string;
  avatarUrl: string;
  videoUrl?: string;
  musicUrl?: string;
  accentColor: string;
  socials: SocialLink[];
}

// SVG icons
const icons = {
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.88a8.16 8.16 0 004.77 1.52V7.01a4.85 4.85 0 01-1-.32z" />
    </svg>
  ),
  roblox: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M2.982 17.549l3.469-13.098 13.099 3.467-3.468 13.099-13.1-3.468zm5.322-6.617l-.74 2.794 2.793.739.74-2.793-2.793-.74z" />
    </svg>
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
  const [views, setViews] = useState<number | null>(null);
  const [muted, setMuted] = useState(true);
  const [musicOn, setMusicOn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setMounted(true);

    // Increment view count
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: config.slug }),
    })
      .then((r) => r.json())
      .then((d) => setViews(d.count))
      .catch(() => setViews(0));
  }, [config.slug]);

  const toggleMute = () => {
    setMuted((m) => {
      if (videoRef.current) videoRef.current.muted = !m;
      return !m;
    });
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (musicOn) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setMusicOn((v) => !v);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black flex flex-col items-center justify-center">
      {/* Video background */}
      {config.videoUrl ? (
        <video
          ref={videoRef}
          src={config.videoUrl}
          autoPlay
          loop
          muted={muted}
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a]" />
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Gradient accent overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(ellipse at center, ${config.accentColor}33 0%, transparent 70%)`,
        }}
      />

      {/* Back link */}
      <Link
        href="/"
        className="absolute top-5 left-5 z-20 text-white/40 hover:text-white/80 text-sm font-mono transition-colors flex items-center gap-2"
      >
        ← back
      </Link>

      {/* Video mute button */}
      {config.videoUrl && (
        <button
          onClick={toggleMute}
          className="absolute top-5 right-5 z-20 glass rounded-full px-4 py-2 text-xs font-mono text-white/60 hover:text-white transition-all"
        >
          {muted ? "🔇 unmute video" : "🔊 mute video"}
        </button>
      )}

      {/* Background music */}
      {config.musicUrl && (
        <audio ref={audioRef} src={config.musicUrl} loop preload="none" />
      )}

      {/* Profile card */}
      <div
        className="relative z-10 flex flex-col items-center gap-6 px-6 py-10 w-full max-w-sm"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        {/* Avatar */}
        <div
          className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-white/10 shadow-2xl"
          style={{ boxShadow: `0 0 40px ${config.accentColor}44` }}
        >
          {config.avatarUrl ? (
            <Image
              src={config.avatarUrl}
              alt={config.username}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-4xl"
              style={{ background: `${config.accentColor}22` }}
            >
              {config.username[0].toUpperCase()}
            </div>
          )}
        </div>

        {/* Name + tagline */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">{config.username}</h1>
          <p className="text-white/40 text-sm mt-1 font-mono">{config.tagline}</p>
        </div>

        {/* Divider */}
        <div className="w-16 h-px bg-white/10" />

        {/* Social links */}
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
                  <span className="text-white/60">{icons[s.icon]}</span>
                  <span className="text-xs font-mono text-white/40 uppercase tracking-wider w-16 shrink-0">
                    {s.label}
                  </span>
                  <span className="text-sm text-white/80 truncate">{s.value}</span>
                </a>
              ) : (
                <div className="glass flex items-center gap-3 rounded-xl px-4 py-3 w-full">
                  <span className="text-white/60">{icons[s.icon]}</span>
                  <span className="text-xs font-mono text-white/40 uppercase tracking-wider w-16 shrink-0">
                    {s.label}
                  </span>
                  <CopyableTag value={s.value} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Music toggle */}
        {config.musicUrl && (
          <button
            onClick={toggleMusic}
            className="glass flex items-center gap-3 rounded-xl px-4 py-3 w-full social-link"
          >
            <span className="text-white/60 text-lg">{musicOn ? "🎵" : "🎵"}</span>
            <span className="text-xs font-mono text-white/40 uppercase tracking-wider w-16 shrink-0">
              music
            </span>
            <span className="text-sm text-white/80">{musicOn ? "playing ▶" : "click to play"}</span>
            {musicOn && (
              <span className="ml-auto flex gap-0.5 items-end">
                {[3, 5, 4, 6, 3].map((h, i) => (
                  <span
                    key={i}
                    className="w-0.5 bg-white/50 rounded-full animate-pulse"
                    style={{ height: `${h * 2}px`, animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </span>
            )}
          </button>
        )}

        {/* View counter */}
        <div className="flex items-center gap-2 mt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white/25 text-xs font-mono">
            {views === null ? "loading..." : `${views.toLocaleString()} views`}
          </span>
        </div>
      </div>
    </div>
  );
}
