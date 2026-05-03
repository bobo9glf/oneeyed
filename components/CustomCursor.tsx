"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    // Inject cursor-hiding style scoped to this page's lifetime
    const style = document.createElement("style");
    style.textContent = "html, body, * { cursor: none !important; }";
    document.head.appendChild(style);

    const cursor = cursorRef.current;
    if (!cursor) return () => { document.head.removeChild(style); };

    const onMove = (e: MouseEvent) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top  = e.clientY + "px";
      if (cursor.style.opacity === "0") cursor.style.opacity = "1";
    };

    const onLeave = () => { cursor.style.opacity = "0"; };
    const onEnter = () => { cursor.style.opacity = "1"; };

    document.addEventListener("mousemove",  onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      document.removeEventListener("mousemove",  onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      aria-hidden
      style={{
        position:      "fixed",
        top:           0,
        left:          0,
        width:         "20px",
        height:        "20px",
        pointerEvents: "none",
        zIndex:        99999,
        opacity:       0,
        transform:     "translate(-50%, -50%)",
        transition:    "opacity 0.15s ease",
      }}
    >
      {/* Horizontal bar */}
      <div style={{
        position:   "absolute",
        top:        "50%",
        left:       0,
        width:      "100%",
        height:     "2px",
        background: "#ffffff",
        transform:  "translateY(-50%)",
      }} />
      {/* Vertical bar */}
      <div style={{
        position:   "absolute",
        left:       "50%",
        top:        0,
        width:      "2px",
        height:     "100%",
        background: "#ffffff",
        transform:  "translateX(-50%)",
      }} />
    </div>
  );
}
