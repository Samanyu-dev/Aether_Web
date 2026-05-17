import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { LiveCognitionReplay } from "@/components/live-cognition-replay"
import { ArchitectureVisuals } from "@/components/architecture-visuals"
import { DemoRecordings } from "@/components/demo-recordings"
import { AnalyticsSection } from "@/components/analytics-section"
import { SDKShowcase } from "@/components/sdk-showcase"
import { DeploymentShowcase } from "@/components/deployment-showcase"
import { VSCodePreview } from "@/components/vscode-preview"
import { CommunitySection } from "@/components/community-section"
import { FinalCTA } from "@/components/final-cta"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <LiveCognitionReplay />
      <ArchitectureVisuals />
      <DemoRecordings />
      <AnalyticsSection />
      <div id="sdk">
        <SDKShowcase />
      </div>
      <DeploymentShowcase />
      <VSCodePreview />
      <div id="community">
        <CommunitySection />
      </div>
      <FinalCTA />
      <Footer />
    </main>
  )
}
