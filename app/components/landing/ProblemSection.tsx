'use client';

const ProblemSection = () => {
  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-gray-100 py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="/problem-section.jpg"
              alt="Teacher reviewing repeated student work with concern"
              className="rounded-lg shadow-lg w-full"
            />
          </div>

          <div>
            <h2 className="font-bold text-4xl md:text-5xl text-gray-900 mb-6">
              AI Has Changed the Rules of Teaching.
            </h2>

            <div className="space-y-4 text-lg text-gray-700">
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
              className="mt-8 bg-[#E6B400] hover:bg-[#F0C020] text-[#8E5AE9] font-bold text-lg px-9 py-4 rounded-[10px] transition-all duration-300 uppercase"
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
