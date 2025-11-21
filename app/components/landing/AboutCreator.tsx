const AboutCreator = () => {
  return (
    <section id="about" className="bg-gray-100 py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center text-gray-900 mb-8 sm:mb-10 md:mb-12">
          Created by Dr. Jamiylah Jones, CEO of Creative Transformations.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center max-w-5xl mx-auto">
          <div className="md:-mt-80">
            <img
              src="/dr-jones.jpg"
              alt="Dr. Jamiylah Jones, founder of TaskFixerAI and CEO of Creative Transformations"
              className="rounded-lg shadow-xl w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto"
            />
          </div>

          <div className="space-y-3 sm:space-y-4 text-sm sm:text-base md:text-lg text-gray-700">
            <p>
              TaskFixerAI was created by <strong>Dr. Jamiylah Jones</strong>, an
              educator and consultant with more than 25 years of experience
              helping schools and universities design rigorous, human-centered
              learning.
            </p>

            <p>
              Through Creative Transformations, LLC, Dr. Jones has led programs
              that help educators integrate technology responsibly while keeping
              the focus on thinking, reflection, and creativity.
            </p>

            <p>
              TaskFixerAI is part of that mission, giving teachers the tools to
              design assignments that challenge students to reason, reflect, and
              apply knowledge at deeper levels. TaskFixerAI™ is a trademarked and
              copyrighted educational innovation created to help educators
              worldwide design deeper learning experiences.
            </p>

            <div className="flex justify-end mb-4">
              <img
                src="/taskfixer-logo.png"
                alt="TaskFixerAI Logo"
                className="w-[120px] sm:w-[150px] md:w-[180px]"
              />
            </div>

            <div className="pt-3 sm:pt-4 border-l-4 border-[#E6B400] pl-3 sm:pl-4">
              <p className="font-semibold text-base sm:text-lg md:text-xl text-[#8E5AE9]">
                Creative Transformations, LLC
              </p>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 sm:mt-2">
                Dedicated to helping educators lead with innovation, integrity,
                and deeper learning in the age of AI.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutCreator;
