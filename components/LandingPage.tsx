"use client";

import React, { useState, useEffect } from "react";
import { 
  Server, Cpu, Shield, Zap, Globe, Database, ArrowRight, CheckCircle2, 
  Search, Terminal, Activity, DollarSign, Layers, Compass, Play, Check 
} from "lucide-react";
import { useAppStore } from "@/lib/store";

const REGIONS = [
  { name: "US East (N. Virginia)", code: "us-east", basePing: 12 },
  { name: "EU West (Frankfurt)", code: "eu-west", basePing: 28 },
  { name: "Asia Pacific (Tokyo)", code: "ap-tokyo", basePing: 45 },
  { name: "South America (São Paulo)", code: "sa-east", basePing: 62 },
  { name: "Australia (Sydney)", code: "ap-southeast", basePing: 85 }
];

export default function LandingPage() {
  const { setActiveView } = useAppStore();
  
  // Latency Tester State
  const [pings, setPings] = useState<Record<string, number | "testing" | null>>({
    "us-east": null,
    "eu-west": null,
    "ap-tokyo": null,
    "sa-east": null,
    "ap-southeast": null
  });
  const [isTestingPing, setIsTestingPing] = useState(false);

  // Pricing Estimator State
  const [ram, setRam] = useState(2); // GB
  const [cpu, setCpu] = useState(1); // vCPU
  const [storage, setStorage] = useState(40); // GB SSD
  const [bandwidth, setBandwidth] = useState(1); // TB

  // Domain Checker State
  const [domainQuery, setDomainQuery] = useState("");
  const [domainResult, setDomainResult] = useState<{
    domain: string;
    available: boolean;
    price?: string;
    searched: boolean;
  } | null>(null);
  const [isSearchingDomain, setIsSearchingDomain] = useState(false);

  // Auto-ping on load to make the page feel alive
  useEffect(() => {
    testAllPings();
  }, []);

  const testAllPings = async () => {
    if (isTestingPing) return;
    setIsTestingPing(true);
    
    // Set all to testing
    const initialTesting: Record<string, number | "testing" | null> = {};
    REGIONS.forEach(r => {
      initialTesting[r.code] = "testing";
    });
    setPings(initialTesting);

    // Simulate pings sequentially with slight variations
    for (const region of REGIONS) {
      await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400));
      const calculatedPing = Math.round(region.basePing + (Math.random() * 8 - 4));
      setPings(prev => ({
        ...prev,
        [region.code]: calculatedPing
      }));
    }
    setIsTestingPing(false);
  };

  // Pricing Calculation
  const calculatePrice = () => {
    const ramCost = ram * 4.5;
    const cpuCost = cpu * 8;
    const storageCost = storage * 0.12;
    const bandwidthCost = bandwidth * 2.5;
    return (ramCost + cpuCost + storageCost + bandwidthCost).toFixed(2);
  };

  // Domain availability search simulation
  const checkDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainQuery) return;

    setIsSearchingDomain(true);
    setDomainResult(null);

    setTimeout(() => {
      const cleanDomain = domainQuery.trim().toLowerCase();
      const hasExtension = cleanDomain.includes(".");
      const fullDomain = hasExtension ? cleanDomain : `${cleanDomain}.com`;
      const isAvailable = Math.random() > 0.35 && !cleanDomain.includes("google") && !cleanDomain.includes("apple") && !cleanDomain.includes("microsoft");
      
      setDomainResult({
        domain: fullDomain,
        available: isAvailable,
        price: isAvailable ? (Math.random() * 12 + 4.99).toFixed(2) : undefined,
        searched: true
      });
      setIsSearchingDomain(false);
    }, 800);
  };

  return (
    <div className="relative w-full overflow-hidden bg-[#030712]">
      {/* Background Grid & Ambient Glows */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveView("landing")}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Aether<span className="text-blue-500">Host</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#ping-test" className="hover:text-white transition-colors">Global Network</a>
            <a href="#domain-checker" className="hover:text-white transition-colors">Domains</a>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveView("dashboard")}
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => setActiveView("dashboard")}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all duration-200 flex items-center gap-1.5 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
            >
              Console <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8 animate-pulse-slow">
          <Zap className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">Next-Gen Cloud Deployment</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 text-balance leading-[1.1]">
          Deploy cloud apps at the <br />
          <span className="bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
            speed of thought.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-400 mb-10 text-pretty">
          AetherHost combines powerful virtual servers, instant Git deployments, global edge routing, and fully managed databases into one seamless developer experience.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button 
            onClick={() => setActiveView("dashboard")}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-semibold transition-all duration-300 shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 group"
          >
            Deploy Your First Project <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={() => {
              const el = document.getElementById("pricing");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-secondary hover:bg-gray-800 border border-border text-gray-300 hover:text-white font-semibold transition-all duration-200 flex items-center justify-center gap-2"
          >
            Calculate Cost
          </button>
        </div>

        {/* Console Preview Panel */}
        <div className="relative max-w-4xl mx-auto rounded-xl border border-border bg-card/60 backdrop-blur-md overflow-hidden shadow-2xl glow-primary">
          <div className="flex items-center justify-between px-4 py-3 bg-[#080d19] border-b border-border">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-xs font-mono text-gray-500">aetherhost-deploy-pipeline.sh</span>
            <span className="w-4" />
          </div>
          <div className="p-6 text-left font-mono text-xs sm:text-sm text-gray-300 space-y-2 overflow-x-auto">
            <p className="text-blue-400">$ curl -sSL https://aetherhost.sh | sh</p>
            <p className="text-gray-500">Initializing AetherHost Terminal CLI v2.4.1...</p>
            <p className="text-gray-500">✓ Detected repository: github.com/apex-labs/hyperion-api</p>
            <p className="text-teal-400">⚡ Deploying to global edge network...</p>
            <p className="text-gray-400">   [1/3] Bundling static files and assets... (0.4s)</p>
            <p className="text-gray-400">   [2/3] Resolving Next.js App Router dependencies... (1.2s)</p>
            <p className="text-gray-400">   [3/3] Generating SSL configurations... (0.2s)</p>
            <p className="text-emerald-400">🎉 Deployment Successful! Live at: https://hyperion-api.aetherhost.app</p>
          </div>
        </div>
      </section>

      {/* Global Network / Latency Section */}
      <section id="ping-test" className="py-20 bg-card/30 border-t border-b border-border relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Global Edge Network</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 tracking-tight">
                Zero lag. True global routing.
              </h2>
              <p className="text-gray-400 mb-8 text-lg">
                With over 48 edge locations worldwide, your static assets, APIs, and database transactions are automatically routed to the absolute closest node to your client. Test the latency from your actual browser below!
              </p>

              <button 
                onClick={testAllPings}
                disabled={isTestingPing}
                className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg shadow-blue-500/20"
              >
                <Activity className={`w-5 h-5 ${isTestingPing ? "animate-spin" : ""}`} />
                {isTestingPing ? "Testing Latency..." : "Test Real-Time Latency"}
              </button>
            </div>

            {/* Latency Test Results Panel */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Compass className="w-5 h-5 text-blue-400" /> Edge Server Latency Telemetry
              </h3>
              
              <div className="space-y-4">
                {REGIONS.map((region) => {
                  const pingVal = pings[region.code];
                  return (
                    <div key={region.code} className="flex items-center justify-between p-3.5 rounded-xl bg-background/50 border border-border">
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <div>
                          <p className="text-sm font-semibold text-white">{region.name}</p>
                          <p className="text-xs text-gray-500">Edge Node: {region.code}.aetherhost.net</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {pingVal === "testing" ? (
                          <span className="text-xs font-mono text-blue-400 animate-pulse">pinging...</span>
                        ) : pingVal !== null ? (
                          <span className={`text-sm font-mono font-bold ${
                            pingVal < 30 ? "text-emerald-400" : pingVal < 60 ? "text-yellow-400" : "text-blue-400"
                          }`}>
                            {pingVal} ms
                          </span>
                        ) : (
                          <span className="text-xs font-mono text-gray-500">Not tested</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Domain Availability Checker */}
      <section id="domain-checker" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
            <Search className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Instant Domains</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            Claim Your Digital Real Estate
          </h2>
          <p className="text-gray-400">
            Search, register, and link custom domains straight to your applications instantly. Free SSL certificate and auto-renewal included.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={checkDomain} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input 
                type="text" 
                placeholder="search-your-dream-domain.com"
                value={domainQuery}
                onChange={(e) => setDomainQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-card border border-border focus:border-blue-500 text-white font-medium outline-none transition-colors"
              />
            </div>
            <button 
              type="submit"
              disabled={isSearchingDomain}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-blue-800 disabled:to-indigo-800 text-white font-semibold transition-all duration-200 shadow-lg shadow-blue-500/10"
            >
              {isSearchingDomain ? "Checking..." : "Check Availability"}
            </button>
          </form>

          {domainResult && (
            <div className="mt-6 p-5 rounded-xl border border-border bg-card/80 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
              <div className="flex items-center gap-3">
                {domainResult.available ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 font-bold text-sm shrink-0">✕</div>
                )}
                <div>
                  <h4 className="text-base font-bold text-white">{domainResult.domain}</h4>
                  <p className="text-xs text-gray-400">
                    {domainResult.available ? "Premium domain available for registration!" : "Domain is currently registered. Try another name."}
                  </p>
                </div>
              </div>

              {domainResult.available && (
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Only</p>
                    <p className="text-lg font-mono font-bold text-emerald-400">${domainResult.price}/yr</p>
                  </div>
                  <button 
                    onClick={() => setActiveView("dashboard")}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors"
                  >
                    Buy & Deploy
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 border-t border-border bg-card/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
              Engineered for absolute performance
            </h2>
            <p className="text-gray-400">
              Stop fighting cloud dashboards and complicated server setups. Get your projects live with production-grade infrastructure right out of the box.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border border-border bg-card/50 hover:border-blue-500/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">High-Performance Compute</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Dedicated vCPUs powered by modern AMD EPYC processors. Guaranteed CPU share and rapid execution.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-border bg-card/50 hover:border-emerald-500/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Instant Git Push Deploy</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Just push your codebase to GitHub or GitLab. We automatically compile, optimize, and deploy your code at the edge.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-border bg-card/50 hover:border-purple-500/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Managed Edge Databases</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Provision high-availability PostgreSQL, Redis, or MongoDB databases with one click. Automatic daily backups included.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-border bg-card/50 hover:border-yellow-500/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 mb-6 group-hover:bg-yellow-500 group-hover:text-white transition-all duration-300">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Enterprise-Grade Security</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Layer-7 DDoS mitigation, auto-renewing SSL certificates, and custom web application firewall rules for every project.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-border bg-card/50 hover:border-pink-500/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-6 group-hover:bg-pink-500 group-hover:text-white transition-all duration-300">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Smart DNS Routing</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Anycast routing guarantees that your custom domains resolve with the lowest possible latency worldwide.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-border bg-card/50 hover:border-blue-500/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                <Server className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Serverless Functions</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Execute fast background workers or API endpoints without managing servers. Scale automatically from zero to millions of requests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Estimator Slider Tool */}
      <section id="pricing" className="py-20 bg-[#060a16] border-t border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
              Honest, Transparent Pricing
            </h2>
            <p className="text-gray-400">
              No hidden fees. Estimate your custom deployment configuration using our real-time slider tool below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Sliders */}
            <div className="lg:col-span-7 space-y-8 bg-card/40 border border-border p-8 rounded-2xl">
              <div>
                <div className="flex justify-between text-sm font-semibold text-gray-300 mb-2">
                  <span className="flex items-center gap-1.5"><Layers className="w-4 h-4 text-blue-400" /> Dedicated RAM</span>
                  <span className="text-blue-400 font-mono text-base">{ram} GB</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="32" 
                  value={ram}
                  onChange={(e) => setRam(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-secondary accent-blue-500 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 GB</span>
                  <span>16 GB</span>
                  <span>32 GB</span>
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
                  max="16" 
                  value={cpu}
                  onChange={(e) => setCpu(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-secondary accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 vCPU</span>
                  <span>8 vCPUs</span>
                  <span>16 vCPUs</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-semibold text-gray-300 mb-2">
                  <span className="flex items-center gap-1.5"><Database className="w-4 h-4 text-purple-400" /> High-Speed NVMe Storage</span>
                  <span className="text-purple-400 font-mono text-base">{storage} GB</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="500" 
                  step="10"
                  value={storage}
                  onChange={(e) => setStorage(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-secondary accent-purple-500 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10 GB</span>
                  <span>250 GB</span>
                  <span>500 GB</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-semibold text-gray-300 mb-2">
                  <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-pink-400" /> Global Monthly Bandwidth</span>
                  <span className="text-pink-400 font-mono text-base">{bandwidth} TB</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="20" 
                  value={bandwidth}
                  onChange={(e) => setBandwidth(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-secondary accent-pink-500 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 TB</span>
                  <span>10 TB</span>
                  <span>20 TB</span>
                </div>
              </div>
            </div>

            {/* Total Cost Display Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#0c152b] to-[#040813] border-2 border-blue-500/30 rounded-2xl p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between h-full min-h-[400px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div>
                <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 uppercase tracking-wider">Estimated Price</span>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold text-white tracking-tight">${calculatePrice()}</span>
                  <span className="text-gray-400 text-lg">/mo</span>
                </div>
                <p className="text-gray-400 text-sm mt-4">
                  Billed hourly. Cancel or scale up/down anytime with zero penalty fees.
                </p>

                <div className="mt-8 space-y-3">
                  <div className="flex items-center gap-2.5 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Free Dedicated IPv4 + IPv6</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Anycast DNS & Global Edge Routing</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Automated Daily Backups</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setActiveView("dashboard")}
                className="w-full mt-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30"
              >
                Launch This Server <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <span className="text-md font-bold tracking-tight text-white">
              AetherHost
            </span>
          </div>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} AetherHost Technologies Inc. Built inside Sycord platform.
          </p>
        </div>
      </footer>
    </div>
  );
}
