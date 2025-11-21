import {
  Brain,
  ShieldCheck,
  MessageSquare,
  Layers,
  Sparkles,
  FileCheck,
  Lock,
} from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: 'Deeper Learning Design',
      description: 'Builds tasks that require reasoning, analysis, and creativity.',
    },
    {
      icon: ShieldCheck,
      title: 'Cheat-Resistant Structure',
      description: 'Redesigns assignments so students must think, not copy.',
    },
    {
      icon: MessageSquare,
      title: 'Reflection Prompts',
      description: 'Encourages students to explain and connect their thinking.',
    },
    {
      icon: Layers,
      title: 'Differentiated Versions',
      description:
        'Provides scaffolded and extension options for diverse learners.',
    },
    {
      icon: Sparkles,
      title: 'Responsible AI Integration',
      description:
        'Guides students to use AI as a learning support tool, not a replacement for thought.',
    },
    {
      icon: FileCheck,
      title: 'Print-Ready Outputs',
      description:
        'Generates task cards, worksheets, and rubrics that are ready to use.',
    },
    {
      icon: Lock,
      title: 'Privacy First',
      description:
        'Processes files instantly, stores nothing, and protects teacher and student privacy.',
    },
  ];

  return (
    <section id="features" className="bg-white py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center text-gray-900 mb-8 sm:mb-12 md:mb-16">
          Why teachers trust TaskFixerAI.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 md:p-6 bg-gray-100 rounded-lg hover:shadow-lg transition-all duration-300"
              >
                <div className="bg-yellow-100 w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-[#E6B400]" />
                </div>
                <div>
                  <h3 className="font-semibold text-base sm:text-lg md:text-xl mb-1 sm:mb-2 text-gray-900">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-gray-800">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
