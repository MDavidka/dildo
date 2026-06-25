"use client";

import React, { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import LandingPage from "@/components/LandingPage";
import Dashboard from "@/components/Dashboard";
import DeployWizard from "@/components/DeployWizard";
import PricingPage from "@/components/PricingPage";

export default function Home() {
  const { activeView } = useAppStore();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by waiting for client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#05070f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center animate-pulse shadow-lg shadow-emerald-500/20">
            <span className="w-3 h-3 rounded-full bg-black animate-ping" />
          </div>
          <p className="text-xs text-gray-500 font-mono tracking-widest animate-pulse">BOOTING NIVLE HOST...</p>
        </div>
      </div>
    );
  }

  switch (activeView) {
    case "landing":
      return <LandingPage />;
    case "dashboard":
      return <Dashboard />;
    case "deploy-wizard":
      return <DeployWizard />;
    case "pricing":
      return <PricingPage />;
    default:
      return <LandingPage />;
  }
}
