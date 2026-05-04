"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLanyard, getAvatarUrl, STATUS_COLORS } from "@/hooks/useLanyard";

/* ===== DISCORD IDs - SET THESE ===== */
const BOBO_DISCORD_ID  = "653657213872898090";   // bobo
const FEV_DISCORD_ID   = "728270929343545434";  // fev
const AYUMU_DISCORD_ID = "1422699223673208923"; // ayumu
/* ==================================== */

function ProfilePanel({
  slug,
  discordId,
  fallbackName,
  mounted,
  delayMs,
}: {
  slug: string;
  discordId: string;
  fallbackName: string;
  mounted: boolean;
  delayMs: number;
}) {
  const [hovered, setHovered] = useState(false);
  const { data } = useLanyard(discordId);

  const displayName = data?.discord_user?.global_name || data?.discord_user?.username || fallbackName;
  const avatarUrl   = data?.discord_user ? getAvatarUrl(data, 128) : null;
  const status      = data?.discord_status ?? null;
  const dotBg       = status ? STATUS_COLORS[status] : null;

  return (
    <Link href={`/${slug}`}>
      {/* Outer div handles mount slide-in */}
      <div
        style={{
          opacity:    mounted ? 1 : 0,
          transform:  mounted ? "translateX(0px)" : "translateX(28px)",
          transition: `opacity 0.7s ease ${delayMs}ms, transform 0.7s ease ${delayMs}ms`,
        }}
      >
        {/* Inner div handles hover glow + scale */}
        <div
          className="w-64 md:w-76 px-6 py-5 backdrop-blur-xl cursor-pointer"
          style={{
            background:  hovered
              ? "rgba(255,255,255,0.09)"
              : "rgba(255,255,255,0.055)",
            border:      `1px solid ${hovered ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.11)"}`,
            boxShadow:   hovered
              ? "0 0 24px rgba(255,255,255,0.1), 0 0 48px rgba(255,255,255,0.05), 0 8px 40px rgba(0,0,0,0.55)"
              : "0 4px 24px rgba(0,0,0,0.4)",
            transform:   hovered ? "scale(1.03)" : "scale(1)",
            transition:  "background 0.28s ease, border 0.28s ease, box-shadow 0.28s ease, transform 0.28s ease",
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className="flex items-center gap-4">
            {/* Avatar + status dot */}
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-full overflow-hidden border border-white/10">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={displayName}
                    width={56}
                    height={56}
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-white/[0.07] flex items-center justify-center">
                    <span className="text-white/35 text-xl font-light">
                      {fallbackName[0].toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              {dotBg && (
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-black ${dotBg}`}
                />
              )}
            </div>

            {/* Name + status label */}
            <div className="min-w-0">
              <h2 className="text-white/90 text-xl font-semibold tracking-wide truncate">
                {displayName}
              </h2>
              {status && (
                <p className="text-white/30 text-xs font-mono mt-0.5 tracking-widest">
                  {status}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function VolumeOnIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

function VolumeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}

export default function Home() {
  const [mounted, setMounted]     = useState(false);
  const [entered, setEntered]     = useState(false);
  const [volume, setVolume]       = useState(0.4);
  const [showSlider, setShowSlider] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef  = useRef<HTMLAudioElement>(null);

  // Typewriter animation for the browser tab title
  useEffect(() => {
    const text = "one eyed kings";
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;

    function step() {
      i++;
      document.title = text.slice(0, i);
      if (i >= text.length) {
        // Full text shown — wait 2s then restart
        timer = setTimeout(() => {
          i = 0;
          timer = setTimeout(step, 150);
        }, 2000);
      } else {
        timer = setTimeout(step, 150);
      }
    }

    timer = setTimeout(step, 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setMounted(true);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars: { x: number; y: number; r: number; alpha: number; speed: number }[] = [];
    for (let i = 0; i < 100; i++) {
      stars.push({
        x:     Math.random() * canvas.width,
        y:     Math.random() * canvas.height,
        r:     Math.random() * 1.2 + 0.2,
        alpha: Math.random(),
        speed: Math.random() * 0.006 + 0.002,
      });
    }

    let animId: number;
    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        s.alpha += s.speed;
        if (s.alpha > 1 || s.alpha < 0) s.speed *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.alpha * 0.45})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    }
    draw();

    const onResize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEnter = () => {
    setEntered(true);
    audioRef.current?.play().catch(() => {});
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value) / 100;
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black">

      {/* ── Audio ── */}
      <audio ref={audioRef} src="/media/homepage.mp3" loop preload="auto" />

      {/* ── Splash screen ── */}
      <div
        onClick={handleEnter}
        className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
        style={{
          background:    "rgba(0,0,0,0.88)",
          opacity:       entered ? 0 : mounted ? 1 : 0,
          transition:    entered ? "opacity 0.8s ease" : "opacity 0.5s ease",
          pointerEvents: entered ? "none" : "auto",
        }}
      >
        <p
          className="text-white/60 text-sm font-mono tracking-widest uppercase"
          style={{
            transform:  mounted && !entered ? "translateY(0)" : "translateY(6px)",
            transition: "transform 0.5s ease",
          }}
        >
          click to enter...
        </p>
      </div>

      {/* ── Volume control ── */}
      <div
        className="fixed bottom-6 right-6 z-30 flex flex-col items-center gap-2"
        style={{ opacity: entered ? 1 : 0, transition: "opacity 0.5s ease", pointerEvents: entered ? "auto" : "none" }}
        onMouseEnter={() => setShowSlider(true)}
        onMouseLeave={() => setShowSlider(false)}
      >
        <div
          className="flex flex-col items-center gap-2 rounded-xl px-3 py-3"
          style={{
            background:    "rgba(255,255,255,0.07)",
            border:        "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(12px)",
            opacity:       showSlider ? 1 : 0,
            transform:     showSlider ? "translateY(0)" : "translateY(6px)",
            transition:    "opacity 0.2s ease, transform 0.2s ease",
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
                position:  "absolute",
                width:     88,
                top:       "50%",
                left:      "50%",
                transform: "translate(-50%, -50%) rotate(-90deg)",
                cursor:    "pointer",
                accentColor: "#ffffff",
              }}
            />
          </div>
        </div>
        <button
          title={volume === 0 ? "Unmute" : "Mute"}
          onClick={() => {
            const next = volume === 0 ? 0.4 : 0;
            setVolume(next);
            if (audioRef.current) audioRef.current.volume = next;
          }}
          className="w-11 h-11 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-all"
          style={{
            background:    "rgba(255,255,255,0.07)",
            border:        "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(12px)",
          }}
        >
          {volume === 0 ? <VolumeOffIcon /> : <VolumeOnIcon />}
        </button>
      </div>

      {/* ── Video background ── */}
      <video
        src="/media/homepage.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* ── Base dark overlay ── */}
      <div className="absolute inset-0 bg-black/40" />

      {/* ── Left vignette ── */}
      <div
        className="absolute inset-y-0 left-0 w-3/4 pointer-events-none"
        style={{
          background: "linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.45) 40%, transparent 100%)",
        }}
      />

      {/* ── Bottom vignette ── */}
      <div
        className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 55%, transparent 100%)",
        }}
      />

      {/* ── Right gradient — pops the panels off the video ── */}
      <div
        className="absolute inset-y-0 right-0 w-1/2 pointer-events-none"
        style={{
          background: "linear-gradient(to left, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.35) 55%, transparent 100%)",
        }}
      />

      {/* ── Starfield ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.4 }}
      />

      {/* ── Title — vertically centered, left side ── */}
      <div
        className="absolute left-12 md:left-20 top-0 bottom-0 flex items-center z-10 pointer-events-none"
        style={{
          opacity:    mounted ? 1 : 0,
          transition: "opacity 1.4s ease 0.05s",
        }}
      >
        <h1
          className="text-white font-thin uppercase leading-snug"
          style={{
            fontSize:      "clamp(2rem, 4vw, 3.75rem)",
            letterSpacing: "0.35em",
            textShadow: [
              "0 0 35px rgba(255,255,255,0.35)",
              "0 0 70px rgba(255,255,255,0.12)",
              "0 0 120px rgba(255,255,255,0.05)",
            ].join(", "),
          }}
        >
          ONE<br />EYED<br />KINGS
        </h1>
      </div>

      {/* ── Profile panels — vertically centered, right side ── */}
      <div className="absolute right-8 md:right-14 top-0 bottom-0 flex flex-col justify-center gap-4 z-10">
        <ProfilePanel slug="bobo"  discordId={BOBO_DISCORD_ID}  fallbackName="bobo"  mounted={mounted} delayMs={180} />
        <ProfilePanel slug="fev"   discordId={FEV_DISCORD_ID}   fallbackName="fev"   mounted={mounted} delayMs={310} />
        <ProfilePanel slug="ayumu" discordId={AYUMU_DISCORD_ID} fallbackName="ayumu" mounted={mounted} delayMs={440} />
      </div>

    </main>
  );
}
