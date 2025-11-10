const AboutCreator = () => {
  return (
    <section id="about" className="bg-gray-100 py-20">
      <div className="container mx-auto px-4">
        <h2 className="font-bold text-4xl md:text-5xl text-center text-gray-900 mb-12">
          Created by Dr. Jamiylah Jones, CEO of Creative Transformations.
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div>
            <img
              src="/dr-jones.jpg"
              alt="Dr. Jamiylah Jones, founder of TaskFixerAI and CEO of Creative Transformations"
              className="rounded-lg shadow-xl w-full max-w-md mx-auto"
            />
          </div>

          <div className="space-y-4 text-lg text-gray-700">
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
                className="w-[180px]"
              />
            </div>

            <div className="pt-4 border-l-4 border-[#E6B400] pl-4">
              <p className="font-semibold text-xl text-[#8E5AE9]">
                Creative Transformations, LLC
              </p>
              <p className="text-gray-600 mt-2">
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
