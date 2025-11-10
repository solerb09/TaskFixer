"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const plan = searchParams.get("plan");
  const interval = searchParams.get("interval") as "month" | "year";

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !user) {
      const redirectUrl = encodeURIComponent(`/checkout?plan=${plan}&interval=${interval}`);
      router.push(`/auth/login?redirect=${redirectUrl}`);
      return;
    }

    // Once authenticated, automatically start checkout
    if (user && !loading && !error && plan && interval) {
      handleCheckout();
    }
  }, [user, authLoading, plan, interval]);

  const handleCheckout = async () => {
    console.log("Checkout params:", { plan, interval }); // Debug log

    if (!plan || !interval) {
      setError(`Invalid checkout parameters. Received: plan=${plan}, interval=${interval}`);
      return;
    }

    if (plan !== "educator") {
      setError(`Invalid plan selected: ${plan}`);
      return;
    }

    if (!["month", "year"].includes(interval)) {
      setError(`Invalid billing interval: ${interval}`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan,
          interval,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(err.message || "Failed to start checkout. Please try again.");
      setLoading(false);
    }
  };

  const getPlanDetails = () => {
    if (interval === "month") {
      return {
        name: "Educator Plan - Monthly",
        price: "$19/month",
        total: "$19.00",
      };
    } else {
      return {
        name: "Educator Plan - Annual",
        price: "$180/year",
        total: "$180.00",
        savings: "Save $48/year",
      };
    }
  };

  const details = getPlanDetails();

  if (authLoading || (user && loading && !error)) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <h2 className="text-xl font-semibold mb-2">
            {!user ? "Checking authentication..." : "Redirecting to checkout..."}
          </h2>
          <p className="text-gray-400">Please wait</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-red-500/20 border border-red-500/40 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold mb-4">Checkout Error</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => {
                setError(null);
                handleCheckout();
              }}
              className="w-full py-3 px-4 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="block w-full py-3 px-4 bg-[#2a2a2a] text-white text-center font-medium rounded-lg hover:bg-[#333333] transition-colors border border-[#404040]"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show checkout summary while processing
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <div className="border-b border-[#2a2a2a]">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl p-2">
              <img src="/logo.png" alt="TaskFixerAI" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-semibold">TaskFixerAI</span>
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Complete Your Purchase</h1>
          <p className="text-gray-400">You'll be redirected to Stripe to complete payment</p>
        </div>

        <div className="bg-[#171717] border border-[#2a2a2a] rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{details.name}</p>
                <p className="text-sm text-gray-400">{details.price}</p>
              </div>
              <p className="text-xl font-semibold">{details.total}</p>
            </div>

            {details.savings && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <p className="text-sm text-green-400 text-center">💰 {details.savings}</p>
              </div>
            )}
          </div>

          <div className="border-t border-[#2a2a2a] pt-6 space-y-3">
            <div className="flex items-start gap-3 text-sm">
              <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-300">Unlimited PDF redesigns</span>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-300">Full reflection & differentiation features</span>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-300">Email support & all future updates</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-[#2a2a2a]">
            <p className="text-xs text-gray-500 text-center">
              Secure payment powered by Stripe. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
