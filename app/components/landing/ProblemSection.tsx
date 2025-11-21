'use client';

const ProblemSection = () => {
  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-gray-100 py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
          <div className="order-2 md:order-1">
            <img
              src="/problem-section.jpg"
              alt="Teacher reviewing repeated student work with concern"
              className="rounded-lg shadow-lg w-full"
            />
          </div>

          <div className="order-1 md:order-2">
            <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-4 sm:mb-5 md:mb-6">
              AI Has Changed the Rules of Teaching.
            </h2>

            <div className="space-y-3 sm:space-y-4 text-sm sm:text-base md:text-lg text-gray-700">
              <p>
                Teachers and professors everywhere are facing a new reality. AI
                can generate perfect answers in seconds. Students can bypass
                learning altogether with a single prompt. TaskFixerAI exists to
                solve that problem.
              </p>

              <p>
                Students can now generate full essays, lab reports, or math
                solutions in seconds. Traditional assignments no longer measure
                what students truly understand. Teachers need a way to out-think
                the shortcuts, and TaskFixerAI delivers exactly that.
              </p>

              <p>
                TaskFixerAI helps teachers reclaim learning by redesigning
                assignments that cannot be solved through shortcuts. It makes AI
                part of the process, not the problem, turning every task into an
                opportunity for deeper thinking and creativity.
              </p>
            </div>

            <button
              onClick={scrollToHowItWorks}
              className="mt-6 sm:mt-8 bg-[#E6B400] hover:bg-[#F0C020] text-[#8E5AE9] font-bold text-sm sm:text-base md:text-lg px-6 sm:px-7 md:px-9 py-3 sm:py-3.5 md:py-4 rounded-[10px] transition-all duration-300 uppercase"
            >
              See How It Works →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
