import { Shield, Lock, FileCheck, UserCheck } from 'lucide-react';

const DataPrivacy = () => {
  const privacyPoints = [
    {
      icon: Lock,
      text: 'No data is stored or shared.',
    },
    {
      icon: FileCheck,
      text: 'Files are deleted immediately after processing.',
    },
    {
      icon: UserCheck,
      text: 'Teachers control every output.',
    },
    {
      icon: Shield,
      text: 'Built for classrooms that value integrity and safety.',
    },
  ];

  return (
    <section id="privacy" className="bg-blue-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-bold text-4xl md:text-5xl text-gray-900 mb-8">
            Safe, private, and designed for educators.
          </h2>

          <p className="text-xl text-gray-700 mb-12">
            TaskFixerAI values teacher and student privacy.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {privacyPoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-white p-6 rounded-lg"
                >
                  <Icon className="w-8 h-8 text-[#4FC3F7] flex-shrink-0" />
                  <p className="text-lg text-gray-700 text-left">{point.text}</p>
                </div>
              );
            })}
          </div>

          <div className="inline-flex items-center gap-3 bg-blue-100 border-2 border-[#4FC3F7] px-8 py-4 rounded-lg">
            <Shield className="w-10 h-10 text-[#4FC3F7]" />
            <span className="font-bold text-xl text-[#4FC3F7]">Privacy First</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DataPrivacy;
