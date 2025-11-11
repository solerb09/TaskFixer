"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function CheckoutCancelPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log('Cancel page loaded successfully');
  }, []);

  useEffect(() => {
    // If user is authenticated, redirect to chat after 3 seconds
    if (!loading && user) {
      const timer = setTimeout(() => {
        router.push('/chat');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-yellow-500/10 flex items-center justify-center">
            <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Checkout Canceled</h1>
          <p className="text-gray-400">
            Your payment was canceled. No charges were made to your account.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => router.push('/checkout')}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
}
