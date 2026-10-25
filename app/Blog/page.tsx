import type { Metadata } from "next";
import BlogClient from "@/components/blog/BlogClient";

export const metadata: Metadata = {
  title: "Blog | Tech Articles & Tutorials",
  description:
    "Read the latest tech articles, tutorials, and insights from the Coding Junction community. Covering Web Dev, AI/ML, DSA, App Development, and more.",
  openGraph: {
    title: "Blog | Coding Junction",
    description:
      "Read the latest tech articles, tutorials, and insights from the Coding Junction community.",
  },
};

export default function BlogPage() {
  return (
    <main>
      <BlogClient />
    </main>
  );
}
