'use client';

import { useState } from 'react';

interface LegalNoticeProps {
  children: React.ReactNode;
}

const LegalNotice = ({ children }: LegalNoticeProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{children}</div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-bold text-2xl text-[#8E5AE9] mb-4">
              Legal Notice & Privacy
            </h2>
            <div className="text-base text-gray-700 space-y-4">
              <p>TaskFixerAI™ is a trademarked and copyrighted product.</p>
              <p>
                All materials and outputs are for professional and instructional
                use only.
              </p>
              <p>
                Unauthorized duplication, resale, or distribution is prohibited.
              </p>
              <p>
                TaskFixerAI does not store uploaded data and aligns with
                data-minimization best practices.
              </p>
              <p>
                For permissions or licensing inquiries, contact{' '}
                <a
                  href="mailto:info@taskfixerai.com"
                  className="text-[#4FC3F7] hover:text-[#E6B400] transition-colors underline"
                >
                  info@taskfixerai.com
                </a>
                .
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="mt-6 bg-[#8E5AE9] text-white px-6 py-2 rounded-lg hover:bg-[#9B6EF0] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LegalNotice;
