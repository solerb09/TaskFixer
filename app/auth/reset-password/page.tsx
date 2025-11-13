"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const { updatePassword, session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if user has a valid session (from the reset link)
    if (session) {
      setHasSession(true);
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const { error } = await updatePassword(password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    }
  };

  if (!hasSession) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl p-3">
              <img src="/logo.png" alt="TaskFixerAI" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-2xl font-semibold mb-2">Invalid or Expired Link</h1>
            <p className="text-text-secondary mb-6">
              This password reset link is invalid or has expired.
            </p>
          </div>
          <div className="bg-primary-bg border border-border-default rounded-2xl p-8">
            <p className="text-center text-sm text-text-secondary">
              Please request a new password reset link.
            </p>
            <div className="mt-6 space-y-3">
              <Link
                href="/auth/forgot-password"
                className="block w-full bg-white text-black text-center font-medium py-3 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Request new link
              </Link>
              <Link
                href="/auth/login"
                className="block w-full text-center text-sm text-text-secondary hover:text-foreground transition-colors"
              >
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl p-3">
            <img src="/logo.png" alt="TaskFixerAI" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Set new password</h1>
          <p className="text-text-secondary">
            Enter your new password below
          </p>
        </div>

        {/* Reset Password Form */}
        <div className="bg-primary-bg border border-border-default rounded-2xl p-8">
          {success ? (
            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-sm text-green-400">
                <p className="font-medium mb-1">Password updated successfully!</p>
                <p className="text-green-400/80">
                  Redirecting you to login...
                </p>
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
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-secondary-bg border border-border-hover rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-secondary-bg border border-border-hover rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black font-medium py-3 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Updating..." : "Update password"}
              </button>
            </form>
          )}

          {/* Back to Login Link */}
          {!success && (
            <p className="text-center text-sm text-text-secondary mt-6">
              Remember your password?{" "}
              <Link href="/auth/login" className="text-foreground hover:underline">
                Back to login
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
