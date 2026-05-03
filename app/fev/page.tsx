import ProfilePage from "@/components/ProfilePage";
import type { Metadata } from "next";

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
        tagline: "just vibing",
        avatarUrl: "",
        videoUrl: "",
        musicUrl: "",
        accentColor: "#06b6d4",
        socials: [
          {
            label: "TikTok",
            value: "@fev",
            href: "https://www.tiktok.com/@fev",
            icon: "tiktok",
          },
          {
            label: "Discord",
            value: "fev#0000",
            icon: "discord",
          },
        ],
      }}
    />
  );
}
