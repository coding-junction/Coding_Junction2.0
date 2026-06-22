import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Partners | Global Network",
  description: "Explore the network of industry-leading organizations, universities, and tech companies that partner with Coding Junction.",
  openGraph: {
    title: "Community Partners | Global Network - Coding Junction",
    description: "Explore the network of industry-leading organizations, universities, and tech companies that partner with Coding Junction.",
  }
};

export default function CommunityPartnersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
