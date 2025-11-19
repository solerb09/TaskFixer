"use client";

import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AccountPage() {
  const { user, profile, usage, loading, signOut } = useAuth();
  const router = useRouter();
  const [cancelLoading, setCancelLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login?redirect=%2Faccount");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-text-secondary">Loading...</p>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const getTierName = (tier: string) => {
    switch (tier) {
      case "free_trial":
        return "Free Trial";
      case "educator":
        return "Educator Plan";
      case "school":
        return "School Plan";
      default:
        return tier;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "educator":
      case "school":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  const isFreeTrial = profile.subscription_tier === "free_trial";
  const isPaid = profile.subscription_tier === "educator" || profile.subscription_tier === "school";

  const handleCancelSubscription = async () => {
    setCancelLoading(true);
    try {
      const response = await fetch("/api/subscriptions/cancel", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to cancel subscription");
      }

      setCancelSuccess(true);
      setShowCancelModal(false);
      alert(`Subscription will be canceled on ${new Date(data.currentPeriodEnd * 1000).toLocaleDateString()}. You'll retain access until then.`);

      // Refresh the page to update subscription status
      window.location.reload();
    } catch (error: any) {
      alert(error.message || "Failed to cancel subscription");
    } finally {
      setCancelLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const response = await fetch("/api/subscriptions/portal", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to open customer portal");
      }

      // Redirect to Stripe customer portal
      window.location.href = data.url;
    } catch (error: any) {
      alert(error.message || "Failed to open customer portal");
      setPortalLoading(false);
    }
  };

  const handleUpgrade = (interval: "month" | "year") => {
    router.push(`/checkout?plan=educator&interval=${interval}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border-default">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl p-2">
              <img src="/logo.png" alt="TaskFixerAI" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-semibold">TaskFixerAI</span>
          </Link>
          <Link href="/chat" className="text-sm text-text-secondary hover:text-foreground transition-colors">
            Back to Chat
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
        <p className="text-text-secondary mb-8">Manage your subscription and view usage</p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Profile Card */}
          <div className="bg-primary-bg border border-border-default rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Profile</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-text-secondary">Name</p>
                <p className="text-text-primary">{profile.full_name || "Not set"}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Email</p>
                <p className="text-text-primary">{profile.email}</p>
              </div>
            </div>
          </div>

          {/* Subscription Card */}
          <div className="bg-primary-bg border border-border-default rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Subscription</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-text-secondary">Current Plan</p>
                <p className={`text-lg font-semibold ${getTierColor(profile.subscription_tier)}`}>
                  {getTierName(profile.subscription_tier)}
                </p>
              </div>
              {isPaid && (
                <>
                  <div>
                    <p className="text-sm text-text-secondary">Billing</p>
                    <p className="text-text-primary capitalize">
                      {profile.billing_interval || "N/A"}ly
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">Status</p>
                    <p className="text-text-primary capitalize">{profile.subscription_status}</p>
                  </div>
                  {profile.subscription_ends_at && (
                    <div>
                      <p className="text-sm text-text-secondary">Next billing date</p>
                      <p className="text-text-primary">
                        {new Date(profile.subscription_ends_at).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Usage Card */}
          <div className="bg-primary-bg border border-border-default rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Usage</h2>
{usage ? (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <p className="text-sm text-text-secondary">Words Generated</p>
                    <p className="text-text-primary font-medium">
                      {usage.word_count_used}
                      {isFreeTrial && " / 800"}
                      {isPaid && " (Unlimited)"}
                    </p>
                  </div>
                  {isFreeTrial && (
                    <div className="w-full bg-secondary-bg rounded-full h-2">
                      <div
                        className="bg-brand-purple rounded-full h-2 transition-all"
                        style={{
                          width: `${Math.min((usage.word_count_used / 800) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <p className="text-sm text-text-secondary">PDF Redesigns</p>
                    <p className="text-text-primary font-medium">
                      {usage.pdf_redesigns_count}
                      {isFreeTrial && " / 1"}
                      {isPaid && " (Unlimited)"}
                    </p>
                  </div>
                  {isFreeTrial && (
                    <div className="w-full bg-secondary-bg rounded-full h-2">
                      <div
                        className="bg-brand-purple rounded-full h-2 transition-all"
                        style={{
                          width: `${Math.min((usage.pdf_redesigns_count / 1) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <p className="text-sm text-text-secondary">Files Uploaded</p>
                    <p className="text-text-primary font-medium">
                      {usage.files_uploaded}
                      <span className="text-text-tertiary text-sm ml-1">(tracked)</span>
                    </p>
                  </div>
                  <p className="text-xs text-text-tertiary mt-1">
                    Files are tracked but don't count against your free trial
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-text-secondary">No usage data available</p>
            )}
          </div>

          {/* Actions Card */}
          <div className="bg-primary-bg border border-border-default rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Actions</h2>
            <div className="space-y-3">
              {isFreeTrial && (
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="block w-full py-3 px-4 bg-brand-purple text-white text-center font-medium rounded-lg hover:bg-brand-purple-dark transition-colors"
                >
                  Upgrade to Educator Plan
                </button>
              )}

              {isPaid && (
                <>
                  <button
                    onClick={handleManageSubscription}
                    disabled={portalLoading}
                    className="block w-full py-3 px-4 bg-secondary-bg text-text-primary text-center font-medium rounded-lg hover:bg-tertiary-bg transition-colors border border-border-default disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {portalLoading ? "Loading..." : "Manage Payment Methods"}
                  </button>

                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="block w-full py-3 px-4 bg-red-900/20 text-red-400 text-center font-medium rounded-lg hover:bg-red-900/30 transition-colors border border-red-800/50"
                  >
                    Cancel Subscription
                  </button>
                </>
              )}

              <button
                onClick={async () => {
                  await signOut();
                  router.push("/auth/login");
                }}
                className="block w-full py-3 px-4 bg-secondary-bg text-text-primary text-center font-medium rounded-lg hover:bg-tertiary-bg transition-colors border border-border-default"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Feature Access */}
        <div className="mt-8 bg-primary-bg border border-border-default rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Feature Access</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p className="font-medium">Reflection Prompts</p>
                <p className="text-sm text-gray-400">Available on all plans</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              {isPaid ? (
                <svg
                  className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <div>
                <p className="font-medium">Differentiation Features</p>
                <p className="text-sm text-gray-400">
                  {isPaid ? "Included in your plan" : "Upgrade to access"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              {isPaid ? (
                <svg
                  className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <div>
                <p className="font-medium">Unlimited Redesigns</p>
                <p className="text-sm text-gray-400">
                  {isPaid ? "Unlimited access" : "1 redesign in free trial"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              {isPaid ? (
                <svg
                  className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <div>
                <p className="font-medium">Email Support</p>
                <p className="text-sm text-gray-400">
                  {isPaid ? "Included in your plan" : "Upgrade to access"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-primary-bg border border-border-default rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Cancel Subscription?</h3>
            <p className="text-text-secondary mb-6">
              Your subscription will be canceled at the end of the current billing period. You'll retain access
              to all features until then.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={cancelLoading}
                className="flex-1 py-3 px-4 bg-secondary-bg text-text-primary text-center font-medium rounded-lg hover:bg-tertiary-bg transition-colors border border-border-default disabled:opacity-50"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={cancelLoading}
                className="flex-1 py-3 px-4 bg-red-600 text-white text-center font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {cancelLoading ? "Canceling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Plan Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-primary-bg border border-border-default rounded-2xl p-6 max-w-2xl w-full">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-semibold mb-2">Choose Your Plan</h3>
                <p className="text-text-secondary">Select a billing interval for the Educator Plan</p>
              </div>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="text-text-secondary hover:text-foreground transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Monthly Plan */}
              <button
                onClick={() => handleUpgrade("month")}
                className="bg-secondary-bg border border-border-default rounded-xl p-6 text-left hover:border-brand-purple transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold group-hover:text-brand-purple transition-colors">Monthly</h4>
                    <p className="text-sm text-text-secondary">Billed monthly</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">$19</p>
                    <p className="text-sm text-text-secondary">/month</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-text-secondary">Unlimited PDF redesigns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-text-secondary">All differentiation features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-text-secondary">Email support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-text-secondary">Cancel anytime</span>
                  </li>
                </ul>
              </button>

              {/* Annual Plan */}
              <button
                onClick={() => handleUpgrade("year")}
                className="bg-secondary-bg border-2 border-green-500 rounded-xl p-6 text-left hover:border-green-400 transition-all group relative"
              >
                <div className="absolute -top-3 right-4 bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                  SAVE $48
                </div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold group-hover:text-green-400 transition-colors">Annual</h4>
                    <p className="text-sm text-text-secondary">Billed yearly</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">$180</p>
                    <p className="text-sm text-text-secondary">/year</p>
                  </div>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2 mb-4">
                  <p className="text-sm text-green-400 font-medium">Only $15/month - Save 21%</p>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-text-secondary">Unlimited PDF redesigns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-text-secondary">All differentiation features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-text-secondary">Email support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-text-secondary">Cancel anytime</span>
                  </li>
                </ul>
              </button>
            </div>

            <p className="text-xs text-text-tertiary text-center mt-6">
              Secure payment powered by Stripe. Start your subscription today.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
