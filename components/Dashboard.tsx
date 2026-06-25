"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Server, Cpu, Shield, Zap, Globe, Database, ArrowRight, Play, Square, 
  RefreshCw, Terminal, Activity, Layers, Plus, Trash2, ExternalLink, 
  CheckCircle2, AlertCircle, HardDrive, Wifi, Settings, HelpCircle, Code,
  Users, Copy, Check, FileCode, Ban, ShieldAlert, Folder, File, Download
} from "lucide-react";
import { useAppStore, GameServer } from "@/lib/store";
import { formatBytes, formatNumber } from "@/lib/utils";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Generate initial mock telemetry data
const generateTelemetryData = (maxRam: number) => {
  const data = [];
  const now = new Date();
  for (let i = 12; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 5000);
    const cpuVal = Math.floor(Math.random() * 20) + 10;
    const ramPercent = Math.floor(Math.random() * 10) + 60; // around 65%
    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      cpu: cpuVal,
      ram: Math.round(maxRam * (ramPercent / 100))
    });
  }
  return data;
};

export default function Dashboard() {
  const { 
    servers, 
    logs, 
    activeServerId, 
    setActiveServer, 
    setActiveView, 
    updateServerStatus, 
    updateServerMetrics,
    installPlugin,
    uninstallPlugin,
    kickPlayer,
    runConsoleCommand,
    addLog,
    clearLogs,
    deleteServer
  } = useAppStore();

  const [telemetry, setTelemetry] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"console" | "players" | "files" | "plugins" | "settings">("console");
  const [copied, setCopied] = useState(false);
  const [consoleInput, setConsoleInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<{ name: string; content: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Active server helper
  const activeServer = servers.find(s => s.id === activeServerId) || servers[0];

  useEffect(() => {
    setMounted(true);
    if (activeServer) {
      setTelemetry(generateTelemetryData(activeServer.maxRam));
    }
  }, [activeServerId]);

  // Scroll console to bottom
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, activeTab]);

  // Simulate live resource metrics changes
  useEffect(() => {
    if (!activeServer || activeServer.status !== "Online") return;

    const interval = setInterval(() => {
      // Generate new metrics
      const baseCpu = activeServer.game === "Minecraft" ? 15 : activeServer.game === "Rust" ? 55 : 30;
      const newCpu = Math.min(activeServer.maxCpu, Math.floor(Math.random() * 15) + baseCpu + (activeServer.players * 2));
      const ramUsagePercent = 0.5 + (activeServer.players * 0.02) + (Math.random() * 0.05);
      const newRam = Math.min(activeServer.maxRam, Math.round(activeServer.maxRam * ramUsagePercent));
      
      updateServerMetrics(activeServer.id, newCpu, newRam, activeServer.players);

      // Update charts
      setTelemetry((prev) => {
        if (prev.length === 0) return prev;
        const next = [...prev.slice(1)];
        const now = new Date();
        next.push({
          time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          cpu: newCpu,
          ram: newRam
        });
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [activeServerId, activeServer?.status, activeServer?.players]);

  // Seed initial logs when active server changes or starts
  useEffect(() => {
    if (!activeServer) return;
    clearLogs();
    
    if (activeServer.status === "Online") {
      addLog(`[System] Initializing Docker game container for ${activeServer.name}...`);
      addLog(`[System] Mounting NVMe SSD volume...`);
      addLog(`[System] Server bound to public network interface: ${activeServer.ip}`);
      addLog(`[${activeServer.game} Server] Starting server engine version ${activeServer.version}...`);
      
      if (activeServer.game === "Minecraft") {
        addLog(`[Minecraft Server] Loading world dimensions...`);
        addLog(`[Minecraft Server] Enabled plugins: ${activeServer.plugins.join(", ")}`);
        addLog(`[Minecraft Server] Preparing spawn area: 100%`);
        addLog(`[Minecraft Server] Done! For help, type "help"`);
      } else {
        addLog(`[${activeServer.game} Server] Loading save game files...`);
        addLog(`[${activeServer.game} Server] Ready for connections!`);
      }
    } else {
      addLog(`[System] Server is currently OFFLINE. Click "START" to boot the container.`);
    }
  }, [activeServerId]);

  const handleCopyIp = () => {
    if (!activeServer) return;
    navigator.clipboard.writeText(activeServer.ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePowerAction = (action: "start" | "stop" | "restart") => {
    if (!activeServer) return;

    if (action === "stop") {
      addLog(`[System] Sending SIGINT shutdown signal to game process...`);
      updateServerStatus(activeServer.id, "Offline");
      addLog(`[System] Container successfully stopped. Resources freed.`);
    } else if (action === "start") {
      addLog(`[System] Allocating Node resources...`);
      updateServerStatus(activeServer.id, "Starting");
      addLog(`[System] Booting Docker container...`);
      
      setTimeout(() => {
        updateServerStatus(activeServer.id, "Online");
        addLog(`[${activeServer.game} Server] Server successfully started on port ${activeServer.ip.split(":")[1]}`);
        if (activeServer.game === "Minecraft") {
          addLog(`[Minecraft Server] Preparing spawn area: 100%`);
          addLog(`[Minecraft Server] Done! For help, type "help"`);
        }
      }, 3000);
    } else if (action === "restart") {
      addLog(`[System] Stopping current container...`);
      updateServerStatus(activeServer.id, "Restarting");
      
      setTimeout(() => {
        addLog(`[System] Booting clean game server container...`);
        updateServerStatus(activeServer.id, "Online");
        addLog(`[${activeServer.game} Server] Server successfully restarted!`);
      }, 3000);
    }
  };

  const handleConsoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consoleInput.trim() || !activeServer) return;
    
    if (activeServer.status !== "Online") {
      addLog(`> ${consoleInput}`);
      addLog(`[System] Error: Cannot execute commands while server is offline.`);
      setConsoleInput("");
      return;
    }

    runConsoleCommand(activeServer.id, consoleInput);
    setConsoleInput("");
  };

  const handleInstallPlugin = (plugin: string) => {
    if (!activeServer) return;
    installPlugin(activeServer.id, plugin);
    addLog(`[System] Downloading plugin: ${plugin}.jar...`);
    addLog(`[System] Successfully installed ${plugin}.jar into /plugins folder.`);
    addLog(`[Minecraft Server] [${plugin}] Loaded successfully. Run /reload to apply.`);
  };

  const handleUninstallPlugin = (plugin: string) => {
    if (!activeServer) return;
    uninstallPlugin(activeServer.id, plugin);
    addLog(`[System] Deleted plugin: ${plugin}.jar from /plugins folder.`);
    addLog(`[Minecraft Server] [${plugin}] Unloaded.`);
  };

  const handleKickPlayer = (player: string) => {
    if (!activeServer) return;
    kickPlayer(activeServer.id, player);
    addLog(`[Console] Kicked player '${player}' from the server.`);
  };

  const handleDeleteServer = () => {
    if (!activeServer) return;
    if (confirm(`Are you sure you want to delete '${activeServer.name}'? All world data and files will be permanently erased.`)) {
      deleteServer(activeServer.id);
    }
  };

  const getStatusColor = (status: GameServer["status"]) => {
    switch (status) {
      case "Online": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Starting": return "bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse";
      case "Restarting": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "Offline": return "bg-red-500/10 text-red-400 border-red-500/20";
    }
  };

  // Mock File Content Viewer
  const handleOpenFile = (fileName: string) => {
    let content = "";
    if (fileName === "server.properties") {
      content = `# Minecraft server properties\n# Generated by NivleHost\n\ngenerator-settings=\nforce-gamemode=false\nallow-nether=true\nenforce-whitelist=false\ngamemode=survival\nenable-query=false\nplayer-idle-timeout=0\ndifficulty=easy\nspawn-monsters=true\nop-permission-level=4\npvp=true\nsnooper-enabled=true\nlevel-name=world\nmax-players=20\nnetwork-compression-threshold=256\nresource-pack-sha1=\nmax-world-size=29999984\nserver-port=25565\nserver-ip=\nspawn-npcs=true\nallow-flight=false\nlevel-type=default\nview-distance=10\nresource-pack=\nspawn-animals=true\nwhite-list=false\ngenerate-structures=true\nonline-mode=true\nmax-build-height=256\nprevent-proxy-connections=false\nuse-native-transport=true\nmotd=A premium Minecraft Server powered by NivleHost!`;
    } else if (fileName === "ops.json") {
      content = `[\n  {\n    "uuid": "f1a8c3d2-4b21-482a-912c-34d284a1e94d",\n    "name": "Notch",\n    "level": 4,\n    "bypassesPlayerLimit": true\n  }\n]`;
    } else if (fileName === "eula.txt") {
      content = `# By changing the setting below to TRUE you are indicating your agreement to our EULA (https://account.mojang.com/documents/minecraft_eula).\n# Generated by NivleHost\n\neula=true`;
    } else {
      content = `// Mock binary or config data for ${fileName}\n// Use Nivle FTP client to download or upload custom files.`;
    }
    setSelectedFile({ name: fileName, content });
  };

  const ALL_PLUGINS_CATALOG = [
    { name: "EssentialsX", desc: "Essential commands (home, warp, teleport, economy) for Minecraft servers.", category: "Core" },
    { name: "WorldEdit", desc: "In-game map editor to build, copy, and paste structures instantly.", category: "Utility" },
    { name: "LuckPerms", desc: "Advanced rank and permissions management plugin.", category: "Admin" },
    { name: "GeyserMC", desc: "Enables Bedrock (Xbox, PE, Switch) players to join Java servers.", category: "Crossplay" },
    { name: "Vault", desc: "Permissions, chat, and economy API bridge for other plugins.", category: "Core" },
    { name: "Dynmap", desc: "Renders a real-time, interactive Google-like map of your Minecraft world.", category: "Utility" }
  ];

  return (
    <div className="flex-grow flex flex-col md:flex-row bg-[#05070f] min-h-screen text-gray-200">
      {/* Left Sidebar */}
      <aside className="w-full md:w-64 bg-[#0a0d1a]/60 border-r border-white/5 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveView("landing")}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center">
              <Server className="w-4 h-4 text-black font-bold" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white flex items-center">
              Nivle<span className="text-emerald-400">Console</span>
            </span>
          </div>

          {/* Server Selector */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">My Game Servers</label>
            <div className="space-y-1">
              {servers.map((srv) => (
                <button
                  key={srv.id}
                  onClick={() => {
                    setActiveServer(srv.id);
                    setActiveTab("console");
                    setSelectedFile(null);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl border text-sm font-medium flex items-center justify-between transition-all duration-200 ${
                    activeServerId === srv.id 
                      ? "bg-emerald-500/10 border-emerald-500/30 text-white" 
                      : "bg-transparent border-transparent text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex flex-col truncate pr-2">
                    <span className="truncate font-semibold">{srv.name}</span>
                    <span className="text-[10px] text-gray-500 font-mono">{srv.game} • {srv.location.split(",")[0]}</span>
                  </div>
                  <span className={`w-2 h-2 rounded-full shrink-0 ${
                    srv.status === "Online" ? "bg-emerald-400 shadow-lg shadow-emerald-400/50" : srv.status === "Offline" ? "bg-red-500" : "bg-blue-400 animate-pulse"
                  }`} />
                </button>
              ))}
            </div>

            <button 
              onClick={() => setActiveView("deploy-wizard")}
              className="w-full mt-4 py-2.5 rounded-xl border border-dashed border-white/10 hover:border-emerald-500/50 bg-white/[0.01] hover:bg-white/[0.04] text-xs font-bold text-gray-300 hover:text-emerald-400 transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Deploy New Server
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Navigation</label>
            <button 
              onClick={() => setActiveView("landing")}
              className="w-full text-left px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              <Globe className="w-4 h-4 text-emerald-400" /> Landing Homepage
            </button>
            <button 
              onClick={() => setActiveView("pricing")}
              className="w-full text-left px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              <Settings className="w-4 h-4 text-emerald-400" /> RAM Calculator
            </button>
          </nav>
        </div>

        {/* User profile info */}
        <div className="pt-6 border-t border-white/5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-600 flex items-center justify-center text-black font-extrabold text-sm">
            JD
          </div>
          <div>
            <p className="text-xs font-bold text-white">John Doe</p>
            <p className="text-[10px] text-gray-500">Premium Account</p>
          </div>
        </div>
      </aside>

      {/* Main Control Panel Area */}
      <main className="flex-grow p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full space-y-6">
        {activeServer ? (
          <>
            {/* Server Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/5">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">{activeServer.name}</h1>
                  <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold tracking-wider uppercase ${getStatusColor(activeServer.status)}`}>
                    {activeServer.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-400 font-medium font-mono">
                  <span className="flex items-center gap-1 text-emerald-400"><Globe className="w-3.5 h-3.5" /> {activeServer.location}</span>
                  <span className="text-gray-700">•</span>
                  <button 
                    onClick={handleCopyIp}
                    className="flex items-center gap-1 hover:text-white transition-colors bg-white/5 px-2 py-0.5 rounded border border-white/5"
                  >
                    <span>{activeServer.ip}</span>
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                  <span className="text-gray-700">•</span>
                  <span className="flex items-center gap-1"><Code className="w-3.5 h-3.5 text-blue-400" /> {activeServer.version}</span>
                </div>
              </div>

              {/* Power Buttons */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => handlePowerAction("start")}
                  disabled={activeServer.status === "Online" || activeServer.status === "Starting" || activeServer.status === "Restarting"}
                  className="px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-950 disabled:text-emerald-800 text-black font-bold text-xs flex items-center gap-1 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Start
                </button>
                <button
                  onClick={() => handlePowerAction("stop")}
                  disabled={activeServer.status === "Offline"}
                  className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 disabled:bg-red-950 disabled:text-red-800 text-white font-bold text-xs flex items-center gap-1 transition-all"
                >
                  <Square className="w-3.5 h-3.5 fill-current" /> Stop
                </button>
                <button
                  onClick={() => handlePowerAction("restart")}
                  disabled={activeServer.status === "Offline" || activeServer.status === "Starting" || activeServer.status === "Restarting"}
                  className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 disabled:border-transparent disabled:text-gray-700 text-gray-300 font-semibold text-xs flex items-center gap-1 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Restart
                </button>
              </div>
            </div>

            {/* Live Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* CPU Usage */}
              <div className="bg-[#0a0d1a]/40 border border-white/5 p-4 rounded-xl">
                <div className="flex items-center justify-between text-gray-400 mb-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider">CPU Usage</span>
                  <Cpu className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-xl font-bold text-white font-mono">
                  {activeServer.cpu}% <span className="text-[10px] text-gray-500 font-normal">/ {activeServer.maxCpu}%</span>
                </p>
                <div className="w-full bg-white/5 h-1 rounded-full mt-2.5 overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (activeServer.cpu / activeServer.maxCpu) * 100)}%` }} />
                </div>
              </div>

              {/* Memory Allocation */}
              <div className="bg-[#0a0d1a]/40 border border-white/5 p-4 rounded-xl">
                <div className="flex items-center justify-between text-gray-400 mb-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider">Dedicated RAM</span>
                  <HardDrive className="w-4 h-4 text-blue-400" />
                </div>
                <p className="text-xl font-bold text-white font-mono">
                  {activeServer.status === "Online" ? (activeServer.ram / 1024).toFixed(2) : "0"}{" "}
                  <span className="text-[10px] font-normal text-gray-500">/ {(activeServer.maxRam / 1024).toFixed(0)} GB</span>
                </p>
                <div className="w-full bg-white/5 h-1 rounded-full mt-2.5 overflow-hidden">
                  <div className="bg-blue-400 h-full rounded-full transition-all duration-1000" style={{ width: `${(activeServer.ram / activeServer.maxRam) * 100}%` }} />
                </div>
              </div>

              {/* Players Online */}
              <div className="bg-[#0a0d1a]/40 border border-white/5 p-4 rounded-xl">
                <div className="flex items-center justify-between text-gray-400 mb-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider">Players Online</span>
                  <Users className="w-4 h-4 text-purple-400" />
                </div>
                <p className="text-xl font-bold text-white font-mono">
                  {activeServer.players} <span className="text-[10px] font-normal text-gray-500">/ {activeServer.maxPlayers} Slots</span>
                </p>
                <div className="w-full bg-white/5 h-1 rounded-full mt-2.5 overflow-hidden">
                  <div className="bg-purple-400 h-full rounded-full transition-all duration-1000" style={{ width: `${(activeServer.players / activeServer.maxPlayers) * 100}%` }} />
                </div>
              </div>

              {/* Storage Space */}
              <div className="bg-[#0a0d1a]/40 border border-white/5 p-4 rounded-xl">
                <div className="flex items-center justify-between text-gray-400 mb-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider">SSD Storage</span>
                  <Database className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-xl font-bold text-white font-mono">
                  {activeServer.storage} <span className="text-[10px] font-normal text-gray-500">/ {activeServer.maxStorage} GB</span>
                </p>
                <div className="w-full bg-white/5 h-1 rounded-full mt-2.5 overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full transition-all duration-1000" style={{ width: `${(activeServer.storage / activeServer.maxStorage) * 100}%` }} />
                </div>
              </div>
            </div>

            {/* Inner Project Tabs */}
            <div className="border-b border-white/5">
              <nav className="flex gap-6 overflow-x-auto">
                {[
                  { id: "console", label: "Live Console", icon: Terminal },
                  { id: "players", label: "Players", icon: Users },
                  { id: "files", label: "File Manager", icon: Folder },
                  { id: "plugins", label: "Plugin Installer", icon: Download },
                  { id: "settings", label: "Settings", icon: Settings }
                ].map((tab) => {
                  const Icon = tab.icon;
                  // Hide plugins tab for non-Minecraft games
                  if (tab.id === "plugins" && activeServer.game !== "Minecraft") return null;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`pb-3 text-xs font-bold border-b-2 capitalize transition-all flex items-center gap-1.5 shrink-0 ${
                        activeTab === tab.id 
                          ? "border-emerald-400 text-emerald-400" 
                          : "border-transparent text-gray-400 hover:text-white"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Contents */}
            <div className="min-h-[350px]">
              {/* Tab 1: Live Console */}
              {activeTab === "console" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Console Terminal */}
                  <div className="lg:col-span-2 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                        <Terminal className="w-4 h-4 text-emerald-400" /> Interactive Terminal Logs
                      </h3>
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                        Listening
                      </span>
                    </div>

                    <div className="bg-[#03050a] border border-white/5 rounded-xl p-4 font-mono text-xs text-gray-300 space-y-1.5 h-80 overflow-y-auto shadow-inner text-left">
                      {logs.map((log, idx) => (
                        <p 
                          key={idx} 
                          className={`${
                            log.startsWith(">") ? "text-white font-bold" :
                            log.includes("[System]") ? "text-blue-400" :
                            log.includes("Error") || log.includes("Failed") ? "text-red-400" :
                            log.includes("Enabling") || log.includes("Done") || log.includes("successfully") ? "text-emerald-400" : "text-gray-400"
                          }`}
                        >
                          {log}
                        </p>
                      ))}
                      <div ref={terminalEndRef} />
                    </div>

                    {/* Console Input */}
                    <form onSubmit={handleConsoleSubmit} className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Type server command (e.g. 'help', 'say Hello!', 'status')..."
                        value={consoleInput}
                        onChange={(e) => setConsoleInput(e.target.value)}
                        className="flex-grow px-4 py-2.5 rounded-lg bg-[#03050a] border border-white/5 focus:border-emerald-500 text-xs font-mono text-white outline-none transition-colors"
                      />
                      <button 
                        type="submit"
                        className="px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors"
                      >
                        Send
                      </button>
                    </form>
                  </div>

                  {/* Telemetry charts on side */}
                  <div className="bg-[#0a0d1a]/40 border border-white/5 rounded-xl p-5 shadow-xl flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-emerald-400" /> Server Telemetry
                      </h3>
                      
                      {mounted && telemetry.length > 0 ? (
                        <div className="h-44 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={telemetry} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                              <defs>
                                <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <XAxis dataKey="time" stroke="#4b5563" fontSize={8} tickLine={false} />
                              <YAxis stroke="#4b5563" fontSize={8} tickLine={false} />
                              <Tooltip contentStyle={{ backgroundColor: '#03050a', borderColor: '#1f2937', color: '#f3f4f6', fontSize: 10 }} />
                              <Area type="monotone" dataKey="cpu" name="CPU Usage (%)" stroke="#10b981" strokeWidth={1.5} fillOpacity={1} fill="url(#colorCpu)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <div className="h-44 flex items-center justify-center text-gray-500 text-xs">Loading telemetry...</div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-white/5 space-y-2 text-xs text-gray-400">
                      <div className="flex justify-between">
                        <span>Node Core:</span>
                        <span className="font-mono text-white">AMD Ryzen 9 7950X</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Memory Speed:</span>
                        <span className="font-mono text-white">5600 MHz DDR5 ECC</span>
                      </div>
                      <div className="flex justify-between">
                        <span>SSD Read Speed:</span>
                        <span className="font-mono text-white">7,000 MB/s NVMe</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Players Manager */}
              {activeTab === "players" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-bold text-white">Online Players</h3>
                      <p className="text-xs text-gray-400">Manage players currently active on the server instance.</p>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                      {activeServer.playersList.length} / {activeServer.maxPlayers} Players Online
                    </span>
                  </div>

                  {activeServer.playersList.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {activeServer.playersList.map((player) => (
                        <div key={player} className="flex items-center justify-between p-4 rounded-xl bg-[#0a0d1a]/40 border border-white/5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-black font-extrabold text-sm">
                              {player[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">{player}</p>
                              <p className="text-[10px] text-gray-500 font-mono">Ping: {Math.floor(Math.random() * 30) + 12}ms</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                runConsoleCommand(activeServer.id, `op ${player}`);
                              }}
                              title="Give Operator Permissions"
                              className="p-1.5 rounded bg-white/5 hover:bg-emerald-500/10 text-gray-400 hover:text-emerald-400 border border-white/5 transition-colors"
                            >
                              <ShieldAlert className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleKickPlayer(player)}
                              title="Kick Player"
                              className="p-1.5 rounded bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 border border-white/5 transition-colors"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center rounded-xl border border-white/5 bg-white/[0.01]">
                      <Users className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                      <h4 className="text-sm font-bold text-white">No players online</h4>
                      <p className="text-xs text-gray-500 mt-1">Share the IP '{activeServer.ip}' with friends to join!</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: File Manager */}
              {activeTab === "files" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* File List */}
                  <div className="lg:col-span-5 bg-[#0a0d1a]/40 border border-white/5 rounded-xl p-4 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Web FTP Directory</h3>
                    
                    <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
                      {/* Parent directory mock */}
                      <div className="flex items-center gap-2 p-2 rounded text-xs text-gray-500 font-mono">
                        <span>..</span>
                      </div>

                      {activeServer.files.map((file) => (
                        <div 
                          key={file.name}
                          onClick={() => !file.isDir && handleOpenFile(file.name)}
                          className={`flex items-center justify-between p-2 rounded-lg text-xs font-mono transition-all ${
                            file.isDir 
                              ? "text-blue-400 hover:bg-white/5 cursor-pointer" 
                              : "text-gray-300 hover:bg-white/5 cursor-pointer hover:text-white"
                          } ${selectedFile?.name === file.name ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15" : "border border-transparent"}`}
                        >
                          <div className="flex items-center gap-2">
                            {file.isDir ? <Folder className="w-4 h-4 text-blue-400 shrink-0" /> : <File className="w-4 h-4 text-gray-500 shrink-0" />}
                            <span>{file.name}</span>
                          </div>
                          <span className="text-[10px] text-gray-500">{file.size || "Folder"}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* File Editor Mock */}
                  <div className="lg:col-span-7 bg-[#03050a] border border-white/5 rounded-xl p-4 flex flex-col justify-between min-h-[350px]">
                    {selectedFile ? (
                      <div className="flex flex-col h-full justify-between">
                        <div>
                          <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
                            <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                              <FileCode className="w-4 h-4 text-emerald-400" /> {selectedFile.name}
                            </span>
                            <span className="text-[10px] text-gray-500 font-semibold font-mono">Read Only Mode</span>
                          </div>
                          <textarea 
                            value={selectedFile.content}
                            readOnly
                            className="w-full h-72 p-3 rounded-lg bg-[#05070f] border border-white/5 font-mono text-xs text-gray-300 outline-none resize-none"
                          />
                        </div>
                        <div className="flex justify-end gap-2 pt-4 border-t border-white/5">
                          <button 
                            onClick={() => setSelectedFile(null)}
                            className="px-4 py-2 rounded bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold"
                          >
                            Close File
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center p-12 my-auto">
                        <FileCode className="w-12 h-12 text-gray-600 mb-3" />
                        <h4 className="text-sm font-bold text-white">No file selected</h4>
                        <p className="text-xs text-gray-500 mt-1 max-w-xs">Select a configuration file on the left side to view or edit its settings instantly.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 4: Plugin Installer */}
              {activeTab === "plugins" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-white">Spigot / Paper Plugin Marketplace</h3>
                    <p className="text-xs text-gray-400">Search and install popular Minecraft server expansions directly in 1 click.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ALL_PLUGINS_CATALOG.map((plugin) => {
                      const isInstalled = activeServer.plugins.includes(plugin.name);
                      return (
                        <div key={plugin.name} className="p-4 rounded-xl bg-[#0a0d1a]/40 border border-white/5 flex flex-col justify-between hover:border-emerald-500/10 transition-colors">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-bold text-white font-mono">{plugin.name}</span>
                              <span className="px-2 py-0.5 rounded bg-white/5 text-[9px] text-gray-400 font-bold uppercase tracking-wider">{plugin.category}</span>
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed mb-4">{plugin.desc}</p>
                          </div>

                          <div className="flex justify-end pt-3 border-t border-white/5">
                            {isInstalled ? (
                              <button
                                onClick={() => handleUninstallPlugin(plugin.name)}
                                className="px-3 py-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-colors"
                              >
                                Uninstall
                              </button>
                            ) : (
                              <button
                                onClick={() => handleInstallPlugin(plugin.name)}
                                className="px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-colors flex items-center gap-1"
                              >
                                <Download className="w-3.5 h-3.5" /> Install
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 5: Settings / Delete Server */}
              {activeTab === "settings" && (
                <div className="max-w-2xl bg-[#0a0d1a]/40 border border-white/5 rounded-xl p-6 space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-white">Server Settings</h3>
                    <p className="text-xs text-gray-400">Manage advanced options for your game server container.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-white/[0.01] border border-white/5 flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-bold text-white">SFTP Credentials</h4>
                        <p className="text-xs text-gray-400 mt-0.5">Access files via external FTP clients (FileZilla, Cyberduck).</p>
                      </div>
                      <div className="text-right text-xs font-mono text-gray-300 bg-white/5 p-2 rounded">
                        sftp.nivlehost.net:2022
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-white/[0.01] border border-white/5 flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-bold text-white">Allocation Port</h4>
                        <p className="text-xs text-gray-400 mt-0.5">The dedicated port bound to your game server container.</p>
                      </div>
                      <div className="text-right text-xs font-mono text-gray-300 bg-white/5 p-2 rounded">
                        {activeServer.ip.split(":")[1]}
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/10 flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-bold text-red-400">Delete Server Instance</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Permanently delete this server and wipe all associated files and world backups.</p>
                      </div>
                      <button
                        onClick={handleDeleteServer}
                        className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete Server
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <Server className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">No game servers deployed</h2>
            <p className="text-gray-400 mb-6">Launch your first game server on our high-speed node cluster.</p>
            <button 
              onClick={() => setActiveView("deploy-wizard")}
              className="px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition-colors"
            >
              Deploy Server
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
