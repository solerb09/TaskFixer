"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { IconThemeToggle } from "./IconThemeToggle";

export default function ProfileMenu() {
  const { profile, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut();
    // The ProtectedRoute component will automatically redirect to /auth/login
  };

  // Get initials from full name
  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Button with Theme Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary-bg transition-colors flex-1"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-purple to-brand-cyan flex items-center justify-center text-white text-sm font-semibold">
            {getInitials(profile?.full_name)}
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-sm font-medium text-foreground truncate max-w-[150px]">
              {profile?.full_name || "User"}
            </div>
          </div>
        </button>
        <IconThemeToggle />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-primary-bg border border-border-default rounded-lg shadow-lg overflow-hidden z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-border-default">
            <div className="text-sm font-medium text-foreground">
              {profile?.full_name || "User"}
            </div>
            <div className="text-xs text-text-secondary mt-1 truncate">
              {profile?.email}
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <a
              href="/account"
              className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-secondary-bg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Account Settings
            </a>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-secondary-bg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
