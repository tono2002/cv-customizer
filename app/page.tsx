import { Nav } from "./components/landing/Nav";
import { Hero } from "./components/landing/Hero";
import { HowItWorks } from "./components/landing/HowItWorks";
import { Features } from "./components/landing/Features";
import { Pricing } from "./components/landing/Pricing";
import { FinalCTA } from "./components/landing/FinalCTA";
import { Footer } from "./components/landing/Footer";
import { CursorGlow } from "./components/landing/CursorGlow";

export default function LandingPage() {
  return (
    <main className="landing-root relative min-h-screen overflow-x-hidden">
      <CursorGlow />
      <Nav />
      <Hero />
      <HowItWorks />
      <Features />
      <Pricing />
      <FinalCTA />
      <Footer />
    </main>
  );
}
