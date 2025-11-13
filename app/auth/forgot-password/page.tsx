"use client";

import { useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPasswordForEmail } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const { error } = await resetPasswordForEmail(email);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl p-3">
            <img src="/logo.png" alt="TaskFixerAI" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Reset your password</h1>
          <p className="text-text-secondary">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        {/* Forgot Password Form */}
        <div className="bg-primary-bg border border-border-default rounded-2xl p-8">
          {success ? (
            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-sm text-green-400">
                <p className="font-medium mb-1">Check your email!</p>
                <p className="text-green-400/80">
                  We've sent a password reset link to <strong>{email || "your email"}</strong>.
                  Click the link in the email to reset your password.
                </p>
              </div>
              <div className="text-center text-sm text-text-secondary">
                <p>Didn't receive the email? Check your spam folder or</p>
                <button
                  onClick={() => setSuccess(false)}
                  className="text-foreground hover:underline mt-1"
                >
                  try again
                </button>
              </div>
            </div>
          ) : (
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
                  className="w-full bg-secondary-bg border border-border-hover rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="you@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black font-medium py-3 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </form>
          )}

          {/* Back to Login Link */}
          <p className="text-center text-sm text-text-secondary mt-6">
            Remember your password?{" "}
            <Link href="/auth/login" className="text-foreground hover:underline">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
