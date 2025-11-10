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
      <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl p-3">
            <img src="/logo.png" alt="TaskFixerAI" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Welcome to TaskFixerAI!</h1>
          <p className="text-gray-400 mb-4">Your account has been created successfully.</p>
          <p className="text-sm text-gray-500">
            You're being redirected to the chat...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl p-3">
            <img src="/logo.png" alt="TaskFixerAI" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Get started with TaskFixerAI</h1>
          <p className="text-gray-400">Create your account and start your free trial</p>
        </div>

        {/* Signup Form */}
        <div className="bg-[#171717] border border-[#2a2a2a] rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">
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
                className="w-full bg-[#2a2a2a] border border-[#404040] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20"
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
                className="w-full bg-[#2a2a2a] border border-[#404040] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20"
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
                className="w-full bg-[#2a2a2a] border border-[#404040] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="••••••••"
              />
              <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-medium py-3 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{" "}
            <Link href={`/auth/login${redirect !== "/" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`} className="text-white hover:underline">
              Sign in
            </Link>
          </p>

          {/* Free Trial Info */}
          <div className="mt-6 p-4 bg-[#2a2a2a]/50 rounded-lg border border-[#404040]">
            <p className="text-xs text-gray-400 text-center">
              Start with a <span className="text-white font-medium">free trial</span>: 1 redesigned PDF with
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
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center p-4">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}
