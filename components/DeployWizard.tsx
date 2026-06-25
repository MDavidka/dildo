"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Layers, ArrowLeft, ArrowRight, Play, Server, Database, 
  Terminal, Shield, CheckCircle2, ChevronRight, Cpu, Loader2, Sparkles,
  Gamepad2, Globe, Sliders
} from "lucide-react";
import { useAppStore, GameServer } from "@/lib/store";
import confetti from "canvas-confetti";

const GAMES_CATALOG = [
  { 
    id: "Minecraft" as const, 
    name: "Minecraft Hosting", 
    desc: "Deploy Paper, Purpur, Spigot, Forge, Fabric or Vanilla. Full mod and plugin support.",
    icon: Gamepad2, 
    defaultVersion: "Paper 1.21.1",
    versions: ["Paper 1.21.1", "Purpur 1.21.1", "Forge 1.20.1", "Fabric 1.20.1", "Vanilla 1.21.1"],
    minRam: 2,
    basePort: "25565"
  },
  { 
    id: "Palworld" as const, 
    name: "Palworld Hosting", 
    desc: "Create a private Palworld dedicated server with active slot management and automated backups.",
    icon: Sparkles, 
    defaultVersion: "Steam v0.3.2",
    versions: ["Steam v0.3.2", "Steam v0.2.4"],
    minRam: 8,
    basePort: "8211"
  },
  { 
    id: "Rust" as const, 
    name: "Rust Hosting", 
    desc: "High-performance Oxide/uMod survival servers with specialized L7 DDoS shielding.",
    icon: FlameIcon, 
    defaultVersion: "Oxide v2.0.56",
    versions: ["Oxide v2.0.56", "Vanilla Release"],
    minRam: 12,
    basePort: "28015"
  },
  { 
    id: "Valheim" as const, 
    name: "Valheim Hosting", 
    desc: "Conquer the Norse wilderness with custom Valheim Plus mods and automated survival backups.",
    icon: Shield, 
    defaultVersion: "Valheim Plus v0.218",
    versions: ["Valheim Plus v0.218", "Vanilla Stable"],
    minRam: 4,
    basePort: "2456"
  }
];

const LOCATIONS = [
  { name: "US East (Ashburn)", code: "Ashburn, USA" },
  { name: "EU West (Frankfurt)", code: "Frankfurt, DE" },
  { name: "Asia Pacific (Singapore)", code: "Singapore, SG" },
  { name: "Australia (Sydney)", code: "Sydney, AU" }
];

const PLANS = [
  { name: "Dirt Plan", ram: 2, price: "$4.00/mo", desc: "Perfect for 1-5 players, light vanilla." },
  { name: "Iron Plan", ram: 4, price: "$8.00/mo", desc: "Ideal for 5-15 players, semi-vanilla with plugins." },
  { name: "Gold Plan", ram: 8, price: "$16.00/mo", desc: "Great for 15-30 players, modded worlds or medium SMPs." },
  { name: "Diamond Plan", ram: 12, price: "$24.00/mo", desc: "Heavy modpacks (100+ mods) and larger communities." },
  { name: "Netherite Plan", ram: 16, price: "$32.00/mo", desc: "Ultimate performance for networks, massive modpacks." }
];

export default function DeployWizard() {
  const { startSimulatedProvision, isProvisioning, logs, currentProvisioningServer, setActiveView } = useAppStore();
  
  const [step, setStep] = useState<"select" | "configure" | "building">("select");
  const [selectedGame, setSelectedGame] = useState<typeof GAMES_CATALOG[0]>(GAMES_CATALOG[0]);
  const [serverName, setServerName] = useState("");
  const [location, setLocation] = useState("Frankfurt, DE");
  const [version, setVersion] = useState("Paper 1.21.1");
  const [ramGb, setRamGb] = useState(4);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of terminal when logs update
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  // Adjust defaults when game changes
  const handleSelectGame = (game: typeof GAMES_CATALOG[0]) => {
    setSelectedGame(game);
    setServerName(`My Nivle ${game.id} Server`);
    setVersion(game.defaultVersion);
    // Select a RAM plan that fits minRam
    const fittingPlan = PLANS.find(p => p.ram >= game.minRam) || PLANS[PLANS.length - 1];
    setRamGb(fittingPlan.ram);
    setStep("configure");
  };

  // Trigger simulated provision
  const handleDeploy = () => {
    if (!serverName.trim()) return;
    setStep("building");
    startSimulatedProvision(
      serverName,
      selectedGame.id,
      location,
      version,
      ramGb
    );
  };

  // Confetti trigger upon success
  useEffect(() => {
    if (step === "building" && !isProvisioning && logs.some(log => log.includes("successfully started") || log.includes("Done"))) {
      try {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6"]
        });
      } catch (err) {
        console.log("Confetti trigger failed", err);
      }
    }
  }, [isProvisioning, step, logs]);

  return (
    <div className="flex-grow bg-[#05070f] min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative text-gray-200">
      {/* Background Grid */}
      <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none" />
      <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        {step !== "building" && (
          <button 
            onClick={() => {
              if (step === "configure") {
                setStep("select");
              } else {
                setActiveView("dashboard");
              }
            }}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-emerald-400 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> 
            {step === "configure" ? "Back to Game Selection" : "Back to Control Panel"}
          </button>
        )}

        {/* Wizard Progress Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Nivle Host Provisioner</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {step === "select" && "Deploy a Game Server"}
            {step === "configure" && "Configure Game Settings"}
            {step === "building" && "Provisioning Your Server"}
          </h1>
          <p className="text-sm text-gray-400 mt-2 max-w-xl mx-auto">
            {step === "select" && "Select from our list of optimized game server engines to launch your private instance instantly."}
            {step === "configure" && "Fine-tune your server properties, choose your location, and select your RAM plan."}
            {step === "building" && `Assembling game assets and booting isolated Docker container for ${currentProvisioningServer || "your server"}.`}
          </p>
        </div>

        {/* STEP 1: Select Game */}
        {step === "select" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {GAMES_CATALOG.map((game) => (
              <div 
                key={game.id}
                onClick={() => handleSelectGame(game)}
                className="p-6 rounded-xl border border-white/5 bg-[#0a0d1a]/40 hover:border-emerald-500/30 hover:bg-[#0a0d1a]/60 cursor-pointer transition-all duration-300 group flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                        <game.icon className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-white group-hover:text-emerald-400 transition-colors">{game.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-gray-500">Min: {game.minRam}GB RAM</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed mb-6">{game.desc}</p>
                </div>

                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Deploy Server <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            ))}
          </div>
        )}

        {/* STEP 2: Configure Server */}
        {step === "configure" && (
          <div className="bg-[#0a0d1a]/40 border border-white/5 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center gap-3 pb-6 border-b border-white/5">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <selectedGame.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Deploy Target</p>
                <p className="text-sm font-bold text-white font-mono">{selectedGame.name} • {selectedGame.defaultVersion}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Server Name */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Server Display Name</label>
                <input 
                  type="text" 
                  value={serverName}
                  onChange={(e) => setServerName(e.target.value)}
                  placeholder="My Survival World"
                  className="w-full px-4 py-3 rounded-xl bg-[#03050a] border border-white/5 focus:border-emerald-500 text-white font-medium text-sm outline-none transition-colors"
                />
              </div>

              {/* Node Location */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Server Location Node</label>
                <select 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#03050a] border border-white/5 text-white font-medium text-sm outline-none focus:border-emerald-500 cursor-pointer"
                >
                  {LOCATIONS.map((loc) => (
                    <option key={loc.code} value={loc.code}>{loc.name}</option>
                  ))}
                </select>
              </div>

              {/* Game Version / Jar */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Game Server Version</label>
                <select 
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#03050a] border border-white/5 text-white font-medium text-sm outline-none focus:border-emerald-500 cursor-pointer"
                >
                  {selectedGame.versions.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              {/* Allocation Port display */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Network Binding Port</label>
                <div className="w-full px-4 py-3 rounded-xl bg-[#03050a] border border-white/5 text-gray-500 font-mono text-sm">
                  {selectedGame.basePort} (Dedicated Game Port)
                </div>
              </div>
            </div>

            {/* RAM Plan Selection */}
            <div className="pt-6 border-t border-white/5">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-emerald-400" /> Select RAM Plan Allocation
              </h4>
              <p className="text-xs text-gray-500 mb-4">
                Select a plan that allocates enough physical memory to prevent server stuttering and tick drops. Minimum requirement for {selectedGame.id} is {selectedGame.minRam} GB.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {PLANS.map((plan) => {
                  const isSufficient = plan.ram >= selectedGame.minRam;
                  return (
                    <button
                      key={plan.name}
                      type="button"
                      disabled={!isSufficient}
                      onClick={() => setRamGb(plan.ram)}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        !isSufficient 
                          ? "opacity-35 bg-transparent border-white/5 text-gray-600 cursor-not-allowed" 
                          : ramGb === plan.ram 
                            ? "bg-emerald-500/10 border-emerald-500/50 text-white" 
                            : "bg-transparent border-white/5 text-gray-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <div className="text-left">
                        <p className="text-[10px] font-bold uppercase tracking-wider">{plan.name}</p>
                        <p className="text-sm font-extrabold font-mono mt-0.5">{plan.ram} GB</p>
                      </div>
                      <p className="text-[11px] font-bold text-emerald-400 mt-2">{plan.price}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Launch Button */}
            <div className="pt-6 border-t border-white/5 flex justify-end">
              <button
                onClick={handleDeploy}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold transition-all duration-300 shadow-xl shadow-emerald-500/20 flex items-center gap-2 group"
              >
                Provision Server <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Live Provisioning Terminal */}
        {step === "building" && (
          <div className="space-y-6">
            {/* Provisioning Status Card */}
            <div className="bg-[#0a0d1a]/40 border border-white/5 rounded-2xl p-6 shadow-xl flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Assembling Game Container</h3>
                  <p className="text-xs text-gray-400">Your isolated game container is booting and generating files on NVMe storage.</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase font-semibold">Status</p>
                <p className="text-xs font-bold text-emerald-400 animate-pulse font-mono">PROVISIONING</p>
              </div>
            </div>

            {/* Live Terminal */}
            <div className="rounded-xl border border-white/5 bg-[#03050a] shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-[#080d19] border-b border-white/5">
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono text-gray-400">nivlehost-deploy.log</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  live feed
                </span>
              </div>

              <div className="p-6 text-left font-mono text-xs sm:text-sm text-gray-300 space-y-2 h-96 overflow-y-auto">
                {logs.map((log, idx) => (
                  <p 
                    key={idx} 
                    className={`${
                      log.includes("Successful") || log.includes("Done") || log.includes("successfully") ? "text-emerald-400 font-bold" :
                      log.includes("Booting") || log.includes("Starting") ? "text-blue-400" :
                      log.includes("Allocating") || log.includes("Allocated") ? "text-teal-300" : "text-gray-300"
                    }`}
                  >
                    {log}
                  </p>
                ))}
                <div ref={terminalEndRef} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Flame icon helper for Rust game selection
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
