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
    <section id="how-it-works" className="bg-blue-50 py-20">
      <div className="container mx-auto px-4">
        <h2 className="font-bold text-4xl md:text-5xl text-center text-gray-900 mb-16">
          Simple to use, powerful in impact.
        </h2>

        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="text-center">
                <div className="bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-10 h-10 text-[#E6B400]" />
                </div>
                <div className="bg-[#E6B400] text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                  {index + 1}
                </div>
                <h3 className="font-semibold text-xl mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            );
          })}
        </div>

        <div className="max-w-3xl mx-auto p-6 bg-white border-2 border-[#E6B400] rounded-lg">
          <div className="flex items-start gap-4">
            <Shield className="w-8 h-8 text-[#E6B400] flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-lg mb-2">Privacy First</h4>
              <p className="text-gray-700">
                TaskFixerAI processes uploads in real time and deletes them
                immediately. Teachers should remove student names before
                uploading. The platform aligns with privacy best practices but is
                not FERPA-certified.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link
            href="/chat"
            className="inline-block bg-gradient-to-r from-[#4FC3F7] to-[#E6B400] text-white font-bold text-lg px-9 py-4 rounded-[10px] hover:shadow-lg transition-all duration-300 uppercase"
          >
            Try TaskFixerAI Now →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
