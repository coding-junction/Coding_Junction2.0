import About from "@/components/landing/about";
import CommunityPartnersClient from "@/components/CommunityPartnersClient";
import Domains from "@/components/landing/domains";
// Footer is provided globally in layout.tsx
import Header from "@/components/landing/header";
import Overview from "@/components/landing/overview";
import Testimonial from "@/components/landing/testimonial";
import UpcomingEvent from "@/components/landing/upcoming-events";

export default function Landing() {
  return (
    <>
        <Header />
        <UpcomingEvent />
        <Overview/>
        <Domains />
        <Testimonial/>
        <CommunityPartnersClient />
        <About/>
    </>
  );
}
