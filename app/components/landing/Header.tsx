'use client';

import Link from 'next/link';

interface HeaderProps {
  isLoggedIn?: boolean;
}

const Header = ({ isLoggedIn = false }: HeaderProps) => {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-[1000] backdrop-blur-sm h-[48px] md:h-[52px]"
      style={{ background: 'rgba(142, 90, 233, 0.35)' }}
    >
      <div className="container mx-auto h-full px-4">
        <div className="flex items-center justify-between h-full">
          {/* Left spacer - keeps nav centered */}
          <div className="flex-1">
            {/* Empty spacer to balance the right side button */}
          </div>

          {/* Center navigation */}
          <nav className="flex items-center gap-12">
            <a
              href="#how-it-works"
              className="text-white hover:text-white/80 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#features"
              className="text-white hover:text-white/80 transition-colors"
            >
              Features
            </a>
            <a
              href="#about"
              className="text-white hover:text-white/80 transition-colors"
            >
              About
            </a>
            <Link
              href="/chat"
              className="text-white hover:text-white/80 transition-colors"
            >
              TaskFixer
            </Link>
          </nav>

          {/* Right side - spacer for balance */}
          <div className="flex-1"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
