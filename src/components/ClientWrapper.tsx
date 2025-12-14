"use client";
import { ThemeProvider } from "next-themes";
import { Orbitron } from "next/font/google";
import { ReactNode, useEffect, useState } from "react";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-digital",
});

export default function ClientWrapper({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // prevents hydration issues

  return (
    <ThemeProvider attribute="class" enableSystem defaultTheme="system">
      <div className={orbitron.variable}>{children}</div>
    </ThemeProvider>
  );
}
