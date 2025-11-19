"use client";

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from './contexts/AuthContext';
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

function LandingPageContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get query parameters
  const canceled = searchParams.get('canceled');
  const success = searchParams.get('success');

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl p-3 animate-pulse">
            <img src="/logo.png" alt="TaskFixerAI" className="w-full h-full object-cover" />
          </div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page for both authenticated and non-authenticated users
  return (
    <div className="min-h-screen">
      <Header isLoggedIn={!!user} />
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

export default function LandingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl p-3 animate-pulse">
            <img src="/logo.png" alt="TaskFixerAI" className="w-full h-full object-cover" />
          </div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    }>
      <LandingPageContent />
    </Suspense>
  );
}
