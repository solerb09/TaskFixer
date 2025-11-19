"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export const dynamic = 'force-dynamic';

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState("/");
  const { signIn } = useAuth();
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

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push(redirect);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-foreground transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl p-3">
            <img src="/logo.png" alt="TaskFixerAI" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Welcome back</h1>
          <p className="text-text-secondary">Sign in to your TaskFixerAI account</p>
        </div>

        {/* Login Form */}
        <div className="bg-primary-bg border border-border-default rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">
                {error}
              </div>
            )}

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
                className="w-full bg-secondary-bg border border-border-default rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-brand-purple/50 placeholder-text-tertiary"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <Link href="/auth/forgot-password" className="text-sm text-text-secondary hover:text-foreground transition-colors">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-secondary-bg border border-border-default rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-brand-purple/50 placeholder-text-tertiary"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-purple text-white font-medium py-3 rounded-lg hover:bg-brand-purple-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-text-secondary mt-6">
            Don't have an account?{" "}
            <Link href={`/auth/signup${redirect !== "/" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`} className="text-foreground hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-foreground">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
