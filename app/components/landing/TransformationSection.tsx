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
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-bold text-4xl md:text-5xl text-gray-900 mb-8">
              From simple worksheets to authentic learning experiences.
            </h2>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="text-[#E6B400] w-6 h-6 flex-shrink-0 mt-1" />
                  <p className="text-lg text-gray-700">{benefit}</p>
                </div>
              ))}
            </div>

            <button
              onClick={scrollToHowItWorks}
              className="mt-8 bg-gradient-to-r from-[#4FC3F7] to-[#E6B400] text-white font-bold text-lg px-9 py-4 rounded-[10px] hover:shadow-lg transition-all duration-300 uppercase"
            >
              Redesign My Assignment →
            </button>
          </div>

          <div>
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
