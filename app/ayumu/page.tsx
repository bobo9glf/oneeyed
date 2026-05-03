import ProfilePage from "@/components/ProfilePage";
import type { Metadata } from "next";

/* ===== AYUMU DISCORD ID - CHANGE THIS ===== */
const ayumuDiscordId = "1422699223673208923"; // ayumu's Discord user ID
/* ============================================ */

/* ===== AYUMU MEDIA - CHANGE FILES HERE ===== */
const ayumuVideo = "/media/ayumu.mp4"; // drop ayumu.mp4 in public/media/
const ayumuAudio = "/media/ayumu.mp3"; // drop ayumu.mp3 in public/media/
/* ============================================ */

export const metadata: Metadata = {
  title: "ayumu",
  description: "ayumu's profile",
};

export default function AyumuPage() {
  return (
    <ProfilePage
      config={{
        slug: "ayumu",
        username: "ayumu",
        avatarUrl: "",
        discordId: ayumuDiscordId,
        videoUrl: ayumuVideo,
        musicUrl: ayumuAudio,
        accentColor: "#ec4899",
        viewOffset: 690,
        socials: [
          {
            label: "Roblox",
            value: "ayumu",
            href: "https://www.roblox.com/users/286677024/profile",
            icon: "roblox",
          },
          {
            label: "Discord",
            value: "6glf",
            icon: "discord",
          },
        ],
      }}
    />
  );
}
