import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nivle Host — Premium Minecraft & Game Server Hosting",
  description: "Lag-free game server hosting powered by 5.8 GHz AMD Ryzen 9 7950X CPUs, ultra-fast NVMe SSDs, specialized Layer 7 DDoS shielding, and our custom NivleConsole game panel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[#05070f] dark">
      <body className="antialiased min-h-screen flex flex-col bg-[#05070f]">
        {children}
      </body>
    </html>
  );
}
