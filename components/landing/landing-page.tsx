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
    <div className="relative w-full max-w-full overflow-x-hidden">
        <Header />
        <div className="relative z-10 w-full max-w-full overflow-x-hidden">
          <UpcomingEvent />
          <div className="section-divider" />
          <Overview />
          <div className="section-divider" />
          <Domains />
          <div className="section-divider" />
          <Testimonial />
          <div className="section-divider" />
          <CommunityPartnersClient />
          <div className="section-divider" />
          <About />
        </div>
    </div>
  );
}
