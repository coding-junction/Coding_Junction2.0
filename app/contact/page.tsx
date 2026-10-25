import type { Metadata } from "next";
import ContactClient from "@/components/contact/ContactClient";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Coding Junction. Reach out for queries, collaborations, partnerships, or just to say hello!",
  openGraph: {
    title: "Contact Us | Coding Junction",
    description:
      "Get in touch with Coding Junction. Reach out for queries, collaborations, partnerships, or just to say hello!",
  },
};

export default function ContactPage() {
  return (
    <main>
      <ContactClient />
    </main>
  );
}
