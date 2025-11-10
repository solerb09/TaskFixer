"use client";

import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>TaskFixerAI Chat</title>
        <meta name="description" content="AI-powered task management assistant by Creative Transformations Consulting" />
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
