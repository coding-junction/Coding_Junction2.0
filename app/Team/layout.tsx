import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Core Team & Leadership",
  description: "Meet the brilliant minds driving Coding Junction forward. Our leadership team brings together expertise from diverse tech backgrounds.",
  openGraph: {
    title: "Core Team & Leadership - Coding Junction",
    description: "Meet the brilliant minds driving Coding Junction forward. Our leadership team brings together expertise from diverse tech backgrounds.",
  }
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
