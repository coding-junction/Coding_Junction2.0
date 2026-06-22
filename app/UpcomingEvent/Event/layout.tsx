import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events & Hackathons",
  description: "Join upcoming technical challenges, hackathons, and exclusive events hosted by Coding Junction.",
  openGraph: {
    title: "Events & Hackathons - Coding Junction",
    description: "Join upcoming technical challenges, hackathons, and exclusive events hosted by Coding Junction.",
  }
};

export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
