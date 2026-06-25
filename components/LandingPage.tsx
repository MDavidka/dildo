"use client";

import React, { useState, useEffect } from "react";
import { 
  Server, Cpu, Shield, Zap, Globe, Database, ArrowRight, CheckCircle2, 
  Search, Terminal, Activity, DollarSign, Layers, Compass, Play, Check,
  Users, Sliders, Gamepad2, Sparkles, AlertCircle, FileCode, CheckCircle
} from "lucide-react";
import { useAppStore } from "@/lib/store";

const REGIONS = [
  { name: "US East (Ashburn)", code: "us-east", basePing: 14 },
  { name: "EU West (Frankfurt)", code: "eu-west", basePing: 22 },
  { name: "Asia Pacific (Singapore)", code: "ap-singapore", basePing: 38 },
  { name: "Australia (Sydney)", code: "ap-southeast", basePing: 72 },
  { name: "UK (London)", code: "uk-london", basePing: 18 }
];

const GAME_TEMPLATES = [
  {
    id: "minecraft",
    name: "Minecraft Hosting",
    icon: Gamepad2,
    desc: "Lag-free Minecraft servers powered by 5.8 GHz AMD Ryzen 9 7950X CPUs. Supports Paper, Purpur, Forge, Fabric, and modpacks.",
    basePrice: "4.00",
    color: "from-emerald-500 to-green-600",
    shadow: "shadow-emerald-500/10",
    badge: "Most Popular",
    specs: "DDoS Protection • Unlimited Slots • NVMe SSD"
  },
  {
    id: "palworld",
    name: "Palworld Hosting",
    icon: Sparkles,
    desc: "Explore the Palpagos Islands with friends on fully optimized servers. Handles heavy memory footprints effortlessly.",
    basePrice: "12.00",
    color: "from-blue-500 to-indigo-600",
    shadow: "shadow-blue-500/10",
    badge: "Trending",
    specs: "8GB RAM Min • Multi-core CPU • Auto-Backups"
  },
  {
    id: "rust",
    name: "Rust Server Hosting",
    icon: FlameIcon,
    desc: "Wipe the competition, not your server. Instant Oxide/uMod installation, custom maps, and high tickrate performance.",
    basePrice: "16.00",
    color: "from-orange-500 to-red-600",
    shadow: "shadow-orange-500/10",
    badge: "Hardcore",
    specs: "128 Tickrate • Full FTP Access • Oxide Support"
  },
  {
    id: "valheim",
    name: "Valheim Hosting",
    icon: Shield,
    desc: "Conquer the tenth Norse world. Automatic server pause, mod support with Valheim Plus, and automated daily backups.",
    basePrice: "8.00",
    color: "from-yellow-500 to-amber-600",
    shadow: "shadow-yellow-500/10",
    badge: "Co-Op",
    specs: "Mods Enabled • 100% Uptime • Low Latency"
  }
];

export default function LandingPage() {
  const { setActiveView } = useAppStore();
  
  // Latency Tester State
  const [pings, setPings] = useState<Record<string, number | "testing" | null>>({
    "us-east": null,
    "eu-west": null,
    "ap-singapore": null,
    "ap-southeast": null,
    "uk-london": null
  });
  const [isTestingPing, setIsTestingPing] = useState(false);

  // Minecraft RAM Calculator State
  const [slots, setSlots] = useState(15);
  const [plugins, setPlugins] = useState(8);
  const [mods, setMods] = useState(0);
  const [calcRam, setCalcRam] = useState(4); // Recommended RAM in GB
  const [calcPrice, setCalcPrice] = useState(8); // Price in USD

  // Auto-ping on load
  useEffect(() => {
    testAllPings();
  }, []);

  // Recalculate RAM when sliders change
  useEffect(() => {
    // Basic recommendation formula:
    // Base 2GB
    // + 0.1GB per player slot
    // + 0.05GB per plugin
    // + 0.04GB per mod
    const rawRam = 2 + (slots * 0.08) + (plugins * 0.05) + (mods * 0.04);
    // Round to nearest logical GB: 2, 3, 4, 6, 8, 12, 16, 24, 32
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
    // Price is $2.00 per GB of RAM
    setCalcPrice(recommended * 2.00);
  }, [slots, plugins, mods]);

  const testAllPings = async () => {
    if (isTestingPing) return;
    setIsTestingPing(true);
    
    const initialTesting: Record<string, number | "testing" | null> = {};
    REGIONS.forEach(r => {
      initialTesting[r.code] = "testing";
    });
    setPings(initialTesting);

    for (const region of REGIONS) {
      await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
      const calculatedPing = Math.round(region.basePing + (Math.random() * 6 - 3));
      setPings(prev => ({
        ...prev,
        [region.code]: calculatedPing
      }));
    }
    setIsTestingPing(false);
  };

  return (
    <div className="relative w-full overflow-hidden bg-[#05070f] text-gray-200">
      {/* Background Grid & Ambient Glows */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] rounded-full bg-emerald-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[150px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#05070f]/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveView("landing")}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Server className="w-5 h-5 text-black font-bold" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
              Nivle<span className="text-emerald-400 font-extrabold">Host</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#games" className="hover:text-emerald-400 transition-colors">Games</a>
            <a href="#ram-calculator" className="hover:text-emerald-400 transition-colors">RAM Calculator</a>
            <a href="#features" className="hover:text-emerald-400 transition-colors">Performance</a>
            <a href="#panel" className="hover:text-emerald-400 transition-colors">Game Panel</a>
            <a href="#network" className="hover:text-emerald-400 transition-colors">Network</a>
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
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black transition-all duration-200 flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
            >
              Control Panel <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
          <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Ryzen 9 7950X Game Hosting</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 text-balance leading-[1.1]">
          Lag-free game servers <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
            running at 5.8 GHz.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-400 mb-10 text-pretty">
          Nivle Host delivers premium game server hosting with dedicated RAM, enterprise-grade NVMe SSDs, and specialized Layer 7 DDoS mitigation. Get your server online in under 60 seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 max-w-md mx-auto">
          <button 
            onClick={() => setActiveView("deploy-wizard")}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold transition-all duration-300 shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 group"
          >
            Deploy Server <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={() => {
              const el = document.getElementById("ram-calculator");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-semibold transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Sliders className="w-5 h-5 text-emerald-400" /> RAM Calculator
          </button>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm">
          <div className="text-center p-4">
            <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">14,204</p>
            <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mt-1">Servers Hosted</p>
          </div>
          <div className="text-center p-4 border-l border-white/5">
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">99.99%</p>
            <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mt-1">Uptime SLA</p>
          </div>
          <div className="text-center p-4 border-l border-white/5">
            <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">&lt; 45s</p>
            <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mt-1">Setup Time</p>
          </div>
          <div className="text-center p-4 border-l border-white/5">
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">4.8/5</p>
            <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mt-1">Trust Score</p>
          </div>
        </div>
      </section>

      {/* Game Selector Section */}
      <section id="games" className="py-20 bg-white/[0.01] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
              <Gamepad2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Choose Your Game</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Instant Provisioning for Top Titles
            </h2>
            <p className="text-gray-400 mt-4">
              Each game hosting plan is fine-tuned to the game's specific engine requirements. Full support for mods, plugins, and custom configurations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {GAME_TEMPLATES.map((game) => {
              const IconComp = game.icon;
              return (
                <div 
                  key={game.id}
                  className={`p-6 sm:p-8 rounded-2xl border border-white/5 bg-[#0a0d1a]/50 hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between relative group shadow-xl ${game.shadow}`}
                >
                  <span className="absolute top-4 right-6 px-3 py-1 rounded-full bg-white/5 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                    {game.badge}
                  </span>

                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center text-black`}>
                        <IconComp className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{game.name}</h3>
                        <p className="text-xs text-gray-500 font-mono">{game.specs}</p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-400 leading-relaxed mb-6">
                      {game.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div>
                      <p className="text-xs text-gray-500">Starting at</p>
                      <p className="text-xl font-extrabold text-white font-mono">
                        ${game.basePrice}<span className="text-xs text-gray-500 font-normal">/mo</span>
                      </p>
                    </div>
                    <button 
                      onClick={() => setActiveView("deploy-wizard")}
                      className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      Configure Server <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive RAM & Slot Calculator */}
      <section id="ram-calculator" className="py-20 border-t border-b border-white/5 bg-[#070a14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left side info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">RAM Calculator</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Don't overpay for RAM. <br />
                <span className="text-emerald-400">Calculate exactly what you need.</span>
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Minecraft and other game servers are heavily memory-bound. Use our intelligent estimator to gauge your requirements based on active players, plugins, and custom modpacks.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span>No artificial player slot limits</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span>One-click upgrades with zero data loss</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span>Real-time memory leak warnings</span>
                </div>
              </div>
            </div>

            {/* Right side interactive tool */}
            <div className="lg:col-span-7 bg-[#0b0e1d] border border-white/5 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
                <Sparkles className="w-5 h-5 text-emerald-400" /> Minecraft Server Estimator
              </h3>

              <div className="space-y-6">
                {/* Players Slider */}
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
                    <span>1 (Solo)</span>
                    <span>50 (Community)</span>
                    <span>100 (Network)</span>
                  </div>
                </div>

                {/* Plugins Slider */}
                <div>
                  <div className="flex justify-between text-sm font-semibold text-gray-300 mb-2">
                    <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-blue-400" /> Server Plugins (Essentials, WorldEdit, etc.)</span>
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
                    <span>0 (Vanilla)</span>
                    <span>25 (Semi-Vanilla)</span>
                    <span>50 (Heavy Bukkit)</span>
                  </div>
                </div>

                {/* Mods Slider */}
                <div>
                  <div className="flex justify-between text-sm font-semibold text-gray-300 mb-2">
                    <span className="flex items-center gap-1.5"><Database className="w-4 h-4 text-purple-400" /> Modpack Size (Forge / Fabric / Pixelmon)</span>
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
                    <span>0 (Vanilla)</span>
                    <span>50 (Light Modded)</span>
                    <span>150 (RLCraft / SevTech)</span>
                  </div>
                </div>

                {/* Recommendation Output */}
                <div className="mt-8 p-5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Recommended Configuration</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl font-extrabold text-white font-mono">{calcRam} GB</span>
                      <span className="text-xs text-emerald-400 font-semibold font-mono">DDR5 ECC RAM</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">Perfect for lag-free performance with zero tps drops.</p>
                  </div>

                  <div className="text-center sm:text-right w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-white/5 pt-4 sm:pt-0 sm:pl-6">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Estimated Cost</p>
                    <p className="text-3xl font-extrabold text-emerald-400 font-mono mt-1">${calcPrice.toFixed(2)}<span className="text-xs text-gray-500 font-normal">/mo</span></p>
                    <button 
                      onClick={() => setActiveView("deploy-wizard")}
                      className="w-full sm:w-auto mt-3 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all flex items-center justify-center gap-1"
                    >
                      Instant Deploy <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Game Control Panel Mockup Feature */}
      <section id="panel" className="py-20 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Next-Gen Control Panel</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Powerful Console. Zero Headache.
            </h2>
            <p className="text-gray-400 mt-4">
              Manage your servers with NivleConsole, our custom-built, lightweight control panel. Stop dealing with slow, bloated interfaces.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Features list */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Live Interactive Console</h4>
                  <p className="text-sm text-gray-400 mt-1">Execute server commands, view boot stages, and filter debug logs in real-time.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Web FTP File Manager</h4>
                  <p className="text-sm text-gray-400 mt-1">Directly edit config files, upload modpacks, and manage backups straight from your browser.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">1-Click Plugin Installer</h4>
                  <p className="text-sm text-gray-400 mt-1">Search and install thousands of Spigot/Paper plugins instantly without leaving the panel.</p>
                </div>
              </div>
            </div>

            {/* Interactive Panel Mockup */}
            <div className="lg:col-span-7 rounded-2xl border border-white/5 bg-[#04060f] shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-[#080d19] border-b border-white/5">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-gray-400 ml-2">NivleConsole v3.1.2</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 animate-pulse">ONLINE</span>
              </div>
              <div className="p-5 font-mono text-xs text-gray-300 space-y-2 h-72 overflow-y-auto bg-[#04060f] text-left">
                <p className="text-gray-500">[14:32:01 INFO]: Starting minecraft server version 1.21.1</p>
                <p className="text-gray-500">[14:32:02 INFO]: Loading properties</p>
                <p className="text-gray-500">[14:32:02 INFO]: Default game type: SURVIVAL</p>
                <p className="text-emerald-400">[14:32:03 INFO]: [Essentials] Enabling Essentials v2.20.1</p>
                <p className="text-emerald-400">[14:32:03 INFO]: [WorldEdit] Enabling WorldEdit v7.3.0</p>
                <p className="text-blue-400">[14:32:04 INFO]: Preparing level "world"</p>
                <p className="text-gray-400">[14:32:05 INFO]: Preparing start region for dimension minecraft:overworld</p>
                <p className="text-gray-500">[14:32:06 INFO]: Preparing spawn area: 85%</p>
                <p className="text-emerald-400">[14:32:07 INFO]: Done (4.82s)! For help, type "help"</p>
                <p className="text-emerald-400">[14:32:08 INFO]: Server play.nivlehost.me:25565 successfully bound to port 25565</p>
                <p className="text-white font-bold">&gt; say Welcome to Nivle Host!</p>
                <p className="text-emerald-400">[14:32:10 Broadcast] [Server]: Welcome to Nivle Host!</p>
              </div>
              <div className="p-4 bg-[#080d19] border-t border-white/5 flex gap-4 items-center justify-between">
                <div className="flex gap-4">
                  <div className="text-left">
                    <p className="text-[10px] text-gray-500 uppercase font-semibold">CPU Usage</p>
                    <p className="text-sm font-bold text-emerald-400 font-mono">14.8%</p>
                  </div>
                  <div className="text-left border-l border-white/5 pl-4">
                    <p className="text-[10px] text-gray-500 uppercase font-semibold">RAM Usage</p>
                    <p className="text-sm font-bold text-white font-mono">3.12 GB / 4.00 GB</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveView("dashboard")}
                  className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all"
                >
                  Open Live Console
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Network / Latency Section */}
      <section id="network" className="py-20 bg-[#070a14] border-t border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Global Edge Network</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 tracking-tight">
                Extreme low ping. <br />Anycast routing.
              </h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Nivle Host operates inside top-tier enterprise datacenters with direct fiber optical links to major internet exchanges. Test the real-time latency from your actual browser to our nodes below!
              </p>

              <button 
                onClick={testAllPings}
                disabled={isTestingPing}
                className="px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-800 text-black font-bold transition-all duration-200 flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <Activity className={`w-5 h-5 ${isTestingPing ? "animate-spin" : ""}`} />
                {isTestingPing ? "Testing Latency..." : "Test Real-Time Latency"}
              </button>
            </div>

            {/* Latency Test Results Panel */}
            <div className="bg-[#0b0e1d] border border-white/5 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-400" /> Latency Telemetry
              </h3>
              
              <div className="space-y-4">
                {REGIONS.map((region) => {
                  const pingVal = pings[region.code];
                  return (
                    <div key={region.code} className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.01] border border-white/5">
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <div>
                          <p className="text-sm font-semibold text-white">{region.name}</p>
                          <p className="text-[10px] text-gray-500">Node ID: {region.code}.nivlehost.net</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {pingVal === "testing" ? (
                          <span className="text-xs font-mono text-emerald-400 animate-pulse">pinging...</span>
                        ) : pingVal !== null ? (
                          <span className={`text-sm font-mono font-bold ${
                            pingVal < 20 ? "text-emerald-400" : pingVal < 45 ? "text-teal-400" : "text-emerald-300"
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

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#05070f] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center">
              <Server className="w-4 h-4 text-black font-bold" />
            </div>
            <span className="text-md font-bold tracking-tight text-white">
              NivleHost
            </span>
          </div>
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Nivle Host Technologies Inc. Built inside Sycord platform.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Flame icon helper for Rust game card
function FlameIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}
