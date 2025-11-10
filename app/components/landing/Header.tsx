'use client';

const Header = () => {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-[1000] backdrop-blur-sm border-b border-gray-200 min-h-[64px] md:min-h-[72px]"
      style={{ background: 'rgba(142, 90, 233, 0.35)' }}
    >
      <div className="container mx-auto h-full px-4">
        <div className="flex items-center justify-center h-full py-2">
          <nav className="flex items-center gap-8">
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
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
