"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const profiles = [
  {
    slug: "bobo",
    display: "bobo",
    emoji: "🎯",
    tagline: "content creator",
    color: "from-purple-900/40 to-indigo-900/40",
    border: "border-purple-500/20",
    glow: "hover:shadow-purple-500/20",
    dot: "bg-purple-400",
  },
  {
    slug: "fev",
    display: "fev",
    emoji: "⚡",
    tagline: "just vibing",
    color: "from-cyan-900/40 to-blue-900/40",
    border: "border-cyan-500/20",
    glow: "hover:shadow-cyan-500/20",
    dot: "bg-cyan-400",
  },
  {
    slug: "ayumu",
    display: "ayumu",
    emoji: "🌸",
    tagline: "aesthetic mode",
    color: "from-pink-900/40 to-rose-900/40",
    border: "border-pink-500/20",
    glow: "hover:shadow-pink-500/20",
    dot: "bg-pink-400",
  },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setMounted(true);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars: { x: number; y: number; r: number; alpha: number; speed: number }[] = [];
    for (let i = 0; i < 120; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.2,
        alpha: Math.random(),
        speed: Math.random() * 0.008 + 0.002,
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
        ctx.fillStyle = `rgba(255,255,255,${s.alpha * 0.6})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    }
    draw();

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.7 }}
      />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.02] blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-4 py-16 w-full max-w-5xl">
        <div
          className="mb-16 text-center"
          style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.8s ease" }}
        >
          <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-3 font-mono">
            select a profile
          </p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight shimmer-text">
            who are you here for?
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
          {profiles.map((p, i) => (
            <Link
              key={p.slug}
              href={`/${p.slug}`}
              className="block"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(30px)",
                transition: `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`,
              }}
            >
              <div
                className={`card-hover glass rounded-2xl p-8 border ${p.border} bg-gradient-to-br ${p.color} cursor-pointer hover:shadow-2xl ${p.glow} group`}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="text-5xl">{p.emoji}</div>
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-white tracking-tight mb-1">
                      {p.display}
                    </h2>
                    <p className="text-white/40 text-sm font-mono">{p.tagline}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`w-2 h-2 rounded-full ${p.dot} animate-pulse`} />
                    <span className="text-white/30 text-xs font-mono">view profile →</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-16 text-white/15 text-xs font-mono tracking-widest">
          © 2025 — all rights reserved
        </p>
      </div>
    </main>
  );
}
