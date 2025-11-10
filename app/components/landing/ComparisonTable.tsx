'use client';

import { FileText, Lightbulb, Laptop } from 'lucide-react';

const ComparisonTable = () => {
  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  const comparisons = [
    {
      before: 'List three causes of the American Revolution.',
      after:
        'Compare two short explanations of the American Revolution, identify differences in perspective, and explain which version is more accurate and why.',
      responsibleAI:
        'Students ask AI to summarize one source, then evaluate accuracy or bias before writing their own explanation.',
    },
    {
      before: 'Solve 10 linear equations.',
      after:
        'Analyze an AI-generated solution for one equation, identify where reasoning fails, and explain how to fix it.',
      responsibleAI:
        'Students ask AI to check their work step by step, then explain where reasoning differed and why their method is stronger.',
    },
    {
      before: 'Write a five-paragraph essay about climate change.',
      after:
        'Evaluate short summaries about climate change, identify bias, and create a unique argument supported by evidence and personal insight.',
      responsibleAI:
        "Students use AI to explore different viewpoints, analyze credibility, and reflect on how AI's writing differs from their own.",
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <h2 className="font-bold text-4xl md:text-5xl text-center text-gray-900 mb-12">
          See how TaskFixerAI transforms assignments and teaches responsible AI
          use.
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-6 text-left">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-gray-600" />
                    <span className="font-semibold text-lg text-gray-900">Before</span>
                  </div>
                </th>
                <th className="p-6 text-left">
                  <div className="flex items-center gap-3">
                    <Lightbulb className="w-6 h-6 text-[#E6B400]" />
                    <span className="font-semibold text-lg text-gray-900">
                      After (TaskFixerAI Redesign)
                    </span>
                  </div>
                </th>
                <th className="p-6 text-left">
                  <div className="flex items-center gap-3">
                    <Laptop className="w-6 h-6 text-[#4FC3F7]" />
                    <span className="font-semibold text-lg text-gray-900">
                      Responsible AI Use
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((row, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="p-6 text-gray-900">{row.before}</td>
                  <td className="p-6 text-gray-900 bg-yellow-50">{row.after}</td>
                  <td className="p-6 text-gray-900 bg-blue-50">
                    {row.responsibleAI}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 p-6 bg-yellow-50 border-l-4 border-[#E6B400] rounded">
          <p className="text-lg text-gray-900 font-semibold">
            TaskFixerAI builds deeper learning while showing students how to use
            AI to question, verify, and think, not to copy.
          </p>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={scrollToHowItWorks}
            className="bg-gradient-to-r from-[#A855F7] via-[#F97316] to-[#FBBF24] text-white font-bold text-lg px-9 py-4 rounded-[10px] hover:shadow-lg transition-all duration-300 uppercase"
          >
            Upload Your Assignment →
          </button>
        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;
