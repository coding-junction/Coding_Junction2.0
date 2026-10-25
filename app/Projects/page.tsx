import type { Metadata } from "next";
import ProjectsClient from "@/components/projects/ProjectsClient";

export const metadata: Metadata = {
  title: "Project Showcase",
  description:
    "Explore amazing projects built by Coding Junction members. From web apps to AI models — see what our community is building.",
  openGraph: {
    title: "Project Showcase | Coding Junction",
    description:
      "Explore amazing projects built by Coding Junction members.",
  },
};

export default function ProjectsPage() {
  return (
    <main>
      <ProjectsClient />
    </main>
  );
}
