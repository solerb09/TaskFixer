import Link from 'next/link';

const FinalCTA = () => {
  return (
    <section className="relative py-16 sm:py-24 md:py-32 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#A855F7] via-[#F97316] to-[#FBBF24]" />

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
        <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-6xl text-white mb-4 sm:mb-5 md:mb-6">
          Transform your next assignment for deeper learning.
        </h2>

        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto">
          TaskFixerAI helps you design tasks that push students to think
          critically, reflect deeply, and learn responsibly with technology.
        </p>

        <Link
          href="/auth/signup?redirect=%2Fchat"
          className="inline-block bg-[#E6B400] hover:bg-[#F0C020] text-[#8E5AE9] font-bold text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-6 rounded-[10px] hover:shadow-lg transition-all duration-300 uppercase mb-4 sm:mb-5 md:mb-6"
        >
          Try TaskFixerAI Free →
        </Link>

        <p className="text-white/80 text-sm sm:text-base md:text-lg">
          Start your free trial today.
        </p>
      </div>
    </section>
  );
};

export default FinalCTA;
