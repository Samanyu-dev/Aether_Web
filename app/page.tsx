import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { WhyExists } from "@/components/why-exists"
import { ControlCodebases } from "@/components/control-codebases"
import { LiveCognitionReplay } from "@/components/live-cognition-replay"
import { HallucinationStory } from "@/components/hallucination-story"
import { ArchitectureVisuals } from "@/components/architecture-visuals"
import { LocalFirstShowcase } from "@/components/local-first-showcase"
import { SDKShowcase } from "@/components/sdk-showcase"
import { DemoRecordings } from "@/components/demo-recordings"
import { CommunitySection } from "@/components/community-section"
import { FinalCTA } from "@/components/final-cta"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-foreground">
      {/* Fixed Navigation Header */}
      <Navigation />

      {/* 1. Hero Section (Phase 5) */}
      <HeroSection />

      {/* 1.5 Why Aether Exists Section */}
      <WhyExists />
      {/* 1.6 Control Complex Codebases Section */}
      <ControlCodebases />

      {/* 2. Live Replay Preview (Interactive Walkthrough) */}
      <LiveCognitionReplay />

      {/* 3. Hallucination Detection Story (Phase 6: The most important section) */}
      <HallucinationStory />

      {/* 4. Replay Engine Explanation - How Aether Works */}
      <ArchitectureVisuals />

      {/* 5. Real SDK Onboarding & Simulated Terminal Playback */}
      <SDKShowcase />

      {/* 6. Local First Positioning - Privacy Sealed & git-friendly */}
      <LocalFirstShowcase />

      {/* 7. Demo Replays Library (Simple Reasoning, Tool Agent, Hallucinations) */}
      <DemoRecordings />

      {/* 8. Open Source & Community Engagement */}
      <div id="community">
        <CommunitySection />
      </div>

      {/* 9. Final Call-to-Action */}
      <FinalCTA />

      {/* 10. Footer Section */}
      <Footer />
    </main>
  )
}
