import About from "@/components/landing/about";
import CommunityPartnersClient from "@/components/CommunityPartnersClient";
import Domains from "@/components/landing/domains";
import FAQ from "@/components/landing/faq";
// Footer is provided globally in layout.tsx
import Header from "@/components/landing/header";
import Journey from "@/components/landing/journey";
import Overview from "@/components/landing/overview";
import ProjectShowcase from "@/components/landing/project-showcase";
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
          <ProjectShowcase />
          <div className="section-divider" />
          <Testimonial />
          <div className="section-divider" />
          <CommunityPartnersClient />
          <div className="section-divider" />
          <About />
          <div className="section-divider" />
          <Journey />
          <div className="section-divider" />
          <FAQ />
        </div>
    </div>
  );
}
