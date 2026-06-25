import { create } from "zustand";

export interface Project {
  id: string;
  name: string;
  repo: string;
  branch: string;
  status: "Active" | "Deploying" | "Paused" | "Failed";
  region: string;
  ip: string;
  cpu: number;
  ram: number; // in MB
  maxRam: number; // in MB
  storage: number; // in GB
  maxStorage: number; // in GB
  bandwidth: number; // in GB used
  maxBandwidth: number; // in GB limit
  url: string;
  createdAt: string;
  dbStatus: "None" | "Active" | "Provisioning";
  dbType?: "PostgreSQL" | "Redis" | "MongoDB";
}

export interface Deployment {
  id: string;
  projectId: string;
  commitHash: string;
  commitMessage: string;
  branch: string;
  status: "Ready" | "Building" | "Failed" | "Queued";
  createdAt: string;
  duration?: string;
  url: string;
}

interface AppStore {
  activeView: "landing" | "dashboard" | "deploy-wizard" | "pricing";
  projects: Project[];
  deployments: Deployment[];
  logs: string[];
  isBuilding: boolean;
  currentBuildProject: string | null;
  activeProjectId: string | null;
  
  // Actions
  setActiveView: (view: "landing" | "dashboard" | "deploy-wizard" | "pricing") => void;
  setActiveProject: (id: string | null) => void;
  addProject: (project: Project) => void;
  updateProjectMetrics: (id: string, cpu: number, ram: number, bandwidth: number) => void;
  updateProjectStatus: (id: string, status: Project["status"]) => void;
  provisionDatabase: (id: string, dbType: "PostgreSQL" | "Redis" | "MongoDB") => void;
  addDeployment: (deployment: Deployment) => void;
  clearLogs: () => void;
  addLog: (log: string) => void;
  startSimulatedBuild: (projectName: string, repoUrl: string, branch: string, dbType?: "PostgreSQL" | "Redis" | "MongoDB" | "None") => void;
}

const initialProjects: Project[] = [
  {
    id: "proj-1",
    name: "hyperion-api",
    repo: "github.com/apex-labs/hyperion-api",
    branch: "main",
    status: "Active",
    region: "US East (N. Virginia)",
    ip: "74.125.19.147",
    cpu: 12,
    ram: 342,
    maxRam: 1024,
    storage: 8.4,
    maxStorage: 20,
    bandwidth: 142.5,
    maxBandwidth: 1000,
    url: "https://hyperion-api.aetherhost.app",
    createdAt: "2024-10-12 14:32",
    dbStatus: "Active",
    dbType: "PostgreSQL"
  },
  {
    id: "proj-2",
    name: "nexus-dashboard",
    repo: "github.com/apex-labs/nexus-dashboard",
    branch: "production",
    status: "Active",
    region: "EU West (Frankfurt)",
    ip: "104.244.42.1",
    cpu: 4,
    ram: 189,
    maxRam: 512,
    storage: 2.1,
    maxStorage: 10,
    bandwidth: 45.2,
    maxBandwidth: 500,
    url: "https://nexus-dashboard.aetherhost.app",
    createdAt: "2024-10-25 09:15",
    dbStatus: "None"
  },
  {
    id: "proj-3",
    name: "aurora-ai-model",
    repo: "github.com/ai-corp/aurora-llm",
    branch: "main",
    status: "Paused",
    region: "Asia Pacific (Tokyo)",
    ip: "172.217.25.14",
    cpu: 0,
    ram: 0,
    maxRam: 2048,
    storage: 14.8,
    maxStorage: 50,
    bandwidth: 812.0,
    maxBandwidth: 2000,
    url: "https://aurora-ai.aetherhost.app",
    createdAt: "2024-11-01 18:40",
    dbStatus: "Active",
    dbType: "Redis"
  }
];

const initialDeployments: Deployment[] = [
  {
    id: "dep-1",
    projectId: "proj-1",
    commitHash: "8f2a4c1",
    commitMessage: "feat: implement caching layer with Redis",
    branch: "main",
    status: "Ready",
    createdAt: "2024-11-10 16:45",
    duration: "42s",
    url: "https://hyperion-api-8f2a4c1.aetherhost.app"
  },
  {
    id: "dep-2",
    projectId: "proj-1",
    commitHash: "c4b9d0e",
    commitMessage: "fix: resolve memory leak in websocket handler",
    branch: "main",
    status: "Ready",
    createdAt: "2024-11-12 11:20",
    duration: "38s",
    url: "https://hyperion-api-c4b9d0e.aetherhost.app"
  },
  {
    id: "dep-3",
    projectId: "proj-2",
    commitHash: "a1b2c3d",
    commitMessage: "chore: upgrade dependencies & tailwind CSS v4",
    branch: "production",
    status: "Ready",
    createdAt: "2024-11-11 08:05",
    duration: "55s",
    url: "https://nexus-dashboard-a1b2c3d.aetherhost.app"
  }
];

export const useAppStore = create<AppStore>((set, get) => ({
  activeView: "landing",
  projects: initialProjects,
  deployments: initialDeployments,
  logs: [],
  isBuilding: false,
  currentBuildProject: null,
  activeProjectId: "proj-1",

  setActiveView: (view) => set({ activeView: view }),
  setActiveProject: (id) => set({ activeProjectId: id }),
  
  addProject: (project) => set((state) => ({ 
    projects: [project, ...state.projects],
    activeProjectId: project.id
  })),

  updateProjectMetrics: (id, cpu, ram, bandwidth) => set((state) => ({
    projects: state.projects.map((p) => 
      p.id === id 
        ? { 
            ...p, 
            cpu: p.status === "Active" ? cpu : 0, 
            ram: p.status === "Active" ? ram : 0, 
            bandwidth: p.status === "Active" ? Math.min(p.maxBandwidth, p.bandwidth + bandwidth) : p.bandwidth 
          } 
        : p
    )
  })),

  updateProjectStatus: (id, status) => set((state) => ({
    projects: state.projects.map((p) => 
      p.id === id 
        ? { ...p, status, cpu: status === "Active" ? 5 : 0, ram: status === "Active" ? 120 : 0 } 
        : p
    )
  })),

  provisionDatabase: (id, dbType) => set((state) => ({
    projects: state.projects.map((p) => 
      p.id === id 
        ? { ...p, dbStatus: "Active", dbType } 
        : p
    )
  })),

  addDeployment: (deployment) => set((state) => ({
    deployments: [deployment, ...state.deployments]
  })),

  clearLogs: () => set({ logs: [] }),
  addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),

  startSimulatedBuild: (projectName, repoUrl, branch, dbType = "None") => {
    const { addProject, addDeployment, addLog, clearLogs } = get();
    const projectId = `proj-${Date.now()}`;
    const deploymentId = `dep-${Date.now()}`;
    const commitHash = Math.random().toString(16).substring(2, 9);
    
    set({ isBuilding: true, currentBuildProject: projectName, activeView: "deploy-wizard" });
    clearLogs();

    const buildSteps = [
      { delay: 300, log: "⚡ AetherHost Build Pipeline Initiated." },
      { delay: 800, log: `🔗 Connecting to Repository: ${repoUrl}...` },
      { delay: 1400, log: `🚀 Cloning branch [${branch}] into build container...` },
      { delay: 2000, log: "📦 Successfully cloned. Resolving packages..." },
      { delay: 2600, log: "⚙️ Installing dependencies (npm install)..." },
      { delay: 3800, log: "🔍 Analyzing project structure..." },
      { delay: 4200, log: "💡 Detected Next.js project with App Router." },
      { delay: 4800, log: "🔨 Running: next build" },
      { delay: 5400, log: "   ▲ Next.js 14.2.15" },
      { delay: 5800, log: "   - Creating an optimized production build..." },
      { delay: 6800, log: "   ✓ Compiled successfully" },
      { delay: 7200, log: "   ✓ File sizes and route analysis complete:" },
      { delay: 7500, log: "     ├  / (Client)             78.2 kB" },
      { delay: 7800, log: "     ├  /api/health (Server)   1.2 kB" },
      { delay: 8100, log: "     └  /_not-found            452 B" },
      { delay: 8500, log: "📦 Compressing static assets..." },
      { delay: 9000, log: "🌍 Deploying to 48 Global Edge Nodes..." },
      { delay: 9500, log: "⚡ Provisioning SSL Certificate (Let's Encrypt)..." },
      { delay: 10000, log: dbType !== "None" ? `🗄️ Provisioning managed ${dbType} instance...` : "" },
      { delay: 10500, log: "🎉 Deployment Successful!" },
      { delay: 10800, log: `🔗 Production URL: https://${projectName}.aetherhost.app` }
    ].filter(step => step.log !== ""); // filter empty db logs

    buildSteps.forEach((step, index) => {
      setTimeout(() => {
        addLog(step.log);
        
        // At the final step, create the project and deployment
        if (index === buildSteps.length - 1) {
          const newProject: Project = {
            id: projectId,
            name: projectName,
            repo: repoUrl,
            branch,
            status: "Active",
            region: "US East (N. Virginia)",
            ip: `18.232.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            cpu: 8,
            ram: 154,
            maxRam: 1024,
            storage: 1.2,
            maxStorage: 20,
            bandwidth: 0.1,
            maxBandwidth: 1000,
            url: `https://${projectName}.aetherhost.app`,
            createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            dbStatus: dbType !== "None" ? "Active" : "None",
            dbType: dbType !== "None" ? dbType : undefined
          };

          const newDeployment: Deployment = {
            id: deploymentId,
            projectId: projectId,
            commitHash,
            commitMessage: "Initial repository import & setup",
            branch,
            status: "Ready",
            createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            duration: "10s",
            url: `https://${projectName}-${commitHash}.aetherhost.app`
          };

          addProject(newProject);
          addDeployment(newDeployment);
          set({ isBuilding: false, activeView: "dashboard" });
        }
      }, step.delay);
    });
  }
}));
