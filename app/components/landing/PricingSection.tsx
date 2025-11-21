import { Check } from 'lucide-react';
import Link from 'next/link';

const PricingSection = () => {
  const plans = [
    {
      name: 'Starter',
      label: 'Free Plan',
      price: 'Free',
      features: [
        '1 free redesign (up to 800 words or 1 file)',
        'Reflection prompts included',
        'Instant download',
      ],
      cta: 'Try Free →',
      action: '/chat',
      highlight: false,
      isMailto: false,
    },
    {
      name: 'Educator',
      label: 'Educator Plan',
      price: '$19/month',
      priceNote: 'or $180/year',
      features: [
        'Unlimited redesigns',
        'Full reflection and differentiation features',
        'Email support',
        'Access to all future updates',
      ],
      cta: 'Subscribe →',
      action: '/checkout',
      highlight: true,
      isMailto: false,
    },
    {
      name: 'School',
      label: 'School Plan',
      price: '$149/month',
      priceNote: 'or $1,500/year',
      features: [
        '10 educator licenses',
        'Admin dashboard and onboarding',
        'Dedicated support',
        'Private branding option',
      ],
      cta: 'Contact Sales →',
      action: '/contact-sales',
      highlight: false,
      isMailto: false,
    },
  ];

  return (
    <section className="bg-gray-50 py-12 sm:py-16 md:py-20">
      <div className="w-full h-[2px] bg-[#E6B400] mb-10 sm:mb-14 md:mb-20" />

      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center text-[#8E5AE9] mb-4">
          Plans and Pricing
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-8 sm:mt-10 md:mt-12 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col bg-white rounded-lg ${
                plan.highlight
                  ? 'border-[3px] border-[#E6B400] shadow-lg'
                  : 'border border-gray-200'
              } ${plan.name === 'School' ? 'sm:col-span-2 lg:col-span-1' : ''}`}
            >
              <div className="text-center pb-4 sm:pb-6 md:pb-8 p-4 sm:p-5 md:p-6">
                <h3 className="font-bold text-xl sm:text-2xl text-[#8E5AE9] mb-2">
                  {plan.label}
                </h3>
                <div className="mt-3 sm:mt-4">
                  <div className="font-bold text-2xl sm:text-3xl md:text-4xl text-[#8E5AE9]">
                    {plan.price}
                  </div>
                  {plan.priceNote && (
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">{plan.priceNote}</p>
                  )}
                </div>
              </div>

              <div className="flex-1 px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6">
                <ul className="space-y-3 sm:space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 sm:gap-3">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#E6B400] flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base text-gray-900">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 sm:p-5 md:p-6 pt-0">
                <Link
                  href={plan.action}
                  className="block w-full bg-[#8E5AE9] text-white font-bold uppercase rounded-lg hover:bg-[#9B6EF0] transition-all duration-300 text-center py-2.5 sm:py-3 text-sm sm:text-base"
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs sm:text-[13px] text-[#777777] text-center mt-8 sm:mt-10 md:mt-12 max-w-3xl mx-auto px-4">
          Payments are processed securely through Stripe once checkout is active.
          TaskFixerAI™ does not store or manage payment information.
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
