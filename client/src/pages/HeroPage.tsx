import MarketingNavbar from '../components/layout/navbar/MarketingNavbar';
import HeroPreview from '../components/layout/landing/HeroPreview';
import HeroSection from '../components/layout/landing/HeroSection';
import FeaturesSection from '../components/layout/landing/FeaturesSection';
import HowItWorksSection from '../components/layout/landing/HowItWorksSection';

export default function HeroPage() {
  return (
    <main className='relative min-h-screen overflow-hidden bg-app-bg text-app-text'>
      <MarketingNavbar />

      <section className='relative min-h-screen overflow-hidden'>
        <div className='pointer-events-none absolute left-1/2 top-[-120px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl' />
        <div className='pointer-events-none absolute right-[-120px] top-32 h-[360px] w-[360px] rounded-full bg-teal-500/10 blur-3xl' />

        <div className='relative z-10 mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-6 pb-20 pt-32 lg:grid-cols-2 lg:px-8'>
          <HeroSection />
          <HeroPreview />
        </div>
      </section>

      <section className='relative -mt-32 overflow-hidden pt-32'>
        <div className='landing-mesh-bg pointer-events-none absolute inset-0' />

        <div className='relative z-10'>
          <FeaturesSection />
          <HowItWorksSection />
        </div>
      </section>
    </main>
  );
}
