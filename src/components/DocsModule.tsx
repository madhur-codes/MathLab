import React, { useState } from "react";
import { BookOpen, Terminal, Users, Layers, ShieldCheck, FileCode, CheckCircle2, Copy, Check } from "lucide-react";

export const DocsModule: React.FC = () => {
  const [activeDoc, setActiveDoc] = useState<"howtorun" | "team" | "architecture" | "report">("howtorun");
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-bold text-white tracking-tight">Project Documentation & Run Manual</h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/60 text-[#00D4FF]">
              Engineering Artifacts
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Official instructions on how to run MathLab, system architecture specifications, and complete team roles.
          </p>
        </div>

        {/* Doc Switcher */}
        <div className="flex items-center space-x-1 bg-[#0E1526] border border-slate-800 p-1 rounded-lg">
          {[
            { id: "howtorun", label: "How to Run", icon: Terminal },
            { id: "team", label: "Team Roles", icon: Users },
            { id: "architecture", label: "Architecture", icon: Layers },
            { id: "report", label: "Project Report", icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveDoc(tab.id as any)}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  activeDoc === tab.id
                    ? "bg-[#00D4FF] text-slate-950 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* --- TAB 1: HOW TO RUN --- */}
      {activeDoc === "howtorun" && (
        <div className="space-y-6">
          <div className="bg-[#0E1526] border border-slate-800 rounded-xl p-6 shadow-xl space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-[#00D4FF]" />
              <span>Step-by-Step Execution Guide</span>
            </h3>

            {/* Prerequisites */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-cyan-300 uppercase font-mono">1. System Prerequisites</h4>
              <p className="text-xs text-slate-300">
                Ensure Python 3.8+ is installed on your Linux, macOS, or Windows operating system:
              </p>
              <div className="bg-[#080C16] border border-slate-800 rounded-lg p-3 flex items-center justify-between font-mono text-xs">
                <code className="text-white">python3 --version</code>
                <button
                  onClick={() => copyCommand("python3 --version")}
                  className="text-slate-400 hover:text-white"
                >
                  {copiedCmd === "python3 --version" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Dependency Installation */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-cyan-300 uppercase font-mono">2. Install Scientific Dependencies</h4>
              <p className="text-xs text-slate-300">
                Install required computational packages (SymPy, NumPy, Matplotlib) via requirements.txt:
              </p>
              <div className="bg-[#080C16] border border-slate-800 rounded-lg p-3 flex items-center justify-between font-mono text-xs">
                <code className="text-white">pip install -r requirements.txt</code>
                <button
                  onClick={() => copyCommand("pip install -r requirements.txt")}
                  className="text-slate-400 hover:text-white"
                >
                  {copiedCmd === "pip install -r requirements.txt" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Launch Desktop GUI */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-cyan-300 uppercase font-mono">3. Launch Desktop Application (Tkinter GUI)</h4>
              <p className="text-xs text-slate-300">
                In an environment with a desktop display (X11 / Wayland / Windows / macOS):
              </p>
              <div className="bg-[#080C16] border border-cyan-900/60 rounded-lg p-3 flex items-center justify-between font-mono text-xs">
                <code className="text-[#00D4FF] font-bold">python3 main.py</code>
                <button
                  onClick={() => copyCommand("python3 main.py")}
                  className="text-slate-400 hover:text-white"
                >
                  {copiedCmd === "python3 main.py" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Headless CLI Mode */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-amber-300 uppercase font-mono">4. Run Headless Self-Test Diagnostics (No GUI Display Required)</h4>
              <p className="text-xs text-slate-300">
                For headless environments, automated grading, or remote servers:
              </p>
              <div className="bg-[#080C16] border border-amber-900/60 rounded-lg p-3 flex items-center justify-between font-mono text-xs">
                <code className="text-amber-300 font-bold">python3 main.py --cli</code>
                <button
                  onClick={() => copyCommand("python3 main.py --cli")}
                  className="text-slate-400 hover:text-white"
                >
                  {copiedCmd === "python3 main.py --cli" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: TEAM ROLES --- */}
      {activeDoc === "team" && (
        <div className="space-y-6">
          {/* Head of Project Focus Card: Madhur */}
          <div className="bg-[#0E1526] border border-slate-700/80 rounded-xl p-6 shadow-lg space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 font-semibold">
                  Head of Project
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mt-2 tracking-tight">Madhur</h3>
                <p className="text-xs sm:text-sm text-slate-400 font-mono mt-0.5">
                  System Architecture • Desktop Viewport • Database Core
                </p>
              </div>
              <span className="text-xs font-mono text-slate-500">
                Lead Technical Authority
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
              Madhur guided the overall technical direction of MathLab, architecting the decoupled Model-View-Controller framework, the single-window dynamic Tkinter runtime shell, the embedded SQLite database persistence schema, and the engineering unit conversion engine.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="bg-[#080C16]/80 border border-slate-800 rounded-lg p-3 space-y-1">
                <div className="flex items-center space-x-2 text-cyan-300 font-mono text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>MVC Architecture & System Design</span>
                </div>
                <p className="text-[11px] text-slate-400 pl-5.5">
                  Structured the modular directory hierarchy to cleanly decouple core math engines, GUI viewports, and database operations.
                </p>
              </div>

              <div className="bg-[#080C16]/80 border border-slate-800 rounded-lg p-3 space-y-1">
                <div className="flex items-center space-x-2 text-cyan-300 font-mono text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Single-Window Dynamic Frame Manager</span>
                </div>
                <p className="text-[11px] text-slate-400 pl-5.5">
                  Engineered the desktop Tkinter container with dynamic frame mounting to eliminate window clutter and memory leaks.
                </p>
              </div>

              <div className="bg-[#080C16]/80 border border-slate-800 rounded-lg p-3 space-y-1">
                <div className="flex items-center space-x-2 text-cyan-300 font-mono text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>SQLite Persistence Engine</span>
                </div>
                <p className="text-[11px] text-slate-400 pl-5.5">
                  Designed embedded relational storage (mathlab.db) with parameterized queries to safeguard against code injection.
                </p>
              </div>

              <div className="bg-[#080C16]/80 border border-slate-800 rounded-lg p-3 space-y-1">
                <div className="flex items-center space-x-2 text-cyan-300 font-mono text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Unit Converter & CLI Diagnostics</span>
                </div>
                <p className="text-[11px] text-slate-400 pl-5.5">
                  Implemented 8-category STEM unit conversions with base-unit normalization and headless CLI test suites (<code className="text-slate-300">python3 main.py --cli</code>).
                </p>
              </div>
            </div>
          </div>

          {/* Specialist Contributors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ramji */}
            <div className="bg-[#0E1526] border border-slate-800 rounded-xl p-5 space-y-3 shadow-lg">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                  Computation Specialist
                </span>
                <h3 className="text-lg font-bold text-white mt-1.5">Ramji</h3>
                <p className="text-xs text-slate-400 font-mono">Mathematical Engines & CAS Algorithms</p>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                  <span>Safe AST expression evaluator in core/calculator.py (zero eval).</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                  <span>Analytical equation solvers (quadratic, linear, Cramer's 2x2 system).</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                  <span>Matrix linear algebra engine (determinant, inverse, adjoint, transpose).</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                  <span>Symbolic and numerical calculus routines with step breakdown.</span>
                </div>
              </div>
            </div>

            {/* Shiva */}
            <div className="bg-[#0E1526] border border-slate-800 rounded-xl p-5 space-y-3 shadow-lg">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-purple-300">
                  Visualization Specialist
                </span>
                <h3 className="text-lg font-bold text-white mt-1.5">Shiva</h3>
                <p className="text-xs text-slate-400 font-mono">Graphics & Empirical Modeling</p>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 mt-0.5 shrink-0" />
                  <span>Embedded Matplotlib canvas integration via FigureCanvasTkAgg.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 mt-0.5 shrink-0" />
                  <span>Multi-curve plotting with asymptotic break detection and tangent analysis.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 mt-0.5 shrink-0" />
                  <span>Descriptive statistics distributions with histograms and Tukey box plots.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 mt-0.5 shrink-0" />
                  <span>Monte Carlo empirical simulations and Law of Large Numbers convergence.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 3: ARCHITECTURE --- */}
      {activeDoc === "architecture" && (
        <div className="bg-[#0E1526] border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Model-View-Controller (MVC) Directory Hierarchy
          </h3>

          <div className="p-4 bg-[#080C16] border border-slate-800 rounded-lg font-mono text-xs text-slate-300 space-y-1">
            <p className="text-[#00D4FF] font-bold">mathlab/</p>
            <p>├── main.py                     # Primary launcher & headless CLI diagnostics</p>
            <p>├── requirements.txt             # Project dependencies (SymPy, NumPy, Matplotlib)</p>
            <p>├── core/                        # COMPUTATION ENGINES (Ramji)</p>
            <p>│   ├── calculator.py            # AST-safe mathematical expression evaluator</p>
            <p>│   ├── equations.py             # Quadratic, linear, and Cramer's simultaneous solver</p>
            <p>│   ├── matrices.py              # Linear algebra transformations, det, & inverse</p>
            <p>│   ├── calculus.py              # Symbolic CAS differentiation & integration</p>
            <p>│   ├── statistics.py            # Descriptive statistics & quartile fences</p>
            <p>│   └── probability.py           # Monte Carlo empirical simulation engine</p>
            <p>├── gui/                         # INTERACTION VIEWS & CONTROLLERS (Madhur)</p>
            <p>│   ├── app.py                   # Master single-window shell & navigation</p>
            <p>│   ├── calculator_view.py       # Scientific keypad & history controller</p>
            <p>│   ├── equations_view.py        # Equation solver view & derivation cards</p>
            <p>│   ├── graphing_view.py         # Multi-curve coordinate canvas view</p>
            <p>│   ├── matrix_view.py           # Matrix input grids & spectral ops</p>
            <p>│   ├── statistics_view.py       # Data analysis & chart embedding</p>
            <p>│   └── probability_view.py      # Monte Carlo convergence controls</p>
            <p>├── visualization/               # GRAPHICS & MATPLOTLIB STUDIO (Shiva)</p>
            <p>│   └── plots.py                 # Matplotlib canvas rendering, 300 DPI exports</p>
            <p>├── database/                    # PERSISTENCE LAYER (Madhur)</p>
            <p>│   └── db.py                    # SQLite schema, parameterized query logger</p>
            <p>└── utils/                       # SHARED UTILITIES & VALIDATION</p>
            <p>    ├── helpers.py               # Unit converter & formatting helpers</p>
            <p>    └── validators.py            # Regex validation & input sanitization</p>
          </div>
        </div>
      )}

      {/* --- TAB 4: REPORT --- */}
      {activeDoc === "report" && (
        <div className="bg-[#0E1526] border border-slate-800 rounded-xl p-6 shadow-xl space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
          <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider text-[#00D4FF]">
            MathLab Academic Project Report Summary
          </h3>
          <p>
            <strong>Project Title:</strong> MathLab — Interactive Mathematical Computing & Visualization System
          </p>
          <p>
            <strong>Engineering Objective:</strong> To construct a self-contained, college-level mathematical computing environment that eliminates black-box obscurity through transparent step-by-step analytical derivations and synchronized visual graphics.
          </p>
          <p>
            <strong>Key Innovation:</strong> The architecture strictly avoids arbitrary code execution risks (<code className="text-rose-300 font-mono">eval()</code>) by parsing mathematical strings through recursive Abstract Syntax Tree (AST) node validation. It provides exact symbolic computation via SymPy alongside high-speed vector numerics via NumPy and publication-grade Matplotlib plotting.
          </p>
        </div>
      )}
    </div>
  );
};
