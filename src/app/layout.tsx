import "./globals.css";
import Navbar from "@/components/Navbar";
import ClientWrapper from "@/components/ClientWrapper";
import { AlarmProvider } from "@/context/AlarmContext"; // <-- import the provider

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientWrapper>
          <AlarmProvider> {/* <-- wrap everything with AlarmProvider */}
            <Navbar />
            {children}
          </AlarmProvider>
        </ClientWrapper>
      </body>
    </html>
  );
}
