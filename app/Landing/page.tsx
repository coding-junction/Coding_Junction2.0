import About from "../About/page";
import Domains from "../Domains/page";
import Footer from "../Footer/page";
import Header from "../Header/page";
import NavBar from "../NavBar/page";
import Overview from "../Overview/page";
import Testimonial from "../Testimonial/page";
import UpcomingEvent from "../UpcomingEvent/page";
import Advisor from "../Advisor/page";

export default function Landing() {
  return (
    <div>
        <NavBar />
        <Header />
        <UpcomingEvent />
        <Advisor />
        <Overview/>
        <Domains />
        <Testimonial/>
        <About/>
        <Footer />
    </div>
  );
}
