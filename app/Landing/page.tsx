import { About } from "../About/page";
import { Domains } from "../Domains/page";
import { Footer } from "../Footer/page";
import { Header } from "../Header/page";
import { NavBar } from "../NavBar/page";
import Overview from "../Overview/page";
import { Testimonial } from "../Testimonial/page";
import UpcomingEvent from "../UpcomingEvent/page";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';




export default function Landing() {
  return (
    <div>
      
        <NavBar />
        <Header />
        <UpcomingEvent />
        <Overview/>
        <Domains />
        <Testimonial/>
        <About/>
        <Footer />
        
    </div>
  );
}
