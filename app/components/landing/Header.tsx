'use client';

import Link from 'next/link';

interface HeaderProps {
  isLoggedIn?: boolean;
}

const Header = ({ isLoggedIn = false }: HeaderProps) => {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-[1000] backdrop-blur-sm h-[56px] sm:h-[52px] md:h-[52px]"
      style={{ background: 'rgba(142, 90, 233, 0.35)' }}
    >
      <div className="container mx-auto h-full px-4">
        <div className="flex items-center justify-between h-full">
          {/* Left spacer - keeps nav centered */}
          <div className="flex-1 hidden sm:block">
            {/* Empty spacer to balance the right side button */}
          </div>

          {/* Center navigation */}
          <nav className="flex items-center justify-center w-full sm:w-auto gap-4 sm:gap-6 md:gap-8 lg:gap-12">
            <a
              href="#how-it-works"
              className="text-white hover:text-white/80 transition-colors text-xs sm:text-sm md:text-base whitespace-nowrap"
            >
              How It Works
            </a>
            <a
              href="#features"
              className="text-white hover:text-white/80 transition-colors text-xs sm:text-sm md:text-base"
            >
              Features
            </a>
            <a
              href="#about"
              className="text-white hover:text-white/80 transition-colors text-xs sm:text-sm md:text-base"
            >
              About
            </a>
            <Link
              href="/chat"
              className="text-white hover:text-white/80 transition-colors text-xs sm:text-sm md:text-base"
            >
              TaskFixer
            </Link>
          </nav>

          {/* Right side - spacer for balance */}
          <div className="flex-1 hidden sm:block"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
