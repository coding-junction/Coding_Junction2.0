import About from "../About/page";
import CommunityPartners from "../CommunityPartners/page";
import Domains from "../Domains/page";
import Footer from "../Footer/page";
import Header from "../Header/page";
import NavBar from "../NavBar/page";
import Overview from "../Overview/page";
import Testimonial from "../Testimonial/page";
import UpcomingEvent from "../UpcomingEvent/page";

export default function Landing() {
  return (
    <>
        <NavBar />
        <Header />
        <UpcomingEvent />
        <Overview/>
        <Domains />
        <Testimonial/>
        <CommunityPartners />
        <About/>
        <Footer />
    </>
  );
}
