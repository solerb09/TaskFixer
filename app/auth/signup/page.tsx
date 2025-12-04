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
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background text-foreground flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-purple/20 via-background to-background items-center justify-center p-12">
          <div className="text-center max-w-md">
            <img src="/logo.png" alt="TaskFixer" className="w-64 h-64 mx-auto mb-8 object-contain" />
            <h2 className="text-3xl font-bold mb-4">TaskFixer</h2>
            <p className="text-lg text-text-secondary">
              Transform your teaching with AI-powered reflection prompts and beautifully redesigned materials.
            </p>
          </div>
        </div>

        {/* Right Side - Success Message */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-12">
          <div className="w-full max-w-md text-center">
            <div className="lg:hidden w-16 h-16 mx-auto mb-4 bg-white rounded-2xl p-3">
              <img src="/logo.png" alt="TaskFixer" className="w-full h-full object-contain" />
            </div>
            <div className="w-16 h-16 mx-auto mb-6 bg-brand-purple/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold mb-2">Check your email</h1>
            <p className="text-sm sm:text-base text-text-secondary mb-6">
              We've sent a confirmation link to <span className="text-foreground font-medium">{email}</span>
            </p>
            <p className="text-xs sm:text-sm text-text-tertiary mb-6">
              Please click the link in your email to verify your account before logging in.
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 text-sm text-brand-purple hover:underline"
            >
              Go to login
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-purple/20 via-background to-background items-center justify-center p-12 relative">
        <div className="absolute top-8 left-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-foreground transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>
        <div className="text-center max-w-md">
          <img src="/logo.png" alt="TaskFixer" className="w-64 h-64 mx-auto mb-8 object-contain" />
          <h2 className="text-3xl font-bold mb-4">TaskFixer</h2>
          <p className="text-lg text-text-secondary">
            Transform your teaching with AI-powered reflection prompts and beautifully redesigned materials.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-start justify-center px-4 sm:px-6 lg:px-12 pt-4 sm:pt-6 lg:pt-8">
        <div className="w-full max-w-md">
          {/* Mobile Back Link & Logo */}
          <div className="lg:hidden">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-foreground transition-colors mb-4"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-3 bg-white rounded-2xl p-3">
                <img src="/logo.png" alt="TaskFixer" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="mb-3 sm:mb-4">
            <h1 className="text-xl sm:text-2xl font-semibold mb-1">Get started with TaskFixer</h1>
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
                  className="w-full bg-secondary-bg border border-border-default rounded-lg px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-brand-purple/50 placeholder-text-tertiary"
                  placeholder="Jane Doe"
                  style={{ fontSize: "16px" }}
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
                  className="w-full bg-secondary-bg border border-border-default rounded-lg px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-brand-purple/50 placeholder-text-tertiary"
                  placeholder="you@example.com"
                  style={{ fontSize: "16px" }}
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
                  className="w-full bg-secondary-bg border border-border-default rounded-lg px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-brand-purple/50 placeholder-text-tertiary"
                  placeholder="••••••••"
                  style={{ fontSize: "16px" }}
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
