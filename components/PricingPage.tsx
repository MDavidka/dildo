"use client";

import React, { useState } from "react";
import { 
  Check, Layers, Cpu, Database, Globe, ArrowRight, HelpCircle, ChevronDown, 
  ChevronUp, Shield, Zap, DollarSign, ArrowLeft, Gamepad2, Users, Sliders
} from "lucide-react";
import { useAppStore } from "@/lib/store";

const TIERS = [
  {
    name: "Dirt Plan",
    price: "4.00",
    ram: "2 GB",
    desc: "Perfect for a small private survival world or a couple of friends playing vanilla.",
    features: [
      "1x Shared vCPU (Ryzen 9 7950X)",
      "2 GB DDR5 ECC RAM",
      "15 GB NVMe SSD Storage",
      "Unlimited Player Slots",
      "Layer 7 Game DDoS Protection",
      "Instant 45s Server Setup"
    ],
    cta: "Deploy Dirt Plan",
    popular: false,
    color: "border-white/5"
  },
  {
    name: "Iron Plan",
    price: "8.00",
    ram: "4 GB",
    desc: "Ideal for community survival SMPs, running Spigot/Paper with standard plugins.",
    features: [
      "2x Shared vCPUs (Ryzen 9 7950X)",
      "4 GB DDR5 ECC RAM",
      "30 GB NVMe SSD Storage",
      "Unlimited Player Slots",
      "Full Web FTP File Access",
      "1-Click Plugin Installer",
      "Priority 24/7 Support"
    ],
    cta: "Deploy Iron Plan",
    popular: true,
    color: "border-emerald-500 shadow-lg shadow-emerald-500/10"
  },
  {
    name: "Diamond Plan",
    price: "16.00",
    ram: "8 GB",
    desc: "Built for heavy modded survival (Pixelmon, RLCraft) or large active community networks.",
    features: [
      "3x Dedicated vCPUs (Ryzen 9 7950X)",
      "8 GB DDR5 ECC RAM",
      "60 GB NVMe SSD Storage",
      "Unlimited Player Slots",
      "Automated Daily Backups",
      "Custom Modpack Installer",
      "SLA 99.99% Uptime Guarantee"
    ],
    cta: "Deploy Diamond Plan",
    popular: false,
    color: "border-blue-500/50"
  },
  {
    name: "Netherite Plan",
    price: "32.00",
    ram: "16 GB",
    desc: "The ultimate tier for massive networks, custom mini-games, and heavy modpacks.",
    features: [
      "4x Dedicated vCPUs (Ryzen 9 7950X)",
      "16 GB DDR5 ECC RAM",
      "120 GB NVMe SSD Storage",
      "Unlimited Player Slots",
      "Dedicated IP & Port Allocation",
      "Enterprise Backups & Retentions",
      "Direct Support Slack/Discord"
    ],
    cta: "Deploy Netherite Plan",
    popular: false,
    color: "border-purple-500/50"
  }
];

const FAQS = [
  {
    q: "Can I upload custom modpacks or mods?",
    a: "Absolutely! You can upload any custom modpack, Forge, Fabric, or custom jars directly using our Web FTP File Manager or an external FTP client like FileZilla. We do not restrict file uploads in any way."
  },
  {
    q: "How does your DDoS protection work?",
    a: "We operate a specialized Layer 7 Game DDoS mitigation network. It is specifically configured with deep packet inspection to filter malicious UDP floods, query exploits, and bot attacks targetting Minecraft (SLP), Steam, Rust, and Source engine queries, keeping your server lag-free."
  },
  {
    q: "Can I upgrade or downgrade my RAM later?",
    a: "Yes, you can scale your RAM and storage up or down at any time with a single click in your NivleConsole. All world directories, plugins, and mod configurations are fully preserved during resource scaling."
  },
  {
    q: "Are there any player slot limits?",
    a: "No! We never charge you based on player slots. Your server has unlimited slots, meaning you can configure whatever count you want. The only limit is the physical RAM and CPU allocated to your server."
  }
];

export default function PricingPage() {
  const { setActiveView } = useAppStore();
  
  // Custom Estimator State
  const [slots, setSlots] = useState(20);
  const [plugins, setPlugins] = useState(12);
  const [mods, setMods] = useState(0);
  const [calcRam, setCalcRam] = useState(4);
  const [calcPrice, setCalcPrice] = useState(8);

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Recalculate RAM when sliders change
  React.useEffect(() => {
    const rawRam = 2 + (slots * 0.08) + (plugins * 0.05) + (mods * 0.04);
    let recommended = 2;
    if (rawRam <= 2.5) recommended = 2;
    else if (rawRam <= 3.5) recommended = 3;
    else if (rawRam <= 4.5) recommended = 4;
    else if (rawRam <= 6.5) recommended = 6;
    else if (rawRam <= 9.0) recommended = 8;
    else if (rawRam <= 13.0) recommended = 12;
    else if (rawRam <= 18.0) recommended = 16;
    else recommended = 24;

    setCalcRam(recommended);
    setCalcPrice(recommended * 2.00);
  }, [slots, plugins, mods]);

  return (
    <div className="relative w-full overflow-hidden bg-[#05070f] min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-gray-200">
      {/* Background Grid */}
      <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <button 
          onClick={() => setActiveView("landing")}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-emerald-400 mb-12 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Homepage
        </button>

        {/* Pricing Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Predictable Pricing</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Premium performance. Fair pricing.
          </h1>
          <p className="text-gray-400 mt-4 text-sm sm:text-base max-w-xl mx-auto">
            No slot limits, no hidden upgrades. Pay strictly for the DDR5 ECC RAM and Ryzen CPU threads allocated to your server container.
          </p>
        </div>

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {TIERS.map((tier) => (
            <div 
              key={tier.name}
              className={`p-6 rounded-2xl border bg-[#0a0d1a]/40 backdrop-blur-md flex flex-col justify-between relative shadow-xl ${tier.color}`}
            >
              {tier.popular && (
                <span className="absolute top-0 right-6 -translate-y-1/2 px-3 py-1 rounded-full bg-emerald-500 text-black text-[10px] font-extrabold uppercase tracking-wider">
                  Most Popular
                </span>
              )}

              <div>
                <h3 className="text-lg font-bold text-white mb-1">{tier.name}</h3>
                <span className="text-xs text-emerald-400 font-mono font-semibold">{tier.ram} Dedicated RAM</span>
                <p className="text-xs text-gray-400 leading-relaxed mt-3 mb-6">{tier.desc}</p>
                
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-extrabold text-white font-mono">${tier.price}</span>
                  <span className="text-gray-500 text-xs">/month</span>
                </div>

                <div className="space-y-3.5 mb-8 border-t border-white/5 pt-6">
                  {tier.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActiveView("dashboard")}
                className={`w-full py-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                  tier.popular 
                    ? "bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20" 
                    : "bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5"
                }`}
              >
                {tier.cta} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Custom Estimator Tool */}
        <div className="bg-[#0b0e1d] border border-white/5 rounded-2xl p-6 sm:p-8 md:p-12 mb-24 shadow-xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Resource Planner & Estimator</h2>
            <p className="text-gray-400 text-xs sm:text-sm">
              Slide the controls below to configure a custom Minecraft server profile. We will automatically calculate the recommended RAM and cost.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Sliders */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex justify-between text-sm font-semibold text-gray-300 mb-2">
                  <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-emerald-400" /> Concurrent Players</span>
                  <span className="text-emerald-400 font-mono text-base">{slots} Players</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="100" 
                  value={slots}
                  onChange={(e) => setSlots(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-white/10 accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                  <span>1 Player</span>
                  <span>50 Players</span>
                  <span>100 Players</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-semibold text-gray-300 mb-2">
                  <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-blue-400" /> Active Plugins</span>
                  <span className="text-blue-400 font-mono text-base">{plugins} Plugins</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="50" 
                  value={plugins}
                  onChange={(e) => setPlugins(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-white/10 accent-blue-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                  <span>0 Plugins</span>
                  <span>25 Plugins</span>
                  <span>50 Plugins</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-semibold text-gray-300 mb-2">
                  <span className="flex items-center gap-1.5"><Database className="w-4 h-4 text-purple-400" /> Modpack Size</span>
                  <span className="text-purple-400 font-mono text-base">{mods} Mods</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="150" 
                  value={mods}
                  onChange={(e) => setMods(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-white/10 accent-purple-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                  <span>0 Mods</span>
                  <span>75 Mods</span>
                  <span>150 Mods</span>
                </div>
              </div>
            </div>

            {/* Total Cost Display Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#0a161b] to-[#040813] border-2 border-emerald-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between h-full min-h-[320px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Recommended Config</span>
                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold text-white tracking-tight font-mono">{calcRam} GB</span>
                  <span className="text-gray-400 text-xs font-semibold">DDR5 ECC RAM</span>
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-emerald-400 font-mono">${calcPrice.toFixed(2)}</span>
                  <span className="text-gray-500 text-sm">/mo</span>
                </div>
                <p className="text-gray-400 text-xs mt-4">
                  Billed monthly. Scale up or down anytime with instant hot-plug memory adjustments and zero data wipes.
                </p>
              </div>

              <button 
                onClick={() => setActiveView("dashboard")}
                className="w-full mt-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all duration-200 flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20"
              >
                Launch Server Configuration <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div 
                key={idx}
                className="border border-white/5 rounded-xl bg-[#0a0d1a]/30 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left font-bold text-sm sm:text-base text-white flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
                </button>

                {openFaq === idx && (
                  <div className="p-5 pt-0 text-xs sm:text-sm text-gray-400 border-t border-white/5 bg-black/10 leading-relaxed text-left">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
