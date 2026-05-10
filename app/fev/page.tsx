import ProfilePage from "@/components/ProfilePage";
import type { Metadata } from "next";

/* ===== FEV DISCORD ID - CHANGE THIS ===== */
const fevDiscordId = "728270929343545434"; // fev's Discord user ID
/* ========================================== */

/* ===== FEV MEDIA - CHANGE FILES HERE ===== */
const fevVideo = "/media/fev.mp4?v=2"; // drop fev.mp4 in public/media/
const fevAudio = "/media/fev.mp3"; // drop fev.mp3 in public/media/
/* ========================================== */

export const metadata: Metadata = {
  title: "fev",
  description: "fev's profile",
};

export default function FevPage() {
  return (
    <ProfilePage
      config={{
        slug: "fev",
        username: "fev",
        avatarUrl: "",
        discordId: fevDiscordId,
        videoUrl: fevVideo,
        musicUrl: fevAudio,
        accentColor: "#06b6d4",
        viewOffset: 420,
        socials: [
          {
            label: "Roblox",
            value: "fev",
            href: "https://www.roblox.com/users/379485945/profile",
            icon: "roblox",
          },
          {
            label: "Discord",
            value: "fevvex",
            icon: "discord",
          },
        ],
      }}
    />
  );
}
