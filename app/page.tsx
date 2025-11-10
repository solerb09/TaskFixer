import Header from './components/landing/Header';
import Hero from './components/landing/Hero';
import ProblemSection from './components/landing/ProblemSection';
import TransformationSection from './components/landing/TransformationSection';
import ComparisonTable from './components/landing/ComparisonTable';
import HowItWorks from './components/landing/HowItWorks';
import FeaturesSection from './components/landing/FeaturesSection';
import AboutCreator from './components/landing/AboutCreator';
import Testimonials from './components/landing/Testimonials';
import DataPrivacy from './components/landing/DataPrivacy';
import FinalCTA from './components/landing/FinalCTA';
import PricingSection from './components/landing/PricingSection';
import Footer from './components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <ProblemSection />
        <TransformationSection />
        <ComparisonTable />
        <HowItWorks />
        <FeaturesSection />
        <AboutCreator />
        <Testimonials />
        <DataPrivacy />
        <FinalCTA />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
