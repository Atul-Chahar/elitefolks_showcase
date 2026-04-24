import { HeroSection } from "@/components/hero-section"
import { ScrollSequenceSection } from "@/components/ScrollSequenceSection"
import { SignalsSection } from "@/components/signals-section"
import { WorkSection } from "@/components/work-section"
import ContactSection from "@/components/landing/ContactSection"
import { PrinciplesSection } from "@/components/principles-section"
import { SideNav } from "@/components/side-nav"

export default function Page() {
  return (
    <main className="relative min-h-screen bg-black">
      <SideNav />
      <div className="grid-bg fixed inset-0 opacity-30" aria-hidden="true" />

      <div className="relative z-10 w-full">
        {/* Core Hero Component */}
        <HeroSection />

        {/* The Movie-like GSAP Storytelling Scroll */}
        <ScrollSequenceSection />

        {/* Core Sections */}
        <SignalsSection />
        <WorkSection />
        <PrinciplesSection />
        <ContactSection />
      </div>
    </main>
  )
}
