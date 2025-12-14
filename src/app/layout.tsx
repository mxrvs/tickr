import "./globals.css";
import Navbar from "@/components/Navbar";
import ClientWrapper from "@/components/ClientWrapper";
import { AlarmProvider } from "@/context/AlarmContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tickr",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientWrapper>
          <AlarmProvider>
            <Navbar />
            {children}
          </AlarmProvider>
        </ClientWrapper>
      </body>
    </html>
  );
}
