import { Linkedin, Youtube, Instagram } from 'lucide-react';
import LegalNotice from './LegalNotice';

const Footer = () => {
  return (
    <footer className="bg-[#8E5AE9] text-white py-8 sm:py-10 md:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-center mb-6 sm:mb-8">
          <img
            src="/taskfixer-logo.png"
            alt="TaskFixerAI Logo"
            className="w-[120px] sm:w-[140px] md:w-[160px]"
          />
        </div>

        <div className="text-center mb-6 sm:mb-8">
          <p className="text-sm sm:text-base md:text-lg mb-2">
            TaskFixerAI is a product of <strong>Creative Transformations, LLC</strong>,
            founded by Dr. Jamiylah Jones.
          </p>
          <p className="text-xs sm:text-sm md:text-base text-white/80">
            Dedicated to helping educators lead with innovation, integrity, and
            deeper learning in the age of AI.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6 mb-6">
          <a
            href="#about"
            className="text-white/80 hover:text-white transition-colors text-sm sm:text-base"
          >
            About Creative Transformations
          </a>
          <span className="text-white/40 hidden sm:inline">|</span>
          <a
            href="#privacy"
            className="text-white/80 hover:text-white transition-colors text-sm sm:text-base"
          >
            Privacy Policy
          </a>
          <span className="text-white/40 hidden sm:inline">|</span>
          <a
            href="mailto:info@creativetransformations.consulting"
            className="text-white/80 hover:text-white transition-colors text-xs sm:text-sm md:text-base break-all sm:break-normal"
          >
            Contact: info@creativetransformations.consulting
          </a>
        </div>

        <div className="flex justify-center gap-4 sm:gap-5 md:gap-6">
          <a
            href="#linkedin"
            className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>
          <a
            href="#youtube"
            className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            aria-label="YouTube"
          >
            <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>
          <a
            href="#instagram"
            className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>
        </div>

        <div className="text-center mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/20">
          <p className="text-xs sm:text-sm mb-2 sm:mb-3 px-2">
            Need help getting started?{' '}
            <a
              href="/TaskFixerAI-Teacher-Guide.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4FC3F7] hover:text-[#E6B400] transition-colors underline"
            >
              Download the Teacher Guide
            </a>{' '}
            for step-by-step directions on using TaskFixerAI in your classroom.
          </p>
          <p className="text-xs sm:text-sm text-white/60">
            © {new Date().getFullYear()} Creative Transformations, LLC. All rights
            reserved.
          </p>
        </div>

        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-[#E6B400]">
          <div className="text-center">
            <p className="text-xs sm:text-sm text-white mb-2">
              © 2025 TaskFixerAI™. All rights reserved.
            </p>
            <p className="text-xs sm:text-sm text-white mb-3 px-2">
              TaskFixerAI™ is a trademarked and copyrighted product. Unauthorized
              duplication or distribution is prohibited.
            </p>
            <LegalNotice>
              <button className="text-xs sm:text-sm text-[#4FC3F7] hover:text-[#E6B400] transition-colors underline">
                Legal Notice & Privacy
              </button>
            </LegalNotice>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
