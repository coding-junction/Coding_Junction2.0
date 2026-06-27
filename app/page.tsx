import Landing from "@/components/landing/landing-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coding Junction | Learn, Build, Innovate",
  description: "Welcome to Coding Junction, the official tech hub of UIT Burdwan. Discover our latest projects, join our hackathons, and become part of our elite developer network.",
  openGraph: {
    title: "Coding Junction | Learn, Build, Innovate",
    description: "Welcome to Coding Junction, the official tech hub of UIT Burdwan. Discover our latest projects, join our hackathons, and become part of our elite developer network.",
  }
};

export default function Home() {
  return (
    <main>
      <Landing/>
    </main>
  );
}
