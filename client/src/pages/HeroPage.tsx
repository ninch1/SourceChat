import HeroPreview from "../components/layout/hero/HeroPreview";
import HeroSection from "../components/layout/hero/HeroSection";

export default function HeroPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-app-bg text-app-text">
      <div className="pointer-events-none absolute left-1/2 top-[-120px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="pointer-events-none absolute right-[-120px] top-32 h-[360px] w-[360px] rounded-full bg-teal-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-140px] left-[-120px] h-[360px] w-[360px] rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8">
        <HeroSection />
        <HeroPreview />
      </div>
    </main>
  );
}
