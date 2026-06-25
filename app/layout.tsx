import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AetherHost — Next-Gen AI & Cloud Application Hosting",
  description: "Deploy, scale, and monitor your full-stack applications, static sites, and AI models in seconds. Global edge network, instant setups, and real-time telemetry.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[#030712] dark">
      <body className="antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}