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
    <section id="privacy" className="bg-blue-50 py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-5 sm:mb-6 md:mb-8">
            Safe, private, and designed for educators.
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-8 sm:mb-10 md:mb-12">
            TaskFixerAI values teacher and student privacy.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mb-8 sm:mb-10 md:mb-12">
            {privacyPoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 sm:gap-4 bg-white p-4 sm:p-5 md:p-6 rounded-lg"
                >
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#4FC3F7] flex-shrink-0" />
                  <p className="text-sm sm:text-base md:text-lg text-gray-700 text-left">{point.text}</p>
                </div>
              );
            })}
          </div>

          <div className="inline-flex items-center gap-2 sm:gap-3 bg-blue-100 border-2 border-[#4FC3F7] px-5 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-lg">
            <Shield className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#4FC3F7]" />
            <span className="font-bold text-base sm:text-lg md:text-xl text-[#4FC3F7]">Privacy First</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DataPrivacy;
