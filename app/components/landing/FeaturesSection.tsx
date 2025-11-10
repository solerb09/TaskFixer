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
    <section id="features" className="bg-white py-20">
      <div className="container mx-auto px-4">
        <h2 className="font-bold text-4xl md:text-5xl text-center text-gray-900 mb-16">
          Why teachers trust TaskFixerAI.
        </h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-4 p-6 bg-gray-100 rounded-lg hover:shadow-lg transition-all duration-300"
              >
                <div className="bg-yellow-100 w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-7 h-7 text-[#E6B400]" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-800">{feature.description}</p>
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
