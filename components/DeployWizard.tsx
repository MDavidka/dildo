"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Layers, Github, ArrowLeft, ArrowRight, Play, Server, Database, 
  Terminal, Shield, CheckCircle2, ChevronRight, Cpu, Loader2, Sparkles 
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import confetti from "canvas-confetti";

const MOCK_REPOS = [
  { name: "nextjs-ai-chatbot", desc: "Premium LLM interface with Streaming responses and Vercel AI SDK.", stars: 142 },
  { name: "fastapi-microservice", desc: "High-performance Python backend with PostgreSQL and Auto-docs.", stars: 89 },
  { name: "svelte-portfolio", desc: "Ultra-lightweight portfolio template with Tailwind and Framer Motion.", stars: 54 },
  { name: "react-ecom-store", desc: "Full-featured eCommerce store with Cart, Checkout, and Stripe.", stars: 215 }
];

export default function DeployWizard() {
  const { startSimulatedBuild, isBuilding, logs, currentBuildProject, setActiveView } = useAppStore();
  
  const [step, setStep] = useState<"select" | "configure" | "building">("select");
  const [selectedRepo, setSelectedRepo] = useState<typeof MOCK_REPOS[0] | null>(null);
  const [projectName, setProjectName] = useState("");
  const [branch, setBranch] = useState("main");
  const [buildCommand, setBuildCommand] = useState("npm run build");
  const [outputDir, setOutputDir] = useState(".next");
  const [dbType, setDbType] = useState<"PostgreSQL" | "Redis" | "MongoDB" | "None">("None");

  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of terminal whenever logs update
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  // Handle repository selection
  const handleSelectRepo = (repo: typeof MOCK_REPOS[0]) => {
    setSelectedRepo(repo);
    setProjectName(repo.name);
    setStep("configure");
  };

  // Handle deploying/building
  const handleDeploy = () => {
    if (!projectName.trim() || !selectedRepo) return;
    
    setStep("building");
    startSimulatedBuild(
      projectName.trim().toLowerCase().replace(/\s+/g, "-"),
      `github.com/user/${selectedRepo.name}`,
      branch,
      dbType
    );
  };

  // Confetti trigger when build succeeds (controlled by store state changes)
  useEffect(() => {
    if (step === "building" && !isBuilding && logs.some(log => log.includes("Successful"))) {
      try {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"]
        });
      } catch (err) {
        console.log("Confetti trigger failed", err);
      }
    }
  }, [isBuilding, step, logs]);

  return (
    <div className="flex-grow bg-[#030712] min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Grid */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto">
        {/* Back Button / Breadcrumb */}
        {step !== "building" && (
          <button 
            onClick={() => {
              if (step === "configure") {
                setStep("select");
              } else {
                setActiveView("dashboard");
              }
            }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> 
            {step === "configure" ? "Back to Repository Selection" : "Back to Console Dashboard"}
          </button>
        )}

        {/* Wizard Progress Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">AetherHost Import Pipeline</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {step === "select" && "Deploy a New Project"}
            {step === "configure" && "Configure Build Settings"}
            {step === "building" && "Building Your Application"}
          </h1>
          <p className="text-gray-400 mt-2">
            {step === "select" && "Select an optimized repository template or connect your custom git account."}
            {step === "configure" && "Fine-tune your build commands, environment variables, and databases."}
            {step === "building" && `Assembling and routing ${currentBuildProject || "your app"} to edge nodes.`}
          </p>
        </div>

        {/* STEP 1: Select Repository */}
        {step === "select" && (
          <div className="space-y-6">
            {/* GitHub Import Card */}
            <div className="p-8 rounded-2xl border border-border bg-card/60 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                  <Github className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Connect Custom GitHub Account</h3>
                  <p className="text-sm text-gray-400">Import your custom private or public repositories with full write permissions.</p>
                </div>
              </div>
              <button 
                onClick={() => handleSelectRepo(MOCK_REPOS[0])}
                className="w-full md:w-auto px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                <Github className="w-5 h-5" /> Connect GitHub
              </button>
            </div>

            <div className="relative flex items-center justify-center py-4">
              <span className="absolute inset-x-0 h-px bg-border" />
              <span className="relative bg-[#030712] px-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Or Deploy a Premium Template</span>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MOCK_REPOS.map((repo) => (
                <div 
                  key={repo.name}
                  onClick={() => handleSelectRepo(repo)}
                  className="p-6 rounded-xl border border-border bg-card/30 hover:border-blue-500/30 hover:bg-card/50 cursor-pointer transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                          <Layers className="w-4.5 h-4.5" />
                        </div>
                        <span className="font-bold text-white group-hover:text-blue-400 transition-colors">{repo.name}</span>
                      </div>
                      <span className="text-xs font-mono text-gray-500">★ {repo.stars}</span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed mb-6">{repo.desc}</p>
                  </div>

                  <span className="text-xs font-semibold text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Deploy Template <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Configure Project */}
        {step === "configure" && selectedRepo && (
          <div className="bg-card border border-border rounded-2xl p-8 shadow-xl space-y-6">
            <div className="flex items-center gap-3 pb-6 border-b border-border">
              <Github className="w-6 h-6 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 font-semibold">Selected Repository</p>
                <p className="text-sm font-bold text-white font-mono">github.com/user/{selectedRepo.name}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Project Name */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Project Name</label>
                <input 
                  type="text" 
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="my-aether-app"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-blue-500 text-white font-medium outline-none transition-colors"
                />
              </div>

              {/* Branch Selector */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Production Branch</label>
                <select 
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-white font-medium outline-none focus:border-blue-500"
                >
                  <option value="main">main</option>
                  <option value="production">production</option>
                  <option value="master">master</option>
                </select>
              </div>

              {/* Build Command */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Build Command</label>
                <input 
                  type="text" 
                  value={buildCommand}
                  onChange={(e) => setBuildCommand(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-blue-500 text-white font-mono outline-none transition-colors"
                />
              </div>

              {/* Output Directory */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Output Directory</label>
                <input 
                  type="text" 
                  value={outputDir}
                  onChange={(e) => setOutputDir(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-blue-500 text-white font-mono outline-none transition-colors"
                />
              </div>
            </div>

            {/* Database Auto-Provision */}
            <div className="pt-6 border-t border-border">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-purple-400" /> Auto-Provision Managed Database
              </h4>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                Need a database? We can automatically spin up a dedicated instance on our free tier and inject the credentials directly into your app's environment variables.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {([
                  { id: "None", label: "No Database" },
                  { id: "PostgreSQL", label: "PostgreSQL" },
                  { id: "Redis", label: "Redis Cache" },
                  { id: "MongoDB", label: "MongoDB" }
                ] as const).map((db) => (
                  <button
                    key={db.id}
                    onClick={() => setDbType(db.id)}
                    className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                      dbType === db.id 
                        ? "bg-purple-600/15 border-purple-500/50 text-purple-300" 
                        : "bg-transparent border-border text-gray-400 hover:bg-secondary/20 hover:text-white"
                    }`}
                  >
                    {db.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Trigger Button */}
            <div className="pt-6 border-t border-border flex justify-end">
              <button
                onClick={handleDeploy}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-semibold transition-all duration-300 shadow-xl shadow-blue-500/20 flex items-center gap-2 group"
              >
                Launch Production Build <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Live Build Pipeline */}
        {step === "building" && (
          <div className="space-y-6">
            {/* Build Status Card */}
            <div className="bg-card border border-border rounded-2xl p-8 shadow-xl flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Compiling & Optimizing Assets</h3>
                  <p className="text-sm text-gray-400">Your server is being packaged inside a lightweight edge container.</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Pipeline Status</p>
                <p className="text-sm font-bold text-blue-400 animate-pulse">Running</p>
              </div>
            </div>

            {/* Live Terminal */}
            <div className="rounded-xl border border-border bg-[#040813] shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-[#080d19] border-b border-border">
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-mono text-gray-400">aetherhost-build-telemetry.log</span>
                </div>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  streaming
                </span>
              </div>

              <div className="p-6 text-left font-mono text-xs sm:text-sm text-gray-300 space-y-2 h-96 overflow-y-auto">
                {logs.map((log, idx) => (
                  <p 
                    key={idx} 
                    className={`${
                      log.includes("Initiated") || log.includes("Successful") ? "text-emerald-400 font-bold" :
                      log.includes("Compiling") || log.includes("Running") ? "text-blue-400" :
                      log.includes("Detected") || log.includes("cloned") ? "text-teal-300" : "text-gray-300"
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
