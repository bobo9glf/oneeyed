import ProfilePage from "@/components/ProfilePage";
import type { Metadata } from "next";

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
        tagline: "content creator",
        avatarUrl: "",
        videoUrl: "",
        musicUrl: "/music/bobo.mp3",
        accentColor: "#a855f7",
        socials: [
          {
            label: "TikTok",
            value: "@boborealfr",
            href: "https://www.tiktok.com/@boborealfr",
            icon: "tiktok",
          },
          {
            label: "Roblox",
            value: "bobo (418288803)",
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
