'use client';

import { Upload, Sparkles, Download, Users, Shield } from 'lucide-react';
import Link from 'next/link';

const HowItWorks = () => {
  const steps = [
    {
      icon: Upload,
      title: 'Upload your assignment',
      description: '(.pdf, .docx, or paste text). Remove student names or identifiers.',
    },
    {
      icon: Sparkles,
      title: 'TaskFixerAI redesigns your task',
      description: 'to increase rigor, creativity, and engagement.',
    },
    {
      icon: Download,
      title: 'Review and download',
      description:
        'a print-ready version with reflection prompts and student instructions.',
    },
    {
      icon: Users,
      title: 'Use it in class',
      description: 'to encourage deep thinking and responsible learning.',
    },
  ];

  return (
    <section id="how-it-works" className="bg-blue-50 py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center text-gray-900 mb-8 sm:mb-12 md:mb-16">
          Simple to use, powerful in impact.
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="text-center">
                <div className="bg-yellow-100 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#E6B400]" />
                </div>
                <div className="bg-[#E6B400] text-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 font-bold text-xs sm:text-sm md:text-base">
                  {index + 1}
                </div>
                <h3 className="font-semibold text-sm sm:text-base md:text-lg lg:text-xl mb-2 sm:mb-3 text-gray-900">{step.title}</h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-800">{step.description}</p>
              </div>
            );
          })}
        </div>

        <div className="max-w-3xl mx-auto p-4 sm:p-5 md:p-6 bg-white border-2 border-[#E6B400] rounded-lg">
          <div className="flex items-start gap-3 sm:gap-4">
            <Shield className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#E6B400] flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Privacy First</h4>
              <p className="text-sm sm:text-base text-gray-700">
                TaskFixerAI processes uploads in real time and deletes them
                immediately. Teachers should remove student names before
                uploading. The platform aligns with privacy best practices but is
                not FERPA-certified.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 sm:mt-10">
          <Link
            href="/auth/signup?redirect=%2Fchat"
            className="inline-block bg-gradient-to-r from-[#A855F7] via-[#F97316] to-[#FBBF24] text-white font-bold text-sm sm:text-base md:text-lg px-6 sm:px-7 md:px-9 py-3 sm:py-3.5 md:py-4 rounded-[10px] hover:shadow-lg transition-all duration-300 uppercase"
          >
            Try TaskFixerAI Now →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
