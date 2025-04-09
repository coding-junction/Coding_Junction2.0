import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Landing from "./Landing/page";



export default function Home() {
  return (
    <div>
      <Landing/>
    </div>
  );
}
