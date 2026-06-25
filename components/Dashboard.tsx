"use client";

import React, { useState, useEffect } from "react";
import { 
  Server, Cpu, Shield, Zap, Globe, Database, ArrowRight, Play, Pause, 
  RefreshCw, Terminal, Activity, Layers, Plus, Trash2, ExternalLink, 
  CheckCircle2, AlertCircle, HardDrive, Wifi, Settings, HelpCircle, Code 
} from "lucide-react";
import { useAppStore, Project, Deployment } from "@/lib/store";
import { formatBytes, formatNumber } from "@/lib/utils";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Generate mock telemetry data for charts
const generateTelemetryData = () => {
  const data = [];
  const now = new Date();
  for (let i = 12; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 5000);
    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      cpu: Math.floor(Math.random() * 25) + 5,
      ram: Math.floor(Math.random() * 15) + 65,
      bandwidth: Math.floor(Math.random() * 40) + 120
    });
  }
  return data;
};

export default function Dashboard() {
  const { 
    projects, 
    deployments, 
    activeProjectId, 
    setActiveProject, 
    setActiveView, 
    updateProjectStatus, 
    updateProjectMetrics,
    provisionDatabase
  } = useAppStore();

  const [telemetry, setTelemetry] = useState(generateTelemetryData());
  const [activeTab, setActiveTab] = useState<"overview" | "databases" | "deployments" | "logs">("overview");
  const [dbTypeToProvision, setDbTypeToProvision] = useState<"PostgreSQL" | "Redis" | "MongoDB">("PostgreSQL");
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Active project helper
  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Simulate live resource metrics changes
  useEffect(() => {
    if (!activeProject || activeProject.status !== "Active") return;

    const interval = setInterval(() => {
      // Generate new metrics
      const newCpu = Math.floor(Math.random() * 18) + (activeProject.name.includes("ai") ? 35 : 4);
      const newRam = Math.floor(activeProject.maxRam * (0.25 + Math.random() * 0.15));
      const bandwidthDelta = Math.random() * 0.4;
      
      updateProjectMetrics(activeProject.id, newCpu, newRam, bandwidthDelta);

      // Update charts
      setTelemetry((prev) => {
        const next = [...prev.slice(1)];
        const now = new Date();
        next.push({
          time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          cpu: newCpu,
          ram: Math.round((newRam / activeProject.maxRam) * 100),
          bandwidth: Math.round(bandwidthDelta * 100)
        });
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [activeProjectId, activeProject?.status]);

  // Handle db provisioning simulation
  const handleProvisionDb = () => {
    if (!activeProject) return;
    setIsProvisioning(true);
    setTimeout(() => {
      provisionDatabase(activeProject.id, dbTypeToProvision);
      setIsProvisioning(false);
    }, 1500);
  };

  // Toggle project active/paused state
  const toggleProjectState = () => {
    if (!activeProject) return;
    const nextStatus = activeProject.status === "Active" ? "Paused" : "Active";
    updateProjectStatus(activeProject.id, nextStatus);
  };

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "Active": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Deploying": return "bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse";
      case "Paused": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "Failed": return "bg-red-500/10 text-red-400 border-red-500/20";
    }
  };

  // Filter deployments for active project
  const projectDeployments = deployments.filter(d => d.projectId === activeProject?.id);

  return (
    <div className="flex-grow flex flex-col md:flex-row bg-[#030712] min-h-screen text-gray-200">
      {/* Left Sidebar */}
      <aside className="w-full md:w-64 bg-card/40 border-r border-border p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveView("landing")}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">AetherConsole</span>
          </div>

          {/* Project Selector */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Projects</label>
            <div className="space-y-1">
              {projects.map((proj) => (
                <button
                  key={proj.id}
                  onClick={() => {
                    setActiveProject(proj.id);
                    setActiveTab("overview");
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl border text-sm font-medium flex items-center justify-between transition-all duration-200 ${
                    activeProjectId === proj.id 
                      ? "bg-blue-600/15 border-blue-500/40 text-white" 
                      : "bg-transparent border-transparent text-gray-400 hover:bg-secondary/40 hover:text-white"
                  }`}
                >
                  <span className="truncate max-w-[120px]">{proj.name}</span>
                  <span className={`w-2 h-2 rounded-full ${
                    proj.status === "Active" ? "bg-emerald-500" : proj.status === "Paused" ? "bg-yellow-500" : "bg-blue-500 animate-pulse"
                  }`} />
                </button>
              ))}
            </div>

            <button 
              onClick={() => setActiveView("deploy-wizard")}
              className="w-full mt-4 py-2.5 rounded-xl border border-dashed border-border hover:border-blue-500/50 bg-secondary/20 hover:bg-secondary/40 text-sm font-semibold text-gray-300 hover:text-white transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> New Deployment
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Navigation</label>
            <button 
              onClick={() => setActiveView("landing")}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-secondary/30 transition-colors flex items-center gap-2"
            >
              <Globe className="w-4 h-4" /> Landing Homepage
            </button>
            <button 
              onClick={() => setActiveView("pricing")}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-secondary/30 transition-colors flex items-center gap-2"
            >
              <Settings className="w-4 h-4" /> Pricing Estimator
            </button>
          </nav>
        </div>

        {/* User profile info */}
        <div className="pt-6 border-t border-border flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
            JD
          </div>
          <div>
            <p className="text-sm font-semibold text-white">John Doe</p>
            <p className="text-xs text-gray-500">Developer Account</p>
          </div>
        </div>
      </aside>

      {/* Main Console Area */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full space-y-8">
        {activeProject ? (
          <>
            {/* Project Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{activeProject.name}</h1>
                  <span className={`px-2.5 py-0.5 rounded-full border text-xs font-semibold ${getStatusColor(activeProject.status)}`}>
                    {activeProject.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400 font-medium">
                  <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> {activeProject.region}</span>
                  <span className="text-gray-600">•</span>
                  <span className="flex items-center gap-1 font-mono">{activeProject.ip}</span>
                  <span className="text-gray-600">•</span>
                  <span className="flex items-center gap-1"><Code className="w-4 h-4" /> {activeProject.branch}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleProjectState}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-all duration-200 flex items-center gap-1.5 ${
                    activeProject.status === "Active" 
                      ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20" 
                      : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                  }`}
                >
                  {activeProject.status === "Active" ? (
                    <><Pause className="w-4 h-4" /> Pause Instance</>
                  ) : (
                    <><Play className="w-4 h-4" /> Resume Instance</>
                  )}
                </button>

                <a
                  href={activeProject.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all duration-200 flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
                >
                  Visit App <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-card/40 border border-border p-5 rounded-xl">
                <div className="flex items-center justify-between text-gray-400 mb-2">
                  <span className="text-sm font-medium">CPU Usage</span>
                  <Cpu className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-2xl font-bold text-white font-mono">{activeProject.cpu}%</p>
                <div className="w-full bg-secondary h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full transition-all duration-1000" style={{ width: `${activeProject.cpu}%` }} />
                </div>
              </div>

              <div className="bg-card/40 border border-border p-5 rounded-xl">
                <div className="flex items-center justify-between text-gray-400 mb-2">
                  <span className="text-sm font-medium">Memory Allocation</span>
                  <HardDrive className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-2xl font-bold text-white font-mono">
                  {activeProject.ram} <span className="text-xs font-normal text-gray-500">/ {activeProject.maxRam} MB</span>
                </p>
                <div className="w-full bg-secondary h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000" style={{ width: `${(activeProject.ram / activeProject.maxRam) * 100}%` }} />
                </div>
              </div>

              <div className="bg-card/40 border border-border p-5 rounded-xl">
                <div className="flex items-center justify-between text-gray-400 mb-2">
                  <span className="text-sm font-medium">Storage Used</span>
                  <Database className="w-5 h-5 text-purple-400" />
                </div>
                <p className="text-2xl font-bold text-white font-mono">
                  {activeProject.storage} <span className="text-xs font-normal text-gray-500">/ {activeProject.maxStorage} GB</span>
                </p>
                <div className="w-full bg-secondary h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full transition-all duration-1000" style={{ width: `${(activeProject.storage / activeProject.maxStorage) * 100}%` }} />
                </div>
              </div>

              <div className="bg-card/40 border border-border p-5 rounded-xl">
                <div className="flex items-center justify-between text-gray-400 mb-2">
                  <span className="text-sm font-medium">Edge Bandwidth</span>
                  <Wifi className="w-5 h-5 text-pink-400" />
                </div>
                <p className="text-2xl font-bold text-white font-mono">
                  {activeProject.bandwidth.toFixed(2)} <span className="text-xs font-normal text-gray-500">/ {activeProject.maxBandwidth} GB</span>
                </p>
                <div className="w-full bg-secondary h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-pink-500 h-full rounded-full transition-all duration-1000" style={{ width: `${(activeProject.bandwidth / activeProject.maxBandwidth) * 100}%` }} />
                </div>
              </div>
            </div>

            {/* Inner Project Tabs */}
            <div className="border-b border-border">
              <nav className="flex gap-6">
                {(["overview", "databases", "deployments", "logs"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-sm font-semibold border-b-2 capitalize transition-all ${
                      activeTab === tab 
                        ? "border-blue-500 text-white" 
                        : "border-transparent text-gray-400 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Contents */}
            <div className="min-h-[350px]">
              {activeTab === "overview" && (
                <div className="space-y-8">
                  {/* Telemetry Charts */}
                  <div className="bg-card border border-border rounded-xl p-6 shadow-xl">
                    <h3 className="text-base font-bold text-white mb-6 flex items-center gap-1.5">
                      <Activity className="w-5 h-5 text-blue-400" /> Real-Time Telemetry Analytics
                    </h3>
                    
                    {mounted ? (
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={telemetry} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="time" stroke="#4b5563" fontSize={10} tickLine={false} />
                            <YAxis stroke="#4b5563" fontSize={10} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#0b0f19', borderColor: '#1f2937', color: '#f3f4f6' }} />
                            <Area type="monotone" dataKey="cpu" name="CPU Usage (%)" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" />
                            <Area type="monotone" dataKey="ram" name="Memory Usage (%)" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRam)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-64 flex items-center justify-center text-gray-500">Loading metrics...</div>
                    )}
                  </div>

                  {/* Active Deployment Details */}
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="text-base font-bold text-white mb-4">Latest Active Deployment</h3>
                    {projectDeployments.length > 0 ? (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-background border border-border">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-white truncate max-w-[300px]">
                              {projectDeployments[0].commitMessage}
                            </p>
                            <p className="text-xs text-gray-500 font-mono">
                              commit {projectDeployments[0].commitHash} • {projectDeployments[0].createdAt}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-right">
                          <div>
                            <p className="text-xs text-gray-500">Build duration</p>
                            <p className="text-sm font-semibold text-white font-mono">{projectDeployments[0].duration}</p>
                          </div>
                          <a 
                            href={projectDeployments[0].url} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="p-2 rounded-lg bg-secondary hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                          >
                            <ExternalLink className="w-4.5 h-4.5" />
                          </a>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No deployments found for this project.</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "databases" && (
                <div className="space-y-6">
                  {activeProject.dbStatus === "Active" ? (
                    <div className="bg-card border border-border rounded-xl p-6">
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                        <div className="flex items-center gap-3">
                          <Database className="w-8 h-8 text-purple-400" />
                          <div>
                            <h3 className="text-lg font-bold text-white">Managed {activeProject.dbType} Database</h3>
                            <p className="text-xs text-emerald-400 font-medium">Instance Active & Secured</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                          Online
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                        <div className="p-4 rounded-xl bg-background border border-border">
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Host Endpoint</p>
                          <p className="text-sm font-mono text-white truncate">db.{activeProject.name}.aetherhost.net</p>
                        </div>
                        <div className="p-4 rounded-xl bg-background border border-border">
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Port</p>
                          <p className="text-sm font-mono text-white">
                            {activeProject.dbType === "PostgreSQL" ? "5432" : activeProject.dbType === "Redis" ? "6379" : "27017"}
                          </p>
                        </div>
                        <div className="p-4 rounded-xl bg-background border border-border">
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Storage Allocation</p>
                          <p className="text-sm font-mono text-white">0.45 GB / 10 GB</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20 text-yellow-400/90 text-xs flex gap-2.5">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <div>
                          <p className="font-bold mb-0.5">Database Connection Credentials</p>
                          <p className="text-gray-400">Connection strings and access passwords are encrypted. Use the environment variables tab to inject connection strings automatically into your deployments.</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-card border border-border rounded-xl p-8 text-center max-w-xl mx-auto">
                      <Database className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-white mb-2">No database provisioned</h3>
                      <p className="text-sm text-gray-400 mb-6">
                        Store and query data with a high-availability, fully managed cloud database. Provision an instance in seconds.
                      </p>

                      <div className="bg-background border border-border rounded-xl p-4 mb-6 flex items-center justify-between gap-4">
                        <div className="text-left">
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Select DB Engine</label>
                          <select 
                            value={dbTypeToProvision}
                            onChange={(e) => setDbTypeToProvision(e.target.value as any)}
                            className="bg-secondary border border-border text-white text-sm rounded-lg p-2 outline-none focus:border-blue-500"
                          >
                            <option value="PostgreSQL">PostgreSQL (Relational)</option>
                            <option value="Redis">Redis (In-Memory Cache)</option>
                            <option value="MongoDB">MongoDB (Document)</option>
                          </select>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Tier</p>
                          <p className="text-sm font-bold text-emerald-400">Free Tier (10GB)</p>
                        </div>
                      </div>

                      <button
                        onClick={handleProvisionDb}
                        disabled={isProvisioning}
                        className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        {isProvisioning ? (
                          <>Provisioning Instance...</>
                        ) : (
                          <>Provision Managed {dbTypeToProvision}</>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "deployments" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-white">Deployment History</h3>
                    <button 
                      onClick={() => setActiveView("deploy-wizard")}
                      className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      Trigger New Build <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {projectDeployments.map((dep) => (
                      <div key={dep.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-card border border-border hover:border-blue-500/20 transition-all">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-white truncate max-w-[200px] sm:max-w-md">{dep.commitMessage}</span>
                              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">Active</span>
                            </div>
                            <p className="text-xs text-gray-500 font-mono mt-1">
                              branch: {dep.branch} • hash: {dep.commitHash} • {dep.createdAt}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-right">
                          <div>
                            <p className="text-xs text-gray-500">Build time</p>
                            <p className="text-sm font-semibold text-white font-mono">{dep.duration || "12s"}</p>
                          </div>
                          <a 
                            href={dep.url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-gray-800 text-xs font-semibold text-gray-300 hover:text-white transition-colors"
                          >
                            Live App
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "logs" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                      <Terminal className="w-5 h-5 text-blue-400" /> Live Application Logs
                    </h3>
                    <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      Listening to logs...
                    </span>
                  </div>

                  <div className="bg-[#040813] border border-border rounded-xl p-5 font-mono text-xs text-gray-300 space-y-2 h-72 overflow-y-auto shadow-inner">
                    <p className="text-gray-500">[{new Date().toLocaleDateString()}] Initializing container runtime engine...</p>
                    <p className="text-gray-500">[{new Date().toLocaleDateString()}] Attaching network interface to edge gateway...</p>
                    <p className="text-blue-400">[{new Date().toLocaleDateString()}] Running: node server.js</p>
                    <p className="text-emerald-400">✓ Server successfully bound to port 3000</p>
                    <p className="text-gray-400">Listening on http://localhost:3000</p>
                    <p className="text-gray-500">[{new Date().toLocaleDateString()}] Web traffic routing rules active</p>
                    <p className="text-gray-400">INFO: GET / 200 OK - 78ms - User-Agent: AetherEdge-Scanner/1.0</p>
                    <p className="text-gray-400">INFO: GET /api/health 200 OK - 4ms</p>
                    {activeProject.dbStatus === "Active" && (
                      <p className="text-purple-400">INFO: Successfully established connection with managed {activeProject.dbType} pool.</p>
                    )}
                    <p className="text-gray-400">INFO: GET /_next/static/chunks/main.js 200 OK - 12ms</p>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <Server className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">No projects created yet</h2>
            <p className="text-gray-400 mb-6">Deploy a project from GitHub to get started.</p>
            <button 
              onClick={() => setActiveView("deploy-wizard")}
              className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
            >
              Deploy Project
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
