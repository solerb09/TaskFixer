import { Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      quote:
        'TaskFixerAI helped me turn my Algebra I lessons into conversations about reasoning and process. Students were explaining their steps, not just giving answers.',
      author: 'High School Math Teacher',
    },
    {
      quote:
        'It made my writing assignments more reflective and personal. Students used AI to compare ideas and discovered their own voices.',
      author: 'College English Instructor',
    },
  ];

  return (
    <section className="bg-white py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center text-gray-900 mb-8 sm:mb-12 md:mb-16">
          What teachers are saying.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-100 p-5 sm:p-6 md:p-8 rounded-lg shadow-lg relative"
            >
              <Quote className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-yellow-200 absolute -top-2 -right-2 opacity-30" />
              <p className="text-sm sm:text-base md:text-lg text-gray-800 mb-4 sm:mb-5 md:mb-6 relative z-10">
                &quot;{testimonial.quote}&quot;
              </p>
              <p className="font-semibold text-sm sm:text-base text-[#8E5AE9]">{testimonial.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
