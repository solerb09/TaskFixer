'use client';

const Hero = () => {
  const scrollToUpload = () => {
    document.getElementById('how-it-works')?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  return (
    <section className="relative min-h-0 flex items-center pt-0 overflow-hidden z-[1] w-full">
      {/* Full width background container */}
      <div className="absolute inset-0 w-full z-[1] bg-[#8E5AE9]" />

      {/* Two-Column Grid Layout on Desktop, Single Column on Mobile */}
      <div className="container mx-auto relative z-[2] px-4 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-4 md:gap-8 items-center">
          {/* Left Column: Logo + Text Content */}
          <div className="px-4 sm:px-6 md:px-10 lg:pl-[60px] mt-[60px] sm:mt-[50px] md:mt-[50px] lg:mt-[60px] pb-[50px] sm:pb-[45px] md:pb-[50px] flex flex-col h-auto overflow-visible relative z-[2] order-1">
            {/* Logo at top-left */}
            <img
              src="/taskfixer-logo.png"
              alt="TaskFixerAI Logo"
              className="object-contain w-[180px] sm:w-[170px] md:w-[200px] lg:w-[250px] mb-3 sm:mb-2 mx-auto"
              style={{
                filter: 'drop-shadow(0 2px 2px rgba(0, 0, 0, 0.2))',
              }}
            />

            <p
              className="text-white/80 mb-3 sm:mb-2 text-center text-xs sm:text-xs"
            >
              TaskFixerAI™ is a trademarked and copyrighted product.
            </p>

            <h1
              className="font-extrabold text-[28px] sm:text-[26px] md:text-[32px] lg:text-[42px] text-white leading-[1.2] mt-0 mb-3 sm:mb-2 text-center"
              style={{
                textShadow: '0 1px 1px rgba(0, 0, 0, 0.3)',
              }}
            >
              Stop AI Cheating.
              <br />
              Start Deeper Learning.
            </h1>
            <div className="max-w-[95%] sm:max-w-[85%] md:max-w-[80%] mx-auto text-center">
              <p
                className="text-sm sm:text-[13px] md:text-[13px] lg:text-[15px] text-white mb-3 sm:mb-2 leading-relaxed"
                style={{
                  textShadow: '0 1px 1px rgba(0, 0, 0, 0.3)',
                }}
              >
                The AI-powered tool that transforms your lessons, assignments,
                and assessments into cheat-resistant, high-rigor learning tasks
                while teaching students to use AI responsibly.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-3 pt-3 sm:pt-2 justify-center px-2 sm:px-0">
              <button
                onClick={scrollToUpload}
                style={{
                  backgroundColor: '#8E5AE9',
                }}
                className="hover:bg-[#9B6EF0] text-white font-bold text-sm sm:text-base h-[48px] sm:h-[44px] px-6 rounded-[10px] transition-all duration-300 uppercase"
              >
                Try TaskFixerAI Free →
              </button>

              <a
                href="/TaskFixerAI-Teacher-Guide.pdf"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: '#E6B400',
                }}
                className="hover:bg-[#F0C020] text-white font-bold text-sm sm:text-base h-[48px] sm:h-[44px] px-6 rounded-[10px] transition-all duration-300 uppercase flex items-center justify-center"
              >
                Download the Teacher Guide
              </a>
            </div>
          </div>

          {/* Right Column: YouTube Video */}
          <div
            className="relative h-[280px] sm:h-[350px] md:h-[500px] lg:h-[580px] order-2 flex items-center justify-center lg:justify-end px-4 sm:px-4 lg:px-6"
          >
            <div className="w-full aspect-video">
              <iframe
                className="w-full h-full rounded-xl shadow-2xl"
                src="https://www.youtube.com/embed/IfVU-uHJap0?si=cbNsIb3AmJ3hjUYE"
                title="TaskFixerAI Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
