import React, { useState, useEffect } from "react";
import {
  Calculator,
  Binary,
  LineChart,
  Grid3X3,
  BarChart3,
  Dices,
  Infinity as InfinityIcon,
  ArrowLeftRight,
  Database,
  GraduationCap,
  Presentation,
  BookOpen,
  Terminal,
  Copy,
  Check,
  Cpu,
  Eye,
  ShieldCheck,
  ChevronRight,
  Code2,
  Sparkles,
} from "lucide-react";

import { CalculatorModule } from "./components/CalculatorModule";
import { EquationsModule } from "./components/EquationsModule";
import { GraphingModule } from "./components/GraphingModule";
import { MatrixModule } from "./components/MatrixModule";
import { StatisticsModule } from "./components/StatisticsModule";
import { ProbabilityModule } from "./components/ProbabilityModule";
import { CalculusModule } from "./components/CalculusModule";
import { UnitsModule } from "./components/UnitsModule";
import { HistoryModule } from "./components/HistoryModule";
import { PresentationModule } from "./components/PresentationModule";
import { VivaModule } from "./components/VivaModule";
import { DocsModule } from "./components/DocsModule";
import { CalculationLog } from "./types";

const INITIAL_LOGS: CalculationLog[] = [
  {
    id: "log-1",
    module: "Calculator",
    expression: "15 * 4 - (8 / 2)^2",
    result: "44",
    timestamp: "10:14:02",
  },
  {
    id: "log-2",
    module: "Equations",
    expression: "x² - 5x + 6 = 0",
    result: "x₁ = 3.0000, x₂ = 2.0000 (Δ = 1)",
    timestamp: "10:15:30",
  },
  {
    id: "log-3",
    module: "Matrices",
    expression: "det([[1, 2], [3, 4]])",
    result: "-2.0000",
    timestamp: "10:18:45",
  },
  {
    id: "log-4",
    module: "Calculus",
    expression: "d/dx (x^3 - 3x^2 + 2x)",
    result: "3x² - 6x + 2",
    timestamp: "10:20:12",
  },
  {
    id: "log-5",
    module: "Probability",
    expression: "Monte Carlo Coin Toss (N=1,000)",
    result: "Heads: 50.40%, Tails: 49.60%",
    timestamp: "10:22:05",
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<"modules" | "presentation" | "viva" | "docs" | "history">("modules");
  const [activeModule, setActiveModule] = useState<string>("calculator");
  const [copiedCmd, setCopiedCmd] = useState<boolean>(false);
  const [logs, setLogs] = useState<CalculationLog[]>(() => {
    try {
      const saved = localStorage.getItem("mathlab_logs");
      return saved ? JSON.parse(saved) : INITIAL_LOGS;
    } catch {
      return INITIAL_LOGS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("mathlab_logs", JSON.stringify(logs));
    } catch {}
  }, [logs]);

  const addLog = (module: string, expression: string, result: string) => {
    const newLog: CalculationLog = {
      id: "log-" + Date.now(),
      module,
      expression,
      result,
      timestamp: new Date().toLocaleTimeString(),
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  };

  const clearLogs = () => {
    setLogs([]);
    try {
      localStorage.removeItem("mathlab_logs");
    } catch {}
  };

  const copyLaunchCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const modulesList = [
    {
      id: "calculator",
      label: "Scientific Calculator",
      specialist: "Ramji",
      role: "Computation",
      icon: Calculator,
      color: "text-cyan-400",
    },
    {
      id: "equations",
      label: "Equation Solvers",
      specialist: "Ramji",
      role: "Computation",
      icon: Binary,
      color: "text-cyan-400",
    },
    {
      id: "graphing",
      label: "Graphing Laboratory",
      specialist: "Shiva",
      role: "Visualization",
      icon: LineChart,
      color: "text-purple-400",
    },
    {
      id: "matrices",
      label: "Matrix Laboratory",
      specialist: "Ramji",
      role: "Computation",
      icon: Grid3X3,
      color: "text-cyan-400",
    },
    {
      id: "statistics",
      label: "Statistics Studio",
      specialist: "Shiva",
      role: "Visualization",
      icon: BarChart3,
      color: "text-purple-400",
    },
    {
      id: "probability",
      label: "Probability Lab",
      specialist: "Shiva",
      role: "Visualization",
      icon: Dices,
      color: "text-purple-400",
    },
    {
      id: "calculus",
      label: "Calculus Studio",
      specialist: "Ramji",
      role: "Computation",
      icon: InfinityIcon,
      color: "text-cyan-400",
    },
    {
      id: "units",
      label: "Unit Converter",
      specialist: "Madhur",
      role: "Head of Project",
      icon: ArrowLeftRight,
      color: "text-emerald-400",
    },
  ];

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col font-sans selection:bg-[#00D4FF] selection:text-slate-950">
      {/* Top Application Bar */}
      <header className="h-16 border-b border-slate-800/90 bg-[#0B1020]/95 backdrop-blur sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D4FF] via-cyan-500 to-[#8B5CF6] flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-cyan-500/25 shrink-0 select-none">
            ∑
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg text-white tracking-tight">MathLab</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/80 text-[#00D4FF] border border-cyan-800/60 font-mono font-semibold">
                v2.1 Pro
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Interactive Mathematical Computing & Visualization System
            </p>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto py-1">
          {[
            { id: "modules", label: "Interactive Studio", icon: Sparkles },
            { id: "presentation", label: "Defense Slides (12)", icon: Presentation },
            { id: "viva", label: "Viva Studio (30)", icon: GraduationCap },
            { id: "docs", label: "Docs & How to Run", icon: BookOpen },
            { id: "history", label: "Database & Logs", icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  active
                    ? "bg-[#00D4FF] text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Quick Launch Terminal Command */}
        <div className="hidden xl:flex items-center space-x-2">
          <button
            onClick={() => copyLaunchCommand("python3 main.py")}
            className="flex items-center space-x-2 text-xs font-mono bg-[#111827] border border-slate-700/80 hover:border-cyan-400 px-3 py-1.5 rounded-lg text-cyan-300 transition-colors cursor-pointer group"
            title="Click to copy Python desktop launch command"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400 group-hover:animate-pulse" />
            <span>python3 main.py</span>
            {copiedCmd ? (
              <Check className="w-3 h-3 text-emerald-400" />
            ) : (
              <Copy className="w-3 h-3 text-slate-400" />
            )}
          </button>
        </div>
      </header>

      {/* Team & Project Attribution Sub-Header */}
      <div className="bg-[#090E1B] border-b border-slate-800/80 px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Head of Project:</span>
            <span className="text-sm font-semibold text-white tracking-wide">Madhur</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center space-x-2 text-slate-300 text-xs">
            <span>Ramji <span className="text-slate-400 text-[11px]">(Computation)</span></span>
            <span className="text-slate-700">•</span>
            <span>Shiva <span className="text-slate-400 text-[11px]">(Visualization)</span></span>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-[11px] text-slate-400">
          <span className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>AST Safe</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>SQLite Active</span>
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {activeTab === "modules" && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 bg-[#0B1020]/90 border-b md:border-b-0 md:border-r border-slate-800/80 p-3 flex md:flex-col space-y-1 overflow-x-auto md:overflow-y-auto shrink-0">
              <div className="hidden md:block px-3 py-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase font-mono">
                Computing Modules
              </div>

              {modulesList.map((item) => {
                const Icon = item.icon;
                const active = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveModule(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      active
                        ? "bg-[#151E34] text-[#00D4FF] border border-cyan-700/60 shadow-md shadow-cyan-500/10"
                        : "text-slate-400 hover:text-slate-200 hover:bg-[#111827] border border-transparent"
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`w-4 h-4 ${active ? "text-[#00D4FF]" : item.color}`} />
                      <span>{item.label}</span>
                    </div>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                        item.specialist === "Ramji"
                          ? "bg-cyan-950/60 text-[#00D4FF] border-cyan-800/40"
                          : item.specialist === "Shiva"
                          ? "bg-purple-950/60 text-purple-300 border-purple-800/40"
                          : "bg-emerald-950/60 text-emerald-300 border-emerald-800/40"
                      }`}
                    >
                      {item.specialist}
                    </span>
                  </button>
                );
              })}

              {/* Desktop execution hint */}
              <div className="mt-auto pt-6 hidden md:block border-t border-slate-800/70 px-2 space-y-2">
                <div className="text-[11px] font-mono text-slate-400">Desktop Terminal Run:</div>
                <div className="p-2.5 rounded-lg bg-[#070B14] border border-slate-800 text-[11px] font-mono space-y-1">
                  <p className="text-cyan-400"># Launch GUI window</p>
                  <p className="text-white">python3 main.py</p>
                  <p className="text-purple-400 pt-1"># Headless diagnostics</p>
                  <p className="text-slate-300">python3 main.py --cli</p>
                </div>
              </div>
            </aside>

            {/* Module Canvas */}
            <section className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-7xl mx-auto w-full">
              {activeModule === "calculator" && (
                <CalculatorModule onLogCalculation={(expr, res) => addLog("Calculator", expr, res)} />
              )}
              {activeModule === "equations" && (
                <EquationsModule onLogCalculation={(expr, res) => addLog("Equations", expr, res)} />
              )}
              {activeModule === "graphing" && <GraphingModule />}
              {activeModule === "matrices" && <MatrixModule />}
              {activeModule === "statistics" && <StatisticsModule />}
              {activeModule === "probability" && <ProbabilityModule />}
              {activeModule === "calculus" && <CalculusModule />}
              {activeModule === "units" && <UnitsModule />}
            </section>
          </div>
        )}

        {activeTab === "presentation" && (
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-6xl mx-auto w-full">
            <PresentationModule />
          </div>
        )}

        {activeTab === "viva" && (
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-5xl mx-auto w-full">
            <VivaModule />
          </div>
        )}

        {activeTab === "docs" && (
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-5xl mx-auto w-full">
            <DocsModule />
          </div>
        )}

        {activeTab === "history" && (
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-6xl mx-auto w-full">
            <HistoryModule logs={logs} onClearLogs={clearLogs} />
          </div>
        )}
      </main>

      {/* Bottom Desktop Status Bar */}
      <footer className="h-8 bg-[#080C16] border-t border-slate-800/80 px-4 sm:px-6 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>SYSTEM READY</span>
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-300">Database: mathlab.db (SQLite3)</span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-300 font-medium">Head of Project: Madhur</span>
          <span className="hidden lg:inline text-slate-600">|</span>
          <span className="hidden lg:inline text-slate-400 text-[10px]">
            Ramji (Computation) • Shiva (Visualization)
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-slate-400">Session Calculations: {logs.length}</span>
          <span className="hidden sm:inline text-slate-400">MathLab v2.1 • College STEM Lab</span>
        </div>
      </footer>
    </div>
  );
}
