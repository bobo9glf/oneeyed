import ProfilePage from "@/components/ProfilePage";
import type { Metadata } from "next";

/* ===== BOBO DISCORD ID - CHANGE THIS ===== */
const boboDiscordId = "653657213872898090"; // bobo's Discord user ID
/* =========================================== */

/* ===== BOBO MEDIA - CHANGE FILES HERE ===== */
const boboVideo = "/media/bobo.mp4"; // drop bobo.mp4 in public/media/
const boboAudio = "/media/bobo.mp3"; // drop bobo.mp3 in public/media/
/* =========================================== */

export const metadata: Metadata = {
  title: "bobo",
  description: "bobo's profile",
};

export default function BoboPage() {
  return (
    <ProfilePage
      config={{
        slug: "bobo",
        username: "bobo",
        location: "Night City",
        avatarUrl: "",
        discordId: boboDiscordId,
        videoUrl: boboVideo,
        musicUrl: boboAudio,
        accentColor: "#a855f7",
        defaultVolume: 0.5,
        viewOffset: 1837,
        socials: [
          {
            label: "TikTok",
            value: "@boborealfr",
            href: "https://www.tiktok.com/@boborealfr",
            icon: "tiktok",
          },
          {
            label: "Roblox",
            value: "bobo",
            href: "https://www.roblox.com/users/418288803/profile",
            icon: "roblox",
          },
          {
            label: "Discord",
            value: "9glf",
            icon: "discord",
          },
        ],
      }}
    />
  );
}
