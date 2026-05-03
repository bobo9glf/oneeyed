import ProfilePage from "@/components/ProfilePage";
import type { Metadata } from "next";

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
        tagline: "aesthetic mode",
        avatarUrl: "",
        videoUrl: "",
        musicUrl: "",
        accentColor: "#ec4899",
        socials: [
          {
            label: "TikTok",
            value: "@ayumu",
            href: "https://www.tiktok.com/@ayumu",
            icon: "tiktok",
          },
          {
            label: "Discord",
            value: "ayumu#0000",
            icon: "discord",
          },
        ],
      }}
    />
  );
}
