import { create } from "zustand";

export interface GameServer {
  id: string;
  name: string;
  game: "Minecraft" | "Palworld" | "Rust" | "Valheim" | "CS2";
  status: "Online" | "Offline" | "Starting" | "Restarting";
  ip: string;
  location: string;
  cpu: number;
  maxCpu: number; // in % (e.g. 100% is 1 full core)
  ram: number; // in MB
  maxRam: number; // in MB
  players: number;
  maxPlayers: number;
  playersList: string[];
  storage: number; // in GB
  maxStorage: number; // in GB
  version: string;
  createdAt: string;
  uptime: string;
  plugins: string[];
  files: { name: string; isDir: boolean; size?: string }[];
}

interface AppStore {
  activeView: "landing" | "dashboard" | "deploy-wizard" | "pricing";
  servers: GameServer[];
  logs: string[];
  isProvisioning: boolean;
  currentProvisioningServer: string | null;
  activeServerId: string | null;
  
  // Actions
  setActiveView: (view: "landing" | "dashboard" | "deploy-wizard" | "pricing") => void;
  setActiveServer: (id: string | null) => void;
  addServer: (server: GameServer) => void;
  deleteServer: (id: string) => void;
  updateServerMetrics: (id: string, cpu: number, ram: number, players: number) => void;
  updateServerStatus: (id: string, status: GameServer["status"]) => void;
  addLog: (log: string) => void;
  clearLogs: () => void;
  startSimulatedProvision: (
    serverName: string, 
    game: GameServer["game"], 
    location: string, 
    version: string, 
    ramGb: number
  ) => void;
  installPlugin: (serverId: string, plugin: string) => void;
  uninstallPlugin: (serverId: string, plugin: string) => void;
  kickPlayer: (serverId: string, player: string) => void;
  addPlayer: (serverId: string, player: string) => void;
  runConsoleCommand: (serverId: string, command: string) => void;
}

const initialServers: GameServer[] = [
  {
    id: "srv-1",
    name: "Nivle Survival SMP",
    game: "Minecraft",
    status: "Online",
    ip: "play.nivlehost.me:25565",
    location: "Frankfurt, DE",
    cpu: 24,
    maxCpu: 200,
    ram: 3120,
    maxRam: 4096,
    players: 4,
    maxPlayers: 20,
    playersList: ["Notch", "GamerX", "Alex_12", "Herobrine"],
    storage: 4.2,
    maxStorage: 25,
    version: "Paper 1.21.1",
    createdAt: "2024-11-01 12:00",
    uptime: "2d 14h 42m",
    plugins: ["EssentialsX", "WorldEdit", "LuckPerms", "GeyserMC"],
    files: [
      { name: "plugins", isDir: true },
      { name: "world", isDir: true },
      { name: "world_nether", isDir: true },
      { name: "world_the_end", isDir: true },
      { name: "server.properties", isDir: false, size: "8.2 KB" },
      { name: "spigot.yml", isDir: false, size: "4.1 KB" },
      { name: "paper-global.yml", isDir: false, size: "12.4 KB" },
      { name: "ops.json", isDir: false, size: "1.2 KB" },
      { name: "banned-players.json", isDir: false, size: "0.2 KB" },
      { name: "eula.txt", isDir: false, size: "0.5 KB" }
    ]
  },
  {
    id: "srv-2",
    name: "Palworld Co-Op #1",
    game: "Palworld",
    status: "Offline",
    ip: "pal.nivlehost.me:8211",
    location: "Ashburn, USA",
    cpu: 0,
    maxCpu: 400,
    ram: 0,
    maxRam: 8192,
    players: 0,
    maxPlayers: 32,
    playersList: [],
    storage: 1.8,
    maxStorage: 50,
    version: "Steam v0.3.2",
    createdAt: "2024-11-10 16:30",
    uptime: "0m",
    plugins: [],
    files: [
      { name: "Pal", isDir: true },
      { name: "Engine", isDir: true },
      { name: "DefaultPalWorldSettings.ini", isDir: false, size: "4.5 KB" },
      { name: "PalServer.sh", isDir: false, size: "1.1 KB" },
      { name: "manifest.txt", isDir: false, size: "0.8 KB" }
    ]
  },
  {
    id: "srv-3",
    name: "Rust Clan War Arena",
    game: "Rust",
    status: "Online",
    ip: "rust.nivlehost.me:28015",
    location: "Singapore, SG",
    cpu: 68,
    maxCpu: 400,
    ram: 11450,
    maxRam: 16384,
    players: 18,
    maxPlayers: 100,
    playersList: ["ShadowSlayer", "RustGod", "Beamer", "BaseBuilder", "AimbotNoob", "HelicopterDriver", "StoneMiner"],
    storage: 18.5,
    maxStorage: 100,
    version: "Oxide v2.0.56",
    createdAt: "2024-11-05 08:15",
    uptime: "5d 2h 11m",
    plugins: ["GatherManager", "ImageLibrary", "NoEscape", "Kits"],
    files: [
      { name: "oxide", isDir: true },
      { name: "server", isDir: true },
      { name: "rust_server_Data", isDir: true },
      { name: "server.cfg", isDir: false, size: "2.5 KB" },
      { name: "users.cfg", isDir: false, size: "1.1 KB" }
    ]
  }
];

export const useAppStore = create<AppStore>((set, get) => ({
  activeView: "landing",
  servers: initialServers,
  logs: [],
  isProvisioning: false,
  currentProvisioningServer: null,
  activeServerId: "srv-1",

  setActiveView: (view) => set({ activeView: view }),
  setActiveServer: (id) => set({ activeServerId: id }),
  
  addServer: (server) => set((state) => ({ 
    servers: [server, ...state.servers],
    activeServerId: server.id
  })),

  deleteServer: (id) => set((state) => {
    const remaining = state.servers.filter(s => s.id !== id);
    return {
      servers: remaining,
      activeServerId: remaining.length > 0 ? remaining[0].id : null
    };
  }),

  updateServerMetrics: (id, cpu, ram, players) => set((state) => ({
    servers: state.servers.map((s) => 
      s.id === id 
        ? { 
            ...s, 
            cpu: s.status === "Online" ? cpu : 0, 
            ram: s.status === "Online" ? ram : 0, 
            players: s.status === "Online" ? players : 0 
          } 
        : s
    )
  })),

  updateServerStatus: (id, status) => set((state) => ({
    servers: state.servers.map((s) => {
      if (s.id === id) {
        let players = s.players;
        let cpu = s.cpu;
        let ram = s.ram;
        let uptime = s.uptime;

        if (status === "Offline") {
          players = 0;
          cpu = 0;
          ram = 0;
          uptime = "0m";
        } else if (status === "Online") {
          cpu = 15;
          ram = Math.round(s.maxRam * 0.4);
          uptime = "0h 1m";
        } else if (status === "Starting") {
          cpu = 85;
          ram = Math.round(s.maxRam * 0.2);
          uptime = "Starting...";
        } else if (status === "Restarting") {
          cpu = 95;
          ram = Math.round(s.maxRam * 0.1);
          uptime = "Restarting...";
        }

        return { ...s, status, cpu, ram, players, uptime };
      }
      return s;
    })
  })),

  addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
  clearLogs: () => set({ logs: [] }),

  installPlugin: (serverId, plugin) => set((state) => ({
    servers: state.servers.map((s) => {
      if (s.id === serverId && !s.plugins.includes(plugin)) {
        return {
          ...s,
          plugins: [...s.plugins, plugin],
          files: s.files.map(f => {
            if (f.name === "plugins") {
              return { ...f }; // plugin folder exists
            }
            return f;
          })
        };
      }
      return s;
    })
  })),

  uninstallPlugin: (serverId, plugin) => set((state) => ({
    servers: state.servers.map((s) => {
      if (s.id === serverId) {
        return {
          ...s,
          plugins: s.plugins.filter(p => p !== plugin)
        };
      }
      return s;
    })
  })),

  kickPlayer: (serverId, player) => set((state) => ({
    servers: state.servers.map((s) => {
      if (s.id === serverId) {
        const updatedList = s.playersList.filter(p => p !== player);
        return {
          ...s,
          playersList: updatedList,
          players: updatedList.length
        };
      }
      return s;
    })
  })),

  addPlayer: (serverId, player) => set((state) => ({
    servers: state.servers.map((s) => {
      if (s.id === serverId && !s.playersList.includes(player)) {
        const updatedList = [...s.playersList, player];
        return {
          ...s,
          playersList: updatedList,
          players: updatedList.length
        };
      }
      return s;
    })
  })),

  runConsoleCommand: (serverId, command) => {
    const { addLog } = get();
    const cleanCommand = command.trim();
    if (!cleanCommand) return;

    // Add user command log
    addLog(`> ${cleanCommand}`);

    // Parse command
    const parts = cleanCommand.split(" ");
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(" ");

    setTimeout(() => {
      switch (cmd) {
        case "help":
          addLog("NivleConsole HELP Menu:");
          addLog("  help - Show this menu");
          addLog("  say <msg> - Broadcast a message to all players");
          addLog("  kick <player> - Kick a player from the server");
          addLog("  op <player> - Give a player operator permissions");
          addLog("  plugins - List installed plugins/mods");
          addLog("  status - Show server health diagnostics");
          break;
        case "say":
          if (!arg) {
            addLog("[Server] Error: say command requires a message.");
          } else {
            addLog(`[Broadcast] [Server]: ${arg}`);
          }
          break;
        case "kick":
          if (!arg) {
            addLog("[Server] Error: kick command requires a player name.");
          } else {
            const servers = get().servers;
            const targetServer = servers.find(s => s.id === serverId);
            if (targetServer && targetServer.playersList.includes(arg)) {
              get().kickPlayer(serverId, arg);
              addLog(`[Server] Kicked player ${arg} from the server.`);
            } else {
              addLog(`[Server] Error: Player '${arg}' not found online.`);
            }
          }
          break;
        case "op":
          if (!arg) {
            addLog("[Server] Error: op command requires a player name.");
          } else {
            addLog(`[Server] Made ${arg} a server operator.`);
          }
          break;
        case "plugins":
          const target = get().servers.find(s => s.id === serverId);
          if (target) {
            addLog(`Plugins (${target.plugins.length}): ` + target.plugins.join(", "));
          }
          break;
        case "status":
          const srv = get().servers.find(s => s.id === serverId);
          if (srv) {
            addLog(`Server Health: CPU: ${srv.cpu}%, Memory: ${srv.ram}MB/${srv.maxRam}MB, Players: ${srv.players}/${srv.maxPlayers}`);
          }
          break;
        default:
          addLog(`Unknown command '${cmd}'. Type 'help' for a list of available commands.`);
      }
    }, 100);
  },

  startSimulatedProvision: (serverName, game, location, version, ramGb) => {
    const { addServer, addLog, clearLogs } = get();
    const serverId = `srv-${Date.now()}`;
    const cleanName = serverName.trim() || `Nivle ${game} Server`;
    const maxRamMb = ramGb * 1024;
    const ipPort = game === "Minecraft" ? "25565" : game === "Palworld" ? "8211" : game === "Rust" ? "28015" : game === "Valheim" ? "2456" : "27015";
    const cleanIp = `${game.toLowerCase()}-${Math.floor(Math.random() * 899 + 100)}.nivlehost.me:${ipPort}`;

    set({ isProvisioning: true, currentProvisioningServer: cleanName, activeView: "deploy-wizard" });
    clearLogs();

    const steps = [
      { delay: 200, log: "⚡ Nivle Host Provisioning Pipeline Initiated." },
      { delay: 600, log: `🎮 Target Game: ${game} (${version})` },
      { delay: 1100, log: `🌍 Allocating Node in Location: [${location}]...` },
      { delay: 1700, log: `🚀 Allocating Dedicated RAM: ${ramGb} GB (${maxRamMb} MB)...` },
      { delay: 2200, log: "🔒 Spanning secure Layer 7 DDoS mitigation tunnel..." },
      { delay: 2800, log: "🐳 Creating isolated Docker game container..." },
      { delay: 3500, log: "📥 Pulling clean server binary files..." },
      { delay: 4200, log: "⚙️ Accepting EULA and configuring server.properties..." },
      { delay: 5000, log: "🧱 Building world structure and spawning environment..." },
      { delay: 5800, log: "📂 Generating default folders (plugins, mods, config)..." },
      { delay: 6600, log: "🔌 Pre-installing standard performance optimization mods..." },
      { delay: 7200, log: "📡 Binding network interface to public IP address..." },
      { delay: 8000, log: `🎉 Server successfully provisioned! IP: ${cleanIp}` },
      { delay: 8500, log: "🟢 Booting Server: Starting game server engine..." },
      { delay: 9200, log: game === "Minecraft" 
          ? "[Minecraft Server] Loading libraries, please wait..." 
          : `[${game} Server] Initializing game world...` },
      { delay: 10000, log: game === "Minecraft"
          ? "[Minecraft Server] Preparing spawn area: 0% ... 48% ... 100%"
          : `[${game} Server] Spawning entities and structures...` },
      { delay: 10800, log: game === "Minecraft"
          ? `[Minecraft Server] Done (1.8s)! For help, type "help"`
          : `[${game} Server] Ready for connections on port ${ipPort}!` }
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        addLog(step.log);
        
        if (index === steps.length - 1) {
          const defaultFiles = game === "Minecraft" ? [
            { name: "plugins", isDir: true },
            { name: "world", isDir: true },
            { name: "world_nether", isDir: true },
            { name: "world_the_end", isDir: true },
            { name: "server.properties", isDir: false, size: "8.2 KB" },
            { name: "spigot.yml", isDir: false, size: "4.1 KB" },
            { name: "paper-global.yml", isDir: false, size: "12.4 KB" },
            { name: "ops.json", isDir: false, size: "1.2 KB" },
            { name: "eula.txt", isDir: false, size: "0.5 KB" }
          ] : [
            { name: "SaveGames", isDir: true },
            { name: "Engine", isDir: true },
            { name: "settings.ini", isDir: false, size: "3.2 KB" },
            { name: "Server.sh", isDir: false, size: "1.0 KB" }
          ];

          const newServer: GameServer = {
            id: serverId,
            name: cleanName,
            game,
            status: "Online",
            ip: cleanIp,
            location,
            cpu: 12,
            maxCpu: game === "Minecraft" ? 200 : 400,
            ram: Math.round(maxRamMb * 0.35),
            maxRam: maxRamMb,
            players: 0,
            maxPlayers: game === "Minecraft" ? 20 : game === "Palworld" ? 32 : 100,
            playersList: [],
            storage: 1.2,
            maxStorage: ramGb * 10,
            version,
            createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            uptime: "0h 1m",
            plugins: game === "Minecraft" ? ["EssentialsX", "LuckPerms"] : [],
            files: defaultFiles
          };

          addServer(newServer);
          set({ isProvisioning: false, activeView: "dashboard" });
        }
      }, step.delay);
    });
  }
}));
