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
          <div className="px-6 md:px-10 lg:pl-[60px] mt-[40px] md:mt-[50px] lg:mt-[60px] pb-[40px] md:pb-[50px] flex flex-col h-auto overflow-visible relative z-[2] order-1">
            {/* Logo at top-left */}
            <img
              src="/taskfixer-logo.png"
              alt="TaskFixerAI Logo"
              className="object-contain w-[150px] md:w-[200px] lg:w-[250px] mb-2 mx-auto"
              style={{
                filter: 'drop-shadow(0 2px 2px rgba(0, 0, 0, 0.2))',
              }}
            />

            <p
              className="text-white/80 mb-2 text-center"
              style={{
                fontSize: '12px',
              }}
            >
              TaskFixerAI™ is a trademarked and copyrighted product.
            </p>

            <h1
              className="font-extrabold text-[24px] md:text-[32px] lg:text-[42px] text-white leading-[1.2] mt-0 mb-2 text-center"
              style={{
                textShadow: '0 1px 1px rgba(0, 0, 0, 0.3)',
              }}
            >
              Stop AI Cheating.
              <br />
              Start Deeper Learning.
            </h1>
            <div className="max-w-[80%] mx-auto text-center">
              <p
                className="text-[12px] md:text-[13px] lg:text-[15px] text-white mb-2"
                style={{
                  textShadow: '0 1px 1px rgba(0, 0, 0, 0.3)',
                }}
              >
                The AI-powered tool that transforms your lessons, assignments,
                and assessments into cheat-resistant, high-rigor learning tasks
                while teaching students to use AI responsibly.
              </p>
              <p
                className="text-[12px] md:text-[13px] lg:text-[15px] text-white mb-3"
                style={{
                  textShadow: '0 1px 1px rgba(0, 0, 0, 0.3)',
                }}
              >
                AI is not the enemy. It is an opportunity to rethink learning.
                TaskFixerAI helps teachers, professors, and instructional
                leaders redesign assignments that make students think deeper,
                apply knowledge, and develop original work, not copy what AI
                gives them.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
              <button
                onClick={scrollToUpload}
                style={{
                  backgroundColor: '#8E5AE9',
                }}
                className="hover:bg-[#9B6EF0] text-white font-bold text-base h-[44px] px-6 rounded-[10px] transition-all duration-300 uppercase"
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
                className="hover:bg-[#F0C020] text-white font-bold text-base h-[44px] px-6 rounded-[10px] transition-all duration-300 uppercase flex items-center justify-center"
              >
                Download the Teacher Guide
              </a>
            </div>
          </div>

          {/* Right Column: Classroom Image */}
          <div
            className="relative h-[300px] md:h-[400px] lg:absolute lg:right-0 lg:top-0 lg:bottom-0 lg:w-[40%] lg:h-full order-2"
            style={{
              backgroundImage: 'url(/hero-classroom.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {/* Gradient overlay for brand blending */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to right, rgba(142, 90, 233, 0.25) 0%, rgba(255, 255, 255, 0) 100%)',
              }}
            />
            {/* Subtle vignette */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at center, transparent 50%, rgba(0, 0, 0, 0.05) 100%)',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
