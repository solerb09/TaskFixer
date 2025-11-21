"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export const dynamic = 'force-dynamic';

function SignupForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [redirect, setRedirect] = useState("/");
  const { signUp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get redirect param after mount (client-side only)
  useEffect(() => {
    const redirectParam = searchParams.get("redirect");
    if (redirectParam) setRedirect(redirectParam);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const { error } = await signUp(email, password, fullName);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      // If email confirmation is disabled, redirect to chat
      // Otherwise, show success message
      setTimeout(() => {
        router.push(redirect);
      }, 2000);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-white rounded-2xl p-2.5 sm:p-3">
            <img src="/logo.png" alt="TaskFixerAI" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold mb-2">Welcome to TaskFixerAI!</h1>
          <p className="text-sm sm:text-base text-text-secondary mb-4">Your account has been created successfully.</p>
          <p className="text-xs sm:text-sm text-text-tertiary">
            You're being redirected to the chat...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Back to Home Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-foreground transition-colors mb-4 sm:mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-white rounded-2xl p-2.5 sm:p-3">
            <img src="/logo.png" alt="TaskFixerAI" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold mb-2">Get started with TaskFixerAI</h1>
          <p className="text-sm sm:text-base text-text-secondary">Create your account and start your free trial</p>
        </div>

        {/* Signup Form */}
        <div className="bg-primary-bg border border-border-default rounded-2xl p-5 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-xs sm:text-sm text-red-400">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full bg-secondary-bg border border-border-default rounded-lg px-4 py-3 text-sm sm:text-base text-foreground focus:outline-none focus:ring-2 focus:ring-brand-purple/50 placeholder-text-tertiary"
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-secondary-bg border border-border-default rounded-lg px-4 py-3 text-sm sm:text-base text-foreground focus:outline-none focus:ring-2 focus:ring-brand-purple/50 placeholder-text-tertiary"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-secondary-bg border border-border-default rounded-lg px-4 py-3 text-sm sm:text-base text-foreground focus:outline-none focus:ring-2 focus:ring-brand-purple/50 placeholder-text-tertiary"
                placeholder="••••••••"
              />
              <p className="text-xs text-text-tertiary mt-1">Must be at least 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-purple text-white font-medium py-3 rounded-lg hover:bg-brand-purple-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-xs sm:text-sm text-text-secondary mt-5 sm:mt-6">
            Already have an account?{" "}
            <Link href={`/auth/login${redirect !== "/" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`} className="text-foreground hover:underline">
              Sign in
            </Link>
          </p>

          {/* Free Trial Info */}
          <div className="mt-5 sm:mt-6 p-3 sm:p-4 bg-secondary-bg/50 rounded-lg border border-border-default">
            <p className="text-xs text-text-secondary text-center">
              Start with a <span className="text-foreground font-medium">free trial</span>: 1 redesigned PDF with
              reflection prompts (up to 800 words or 1 file)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-foreground">Loading...</div>
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}
