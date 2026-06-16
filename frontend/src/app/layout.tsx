import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "WorkLife AI",
  description: "Your guide to working and living in Japan",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-surface text-body">
        <header className="bg-white border-b border-neutral-border">
          <nav className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link
              href="/"
              className="font-medium text-heading text-base"
            >
              WorkLife AI
            </Link>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/login" className="text-primary-600 hover:underline">
                Sign in
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-primary-600 text-white rounded-md font-medium hover:opacity-90"
              >
                Register
              </Link>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
