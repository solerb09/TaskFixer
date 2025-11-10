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
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <h2 className="font-bold text-4xl md:text-5xl text-center text-gray-900 mb-16">
          What teachers are saying.
        </h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-100 p-8 rounded-lg shadow-lg relative"
            >
              <Quote className="w-16 h-16 text-yellow-200 absolute -top-2 -right-2 opacity-30" />
              <p className="text-lg text-gray-800 mb-6 relative z-10">
                &quot;{testimonial.quote}&quot;
              </p>
              <p className="font-semibold text-[#8E5AE9]">{testimonial.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
