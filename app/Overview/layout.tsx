import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Overview | Mission & Impact",
  description: "Learn about the mission, values, and massive impact of Coding Junction. See our core team metrics and alumni network.",
  openGraph: {
    title: "Overview | Mission & Impact - Coding Junction",
    description: "Learn about the mission, values, and massive impact of Coding Junction. See our core team metrics and alumni network.",
  }
};

export default function OverviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
