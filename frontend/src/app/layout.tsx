import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "WorkLife AI",
  description: "Your guide to working and living in Japan",
};

// Runs synchronously before first paint — prevents flash of wrong theme.
// Reads localStorage and sets data-theme on <html> before the browser renders.
const themeScript = `(function(){var s=localStorage.getItem('theme');if(s==='dark'||s==='light')document.documentElement.setAttribute('data-theme',s);})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [messages, locale] = await Promise.all([getMessages(), getLocale()]);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-surface text-body transition-colors duration-200">
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
