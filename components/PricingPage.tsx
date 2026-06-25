"use client";

import React, { useState } from "react";
import { 
  Check, Layers, Cpu, Database, Globe, ArrowRight, HelpCircle, ChevronDown, 
  ChevronUp, Shield, Zap, DollarSign 
} from "lucide-react";
import { useAppStore } from "@/lib/store";

const TIERS = [
  {
    name: "Hobby",
    price: "0",
    desc: "Perfect for personal portfolios, side projects, and hobbyist apps.",
    features: [
      "1x Shared vCPU",
      "512 MB RAM",
      "5 GB High-Speed NVMe Storage",
      "100 GB Monthly Bandwidth",
      "Free SSL & Custom Domains",
      "Managed DB Free Tier (PostgreSQL/Redis)"
    ],
    cta: "Start Free",
    popular: false,
    color: "border-border"
  },
  {
    name: "Pro Developer",
    price: "19",
    desc: "Ideal for production-grade web applications, SaaS startups, and APIs.",
    features: [
      "2x Dedicated vCPUs",
      "4 GB RAM",
      "40 GB High-Speed NVMe Storage",
      "1 TB Monthly Bandwidth",
      "Anycast DNS & Edge CDN",
      "Managed DB Pro Tier (Automatic backups)",
      "Priority 24/7 Support"
    ],
    cta: "Deploy Pro",
    popular: true,
    color: "border-blue-500 shadow-lg shadow-blue-500/10"
  },
  {
    name: "Business Scale",
    price: "79",
    desc: "Built for high-traffic platforms, enterprise workloads, and heavy databases.",
    features: [
      "4x Dedicated vCPUs",
      "16 GB RAM",
      "150 GB High-Speed NVMe Storage",
      "5 TB Monthly Bandwidth",
      "Advanced DDoS Protection",
      "Enterprise Multi-region Databases",
      "SLA 99.99% Guaranteed uptime",
      "Dedicated account manager"
    ],
    cta: "Launch Business",
    popular: false,
    color: "border-purple-500/50"
  }
];

const FAQS = [
  {
    q: "How does the hourly billing work?",
    a: "We calculate your server resources (CPU, RAM, storage) by the second. At the end of the month, you receive a single consolidated invoice for the exact hours your instances were active. Paused servers only incur storage costs, not compute fees."
  },
  {
    q: "Can I scale my server resources up or down?",
    a: "Yes! You can scale your RAM, CPU, and storage allocation at any time from your AetherConsole dashboard with zero downtime. Our system automatically hot-plugs resources and updates routing in seconds."
  },
  {
    q: "Are database backups automated?",
    a: "Absolutely. For all active managed database instances (PostgreSQL, Redis, MongoDB), we run daily automated snapshots. On the Pro and Business tiers, backups are retained for 30 days and can be restored with a single click."
  },
  {
    q: "Is there a bandwidth overage fee?",
    a: "No. If you reach your monthly bandwidth limit, we do not shut down your site. Instead, we gently throttle transfer speeds slightly or let you upgrade to the next tier with a single click. No surprise bills."
  }
];

export default function PricingPage() {
  const { setActiveView } = useAppStore();
  
  // Custom Estimator State
  const [ram, setRam] = useState(4);
  const [cpu, setCpu] = useState(2);
  const [storage, setStorage] = useState(80);
  const [bandwidth, setBandwidth] = useState(2);

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const calculateCustomPrice = () => {
    const ramCost = ram * 4.5;
    const cpuCost = cpu * 8;
    const storageCost = storage * 0.12;
    const bandwidthCost = bandwidth * 2.5;
    return (ramCost + cpuCost + storageCost + bandwidthCost).toFixed(2);
  };

  return (
    <div className="relative w-full overflow-hidden bg-[#030712] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Grid */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <button 
          onClick={() => setActiveView("landing")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white mb-12 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" /> Back to Homepage
        </button>

        {/* Pricing Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
            <DollarSign className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">Predictable Pricing</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Simple plans. Unlimited scale.
          </h1>
          <p className="text-gray-400 mt-4 text-lg">
            Whether you are launching a personal project or a high-traffic enterprise platform, we have a pricing plan that fits your requirements.
          </p>
        </div>

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {TIERS.map((tier) => (
            <div 
              key={tier.name}
              className={`p-8 rounded-2xl border bg-card/40 backdrop-blur-md flex flex-col justify-between relative ${tier.color}`}
            >
              {tier.popular && (
                <span className="absolute top-0 right-6 -translate-y-1/2 px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider">
                  Most Popular
                </span>
              )}

              <div>
                <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-6">{tier.desc}</p>
                
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-extrabold text-white">${tier.price}</span>
                  <span className="text-gray-400 text-sm">/month</span>
                </div>

                <div className="space-y-4 mb-8">
                  {tier.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActiveView("dashboard")}
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                  tier.popular 
                    ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20" 
                    : "bg-secondary hover:bg-gray-800 text-gray-300 hover:text-white border border-border"
                }`}
              >
                {tier.cta} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Custom Estimator Tool */}
        <div className="bg-card border border-border rounded-2xl p-8 md:p-12 mb-24 shadow-xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Configure a Custom Server</h2>
            <p className="text-gray-400 text-sm">
              Need specific resources? Slide the controls below to configure a custom instance and view instant pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Sliders */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <div className="flex justify-between text-sm font-semibold text-gray-300 mb-2">
                  <span className="flex items-center gap-1.5"><Layers className="w-4 h-4 text-blue-400" /> Dedicated RAM</span>
                  <span className="text-blue-400 font-mono text-base">{ram} GB</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="64" 
                  value={ram}
                  onChange={(e) => setRam(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-secondary accent-blue-500 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 GB</span>
                  <span>32 GB</span>
                  <span>64 GB</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-semibold text-gray-300 mb-2">
                  <span className="flex items-center gap-1.5"><Cpu className="w-4 h-4 text-emerald-400" /> CPU Allocation</span>
                  <span className="text-emerald-400 font-mono text-base">{cpu} vCPUs</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="32" 
                  value={cpu}
                  onChange={(e) => setCpu(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-secondary accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 vCPU</span>
                  <span>16 vCPUs</span>
                  <span>32 vCPUs</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-semibold text-gray-300 mb-2">
                  <span className="flex items-center gap-1.5"><Database className="w-4 h-4 text-purple-400" /> NVMe SSD Storage</span>
                  <span className="text-purple-400 font-mono text-base">{storage} GB</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="1000" 
                  step="10"
                  value={storage}
                  onChange={(e) => setStorage(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-secondary accent-purple-500 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10 GB</span>
                  <span>500 GB</span>
                  <span>1000 GB</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-semibold text-gray-300 mb-2">
                  <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-pink-400" /> Monthly Bandwidth</span>
                  <span className="text-pink-400 font-mono text-base">{bandwidth} TB</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="50" 
                  value={bandwidth}
                  onChange={(e) => setBandwidth(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-secondary accent-pink-500 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 TB</span>
                  <span>25 TB</span>
                  <span>50 TB</span>
                </div>
              </div>
            </div>

            {/* Total Cost Display Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#0c152b] to-[#040813] border-2 border-blue-500/30 rounded-2xl p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between h-full min-h-[350px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div>
                <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 uppercase tracking-wider">Custom Quote</span>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold text-white tracking-tight">${calculateCustomPrice()}</span>
                  <span className="text-gray-400 text-lg">/mo</span>
                </div>
                <p className="text-gray-400 text-sm mt-4">
                  Fully customized resources. Includes free automatic scaling and Anycast DNS routing.
                </p>
              </div>

              <button 
                onClick={() => setActiveView("dashboard")}
                className="w-full mt-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20"
              >
                Deploy This Config <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div 
                key={idx}
                className="border border-border rounded-xl bg-card/30 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left font-semibold text-white flex items-center justify-between gap-4 hover:bg-card/50 transition-colors"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>

                {openFaq === idx && (
                  <div className="p-5 pt-0 text-sm text-gray-400 border-t border-border bg-background/20 leading-relaxed">
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

// Simple ArrowLeft icon helper to avoid missing imports
function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}
