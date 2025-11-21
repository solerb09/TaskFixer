'use client';

import { CheckCircle } from 'lucide-react';

const TransformationSection = () => {
  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  const benefits = [
    'Builds tasks that require reasoning, creativity, and analysis.',
    'Provides scaffolded and advanced versions that meet diverse learning needs.',
    'Adds reflection prompts that make student thinking visible.',
    'Includes optional AI guidance that teaches students how to use technology ethically and effectively.',
  ];

  return (
    <section className="bg-white py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
          <div>
            <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-5 sm:mb-6 md:mb-8">
              From simple worksheets to authentic learning experiences.
            </h2>

            <div className="space-y-3 sm:space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle className="text-[#E6B400] w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5 sm:mt-1" />
                  <p className="text-sm sm:text-base md:text-lg text-gray-700">{benefit}</p>
                </div>
              ))}
            </div>

            <button
              onClick={scrollToHowItWorks}
              className="mt-6 sm:mt-8 bg-gradient-to-r from-[#A855F7] via-[#F97316] to-[#FBBF24] text-white font-bold text-sm sm:text-base md:text-lg px-6 sm:px-7 md:px-9 py-3 sm:py-3.5 md:py-4 rounded-[10px] hover:shadow-lg transition-all duration-300 uppercase"
            >
              Redesign My Assignment →
            </button>
          </div>

          <div className="mt-6 md:mt-0">
            <img
              src="/transformation-section.jpg"
              alt="Students collaborating and discussing assignments together"
              className="rounded-lg shadow-lg w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransformationSection;
