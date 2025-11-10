"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ContactSalesPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/contact-sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-green-500/20 border border-green-500/40 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold mb-4">Thank you for your inquiry!</h1>
          <p className="text-gray-400 mb-6">
            Our team will review your request and get back to you within 24-48 hours.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Header */}
      <div className="border-b border-[#2a2a2a]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl p-2">
              <img src="/logo.png" alt="TaskFixerAI" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-semibold">TaskFixerAI</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>

      {/* Contact Form */}
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Sales</h1>
          <p className="text-xl text-gray-400">
            Interested in our School Plan? Let's discuss your needs.
          </p>
        </div>

        <div className="bg-[#171717] border border-[#2a2a2a] rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#2a2a2a] border border-[#404040] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="Jane Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#2a2a2a] border border-[#404040] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="jane@school.edu"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="organization" className="block text-sm font-medium mb-2">
                  School/Organization
                </label>
                <input
                  id="organization"
                  name="organization"
                  type="text"
                  value={formData.organization}
                  onChange={handleChange}
                  className="w-full bg-[#2a2a2a] border border-[#404040] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="Lincoln High School"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-[#2a2a2a] border border-[#404040] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full bg-[#2a2a2a] border border-[#404040] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
                placeholder="Tell us about your school's needs, number of teachers, and any specific requirements..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-white text-black font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Inquiry"}
            </button>

            <p className="text-xs text-gray-500 text-center">
              We typically respond within 24-48 hours during business days.
            </p>
          </form>
        </div>

        {/* Additional Info */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-[#171717] border border-[#2a2a2a] rounded-xl p-6">
            <div className="w-10 h-10 bg-[#2a2a2a] rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Multi-User Access</h3>
            <p className="text-sm text-gray-400">
              Provide access to all teachers in your school or district
            </p>
          </div>

          <div className="bg-[#171717] border border-[#2a2a2a] rounded-xl p-6">
            <div className="w-10 h-10 bg-[#2a2a2a] rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Priority Support</h3>
            <p className="text-sm text-gray-400">
              Get dedicated support and faster response times
            </p>
          </div>

          <div className="bg-[#171717] border border-[#2a2a2a] rounded-xl p-6">
            <div className="w-10 h-10 bg-[#2a2a2a] rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Training Included</h3>
            <p className="text-sm text-gray-400">
              Onboarding sessions to help your team get started
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
