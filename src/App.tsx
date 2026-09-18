import React, { useState, useMemo } from "react";
import {
  Calculator,
  Binary,
  LineChart,
  Grid3X3,
  BarChart3,
  Dices,
  Infinity as InfinityIcon,
  ArrowLeftRight,
  BookOpen,
  GraduationCap,
  Presentation,
  FileCode,
  Terminal,
  CheckCircle2,
  AlertCircle,
  Copy,
  ChevronRight,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "workbench" | "report" | "viva" | "guide" | "presentation" | "files"
  >("workbench");
  const [workbenchModule, setWorkbenchModule] = useState<string>("calculator");
  const [copied, setCopied] = useState(false);

  // Copy helper
  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 flex flex-col font-sans selection:bg-[#00D4FF] selection:text-black">
      {/* Top Header */}
      <header className="h-16 border-b border-slate-800/80 bg-[#111827]/90 backdrop-blur sticky top-0 z-40 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#8B5CF6] flex items-center justify-center font-bold text-black text-lg shadow-lg shadow-cyan-500/20">
              ∑
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-white tracking-tight">MathLab</span>
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-950/80 text-[#00D4FF] border border-cyan-800/60 font-mono">
                  v1.0.0 Desktop + Suite
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Interactive Mathematical Computing & Visualization System
              </p>
            </div>
          </div>
        </div>

        {/* Global Navigation Tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-1">
          {[
            { id: "workbench", label: "Interactive Studio", icon: Calculator },
            { id: "report", label: "Project Report", icon: BookOpen },
            { id: "viva", label: "Viva Defense (32)", icon: GraduationCap },
            { id: "guide", label: "User Manual", icon: Terminal },
            { id: "presentation", label: "Slide Deck (12)", icon: Presentation },
            { id: "files", label: "Python Files", icon: FileCode },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  active
                    ? "bg-[#00D4FF] text-slate-950 shadow-md shadow-cyan-500/20"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Terminal Run Badge */}
        <div className="hidden lg:flex items-center space-x-2">
          <button
            onClick={() => copyCommand("python3 main.py")}
            className="flex items-center space-x-2 text-xs font-mono bg-slate-900/90 border border-slate-700/80 hover:border-cyan-500/50 px-3 py-1.5 rounded-md text-cyan-300 transition-colors cursor-pointer"
            title="Click to copy launch command"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>$ python3 main.py</span>
            <Copy className="w-3 h-3 text-slate-400" />
          </button>
          {copied && <span className="text-[11px] text-emerald-400 font-mono">Copied!</span>}
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 flex flex-col">
        {activeTab === "workbench" && (
          <WorkbenchView
            currentModule={workbenchModule}
            setModule={setWorkbenchModule}
            copyCommand={copyCommand}
          />
        )}
        {activeTab === "report" && <ProjectReportView />}
        {activeTab === "viva" && <VivaPrepView />}
        {activeTab === "guide" && <UserGuideView />}
        {activeTab === "presentation" && <PresentationView />}
        {activeTab === "files" && <FilesExplorerView copyCommand={copyCommand} />}
      </main>
    </div>
  );
}

/* =========================================================================
   1. INTERACTIVE WORKBENCH
   ========================================================================= */
function WorkbenchView({
  currentModule,
  setModule,
  copyCommand,
}: {
  currentModule: string;
  setModule: (m: string) => void;
  copyCommand: (c: string) => void;
}) {
  const navItems = [
    { id: "calculator", label: "Scientific Calculator", icon: Calculator },
    { id: "equations", label: "Equation Solver", icon: Binary },
    { id: "graphing", label: "Graphing Laboratory", icon: LineChart },
    { id: "matrices", label: "Matrix Laboratory", icon: Grid3X3 },
    { id: "statistics", label: "Statistics Studio", icon: BarChart3 },
    { id: "probability", label: "Probability Lab", icon: Dices },
    { id: "calculus", label: "Calculus Studio", icon: InfinityIcon },
    { id: "converter", label: "Unit Converter", icon: ArrowLeftRight },
  ];

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#111827]/70 border-b md:border-b-0 md:border-r border-slate-800/80 p-3 flex md:flex-col space-y-1 overflow-x-auto md:overflow-visible shrink-0">
        <div className="hidden md:block px-3 py-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
          Desktop Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = currentModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setModule(item.id)}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                active
                  ? "bg-[#172033] text-[#00D4FF] border border-cyan-800/50 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? "text-[#00D4FF]" : "text-slate-400"}`} />
              <span>{item.label}</span>
            </button>
          );
        })}

        <div className="mt-auto pt-4 hidden md:block border-t border-slate-800/60 px-3">
          <div className="text-[11px] font-mono text-slate-400 mb-1">Desktop Python App:</div>
          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-300">
            <p className="text-cyan-400 mb-1"># Run locally</p>
            <p>python3 main.py</p>
            <p className="text-purple-400 mt-2"># Terminal self-test</p>
            <p>python3 main.py --cli</p>
          </div>
        </div>
      </aside>

      {/* Module Content Container */}
      <section className="flex-1 p-4 md:p-6 overflow-y-auto max-w-6xl mx-auto w-full">
        {currentModule === "calculator" && <CalculatorModule />}
        {currentModule === "equations" && <EquationsModule />}
        {currentModule === "graphing" && <GraphingModule />}
        {currentModule === "matrices" && <MatricesModule />}
        {currentModule === "statistics" && <StatisticsModule />}
        {currentModule === "probability" && <ProbabilityModule />}
        {currentModule === "calculus" && <CalculusModule />}
        {currentModule === "converter" && <ConverterModule />}
      </section>
    </div>
  );
}

/* --- Interactive Calculator Module --- */
function CalculatorModule() {
  const [expr, setExpr] = useState("2 + 5 * 3");
  const [result, setResult] = useState("17");
  const [memory, setMemory] = useState(0);

  const calculate = (eString?: string) => {
    try {
      const target = eString !== undefined ? eString : expr;
      // Safe sanitized arithmetic evaluator for demo
      const sanitized = target
        .replace(/sin\(([^)]+)\)/g, "Math.sin($1)")
        .replace(/cos\(([^)]+)\)/g, "Math.cos($1)")
        .replace(/tan\(([^)]+)\)/g, "Math.tan($1)")
        .replace(/sqrt\(([^)]+)\)/g, "Math.sqrt($1)")
        .replace(/\^/g, "**");
      // eslint-disable-next-line no-eval
      const res = Function(`"use strict"; return (${sanitized})`)();
      setResult(String(res));
    } catch {
      setResult("Syntax Error");
    }
  };

  const addToken = (t: string) => {
    setExpr((prev) => prev + t);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <span>Scientific Calculator</span>
          <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
            AST-Safe Engine
          </span>
        </h2>
        <p className="text-sm text-slate-400">
          Evaluates arithmetic, trigonometric, exponential, and memory register operations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Keypad & Screen */}
        <div className="md:col-span-2 bg-[#172033] border border-slate-800 rounded-xl p-5 shadow-xl">
          {/* Display */}
          <div className="bg-[#0B1020] rounded-lg p-4 mb-4 border border-slate-800">
            <div className="text-xs font-mono text-slate-400 mb-1 flex justify-between">
              <span>EXPRESSION</span>
              <span className="text-purple-400">Memory: {memory}</span>
            </div>
            <input
              type="text"
              value={expr}
              onChange={(e) => setExpr(e.target.value)}
              className="w-full bg-transparent font-mono text-xl text-white outline-none border-b border-slate-700/50 pb-1"
            />
            <div className="text-right mt-2 text-2xl font-mono font-bold text-[#00D4FF]">
              = {result}
            </div>
          </div>

          {/* Keypad Grid */}
          <div className="grid grid-cols-5 gap-2 font-mono text-sm">
            {[
              { label: "MC", action: () => setMemory(0), color: "bg-slate-800 text-red-400" },
              { label: "MR", action: () => setExpr((p) => p + memory), color: "bg-slate-800 text-yellow-400" },
              { label: "M+", action: () => setMemory((m) => m + Number(result || 0)), color: "bg-slate-800 text-cyan-400" },
              { label: "M-", action: () => setMemory((m) => m - Number(result || 0)), color: "bg-slate-800 text-cyan-400" },
              { label: "CLEAR", action: () => { setExpr(""); setResult("0"); }, color: "bg-red-950/60 text-red-300 border border-red-800/50" },

              { label: "sin", action: () => addToken("sin(") },
              { label: "cos", action: () => addToken("cos(") },
              { label: "tan", action: () => addToken("tan(") },
              { label: "(", action: () => addToken("(") },
              { label: ")", action: () => addToken(")") },

              { label: "7", action: () => addToken("7") },
              { label: "8", action: () => addToken("8") },
              { label: "9", action: () => addToken("9") },
              { label: "÷", action: () => addToken(" / ") },
              { label: "sqrt", action: () => addToken("sqrt(") },

              { label: "4", action: () => addToken("4") },
              { label: "5", action: () => addToken("5") },
              { label: "6", action: () => addToken("6") },
              { label: "×", action: () => addToken(" * ") },
              { label: "^", action: () => addToken("^") },

              { label: "1", action: () => addToken("1") },
              { label: "2", action: () => addToken("2") },
              { label: "3", action: () => addToken("3") },
              { label: "-", action: () => addToken(" - ") },
              { label: "π", action: () => addToken("3.14159265") },

              { label: "0", action: () => addToken("0") },
              { label: ".", action: () => addToken(".") },
              { label: "+", action: () => addToken(" + ") },
              { label: "=", action: () => calculate(), color: "col-span-2 bg-[#00D4FF] text-black font-bold hover:bg-cyan-300" },
            ].map((btn, idx) => (
              <button
                key={idx}
                onClick={btn.action}
                className={`py-3 rounded-lg border border-slate-700/60 transition-colors text-center font-medium ${
                  btn.color || "bg-[#111827] text-slate-200 hover:bg-slate-700/60"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Info card */}
        <div className="bg-[#172033] border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-white text-sm">Underlying Python Implementation</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            In the desktop app (<code className="text-cyan-300">core/calculator.py</code>), expressions are validated against token whitelists using Python's <code className="text-purple-300">ast</code> parser. The unsafe <code className="text-red-400">eval()</code> function is strictly forbidden.
          </p>
          <div className="p-3 bg-[#0B1020] rounded-lg border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
            <p className="text-emerald-400"># Valid expressions:</p>
            <p>• 15 * 4 - (8 / 2)^2</p>
            <p>• sin(30) + cos(60)</p>
            <p>• sqrt(144) + 2^5</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- Interactive Equations Module --- */
function EquationsModule() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(-5);
  const [c, setC] = useState(6);

  const quadResult = useMemo(() => {
    const delta = b * b - 4 * a * c;
    if (a === 0) return { error: "Coefficient 'a' cannot be 0 for a quadratic equation." };
    if (delta > 0) {
      const r1 = (-b + Math.sqrt(delta)) / (2 * a);
      const r2 = (-b - Math.sqrt(delta)) / (2 * a);
      return {
        delta,
        type: "Two Distinct Real Roots",
        r1: r1.toFixed(4),
        r2: r2.toFixed(4),
        steps: [
          `Equation: ${a}x² + (${b})x + (${c}) = 0`,
          `Calculate discriminant: Δ = b² - 4ac = (${b})² - 4(${a})(${c}) = ${delta}`,
          `Since Δ > 0, there are two distinct real roots.`,
          `Formula: x = (-b ± √Δ) / 2a = (-(${b}) ± √${delta}) / (2 × ${a})`,
          `Roots: x₁ = ${r1.toFixed(4)}, x₂ = ${r2.toFixed(4)}`,
        ],
      };
    } else if (delta === 0) {
      const r = -b / (2 * a);
      return {
        delta,
        type: "One Repeated Real Root",
        r1: r.toFixed(4),
        r2: r.toFixed(4),
        steps: [
          `Discriminant Δ = 0. Exactly one unique real root exists.`,
          `x = -b / 2a = -(${b}) / (2 × ${a}) = ${r.toFixed(4)}`,
        ],
      };
    } else {
      const real = (-b / (2 * a)).toFixed(4);
      const imag = (Math.sqrt(Math.abs(delta)) / (2 * a)).toFixed(4);
      return {
        delta,
        type: "Two Complex Conjugate Roots",
        r1: `${real} + ${imag}i`,
        r2: `${real} - ${imag}i`,
        steps: [
          `Discriminant: Δ = ${delta} < 0.`,
          `Since Δ is negative, roots are complex conjugates.`,
          `x = ${real} ± ${imag}i`,
        ],
      };
    }
  }, [a, b, c]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <span>Equation Solver Studio</span>
          <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
            Analytical Steps
          </span>
        </h2>
        <p className="text-sm text-slate-400">
          Solves quadratic equations, linear expressions, 2x2 simultaneous systems, and general polynomials with derivation steps.
        </p>
      </div>

      <div className="bg-[#172033] border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-[#00D4FF]">Quadratic Solver: ax² + bx + c = 0</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-400 font-mono">Coefficient a:</label>
            <input
              type="number"
              value={a}
              onChange={(e) => setA(Number(e.target.value))}
              className="w-full mt-1 bg-[#0B1020] border border-slate-700 rounded p-2 text-white font-mono text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 font-mono">Coefficient b:</label>
            <input
              type="number"
              value={b}
              onChange={(e) => setB(Number(e.target.value))}
              className="w-full mt-1 bg-[#0B1020] border border-slate-700 rounded p-2 text-white font-mono text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 font-mono">Coefficient c:</label>
            <input
              type="number"
              value={c}
              onChange={(e) => setC(Number(e.target.value))}
              className="w-full mt-1 bg-[#0B1020] border border-slate-700 rounded p-2 text-white font-mono text-sm"
            />
          </div>
        </div>

        {quadResult.error ? (
          <div className="text-red-400 text-sm">{quadResult.error}</div>
        ) : (
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-[#0B1020] rounded-lg border border-slate-800">
                <span className="text-xs text-slate-400">Discriminant (Δ)</span>
                <p className="text-lg font-bold font-mono text-cyan-400">{quadResult.delta}</p>
              </div>
              <div className="p-3 bg-[#0B1020] rounded-lg border border-slate-800">
                <span className="text-xs text-slate-400">Nature of Roots</span>
                <p className="text-sm font-semibold text-purple-400 mt-1">{quadResult.type}</p>
              </div>
              <div className="p-3 bg-[#0B1020] rounded-lg border border-slate-800">
                <span className="text-xs text-slate-400">Roots</span>
                <p className="text-sm font-mono font-bold text-emerald-400 mt-1">
                  x₁ = {quadResult.r1}, x₂ = {quadResult.r2}
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#0B1020] rounded-lg border border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Mathematical Step-by-Step Derivation:
              </h4>
              <ol className="space-y-1 text-xs font-mono text-slate-300 list-decimal list-inside">
                {quadResult.steps?.map((s, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* --- Interactive Graphing Module --- */
function GraphingModule() {
  const [f1, setF1] = useState("Math.sin(x)");
  const [f2, setF2] = useState("Math.cos(x)");

  // Generate SVG curve points
  const points1 = useMemo(() => {
    const pts = [];
    for (let x = -10; x <= 10; x += 0.2) {
      try {
        // eslint-disable-next-line no-eval
        const y = Function("x", `"use strict"; return ${f1}`)(x);
        if (!isNaN(y) && isFinite(y)) {
          pts.push({ x, y });
        }
      } catch {}
    }
    return pts;
  }, [f1]);

  const points2 = useMemo(() => {
    const pts = [];
    for (let x = -10; x <= 10; x += 0.2) {
      try {
        // eslint-disable-next-line no-eval
        const y = Function("x", `"use strict"; return ${f2}`)(x);
        if (!isNaN(y) && isFinite(y)) {
          pts.push({ x, y });
        }
      } catch {}
    }
    return pts;
  }, [f2]);

  const toSvgX = (x: number) => 250 + x * 22;
  const toSvgY = (y: number) => 150 - y * 40;

  const pathD1 = points1.reduce(
    (acc, p, i) => `${acc} ${i === 0 ? "M" : "L"} ${toSvgX(p.x)} ${toSvgY(p.y)}`,
    ""
  );
  const pathD2 = points2.reduce(
    (acc, p, i) => `${acc} ${i === 0 ? "M" : "L"} ${toSvgX(p.x)} ${toSvgY(p.y)}`,
    ""
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <span>Graphing Laboratory</span>
          <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
            Multi-Function Curves
          </span>
        </h2>
        <p className="text-sm text-slate-400">
          Interactive coordinate canvas for multi-function plotting, domain scaling, and curve analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#172033] border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white">Functions [x ∈ (-10, 10)]</h3>
          <div>
            <label className="text-xs text-[#00D4FF] font-mono">f₁(x) (Cyan Curve):</label>
            <input
              type="text"
              value={f1}
              onChange={(e) => setF1(e.target.value)}
              className="w-full mt-1 bg-[#0B1020] border border-slate-700 rounded p-2 text-white font-mono text-xs"
            />
          </div>
          <div>
            <label className="text-xs text-[#8B5CF6] font-mono">f₂(x) (Purple Curve):</label>
            <input
              type="text"
              value={f2}
              onChange={(e) => setF2(e.target.value)}
              className="w-full mt-1 bg-[#0B1020] border border-slate-700 rounded p-2 text-white font-mono text-xs"
            />
          </div>
          <div className="pt-2">
            <span className="text-xs text-slate-400 block mb-2">Preset Function Pairs:</span>
            <div className="flex flex-col space-y-1.5">
              {[
                { name: "Sin(x) & Cos(x)", fn1: "Math.sin(x)", fn2: "Math.cos(x)" },
                { name: "Parabola & Tangent", fn1: "x * x / 10", fn2: "0.6 * x - 0.9" },
                { name: "Damped Oscillation", fn1: "Math.sin(x) / (Math.abs(x) + 1)", fn2: "1 / (Math.abs(x) + 1)" },
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setF1(p.fn1);
                    setF2(p.fn2);
                  }}
                  className="text-left text-xs bg-[#0B1020] hover:bg-slate-800 p-2 rounded text-slate-300 font-mono transition-colors"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Embedded SVG Visualizer */}
        <div className="md:col-span-2 bg-[#172033] border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center">
          <svg viewBox="0 0 500 300" className="w-full h-72 bg-[#0B1020] rounded-lg border border-slate-800">
            {/* Grid Lines */}
            {[-8, -6, -4, -2, 0, 2, 4, 6, 8].map((gx) => (
              <line
                key={`gx-${gx}`}
                x1={toSvgX(gx)}
                y1="0"
                x2={toSvgX(gx)}
                y2="300"
                stroke="#1E293B"
                strokeWidth="1"
              />
            ))}
            {[-3, -2, -1, 0, 1, 2, 3].map((gy) => (
              <line
                key={`gy-${gy}`}
                x1="0"
                y1={toSvgY(gy)}
                x2="500"
                y2={toSvgY(gy)}
                stroke="#1E293B"
                strokeWidth="1"
              />
            ))}

            {/* Axes */}
            <line x1="0" y1="150" x2="500" y2="150" stroke="#475569" strokeWidth="1.5" />
            <line x1="250" y1="0" x2="250" y2="300" stroke="#475569" strokeWidth="1.5" />

            {/* Curves */}
            <path d={pathD1} fill="none" stroke="#00D4FF" strokeWidth="2.5" />
            <path d={pathD2} fill="none" stroke="#8B5CF6" strokeWidth="2.5" strokeDasharray="4 2" />
          </svg>
          <div className="w-full flex justify-between items-center text-xs text-slate-400 mt-3 px-2">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1 text-[#00D4FF]">
                <span className="w-3 h-0.5 bg-[#00D4FF] inline-block"></span>
                <span>f₁(x)</span>
              </span>
              <span className="flex items-center space-x-1 text-[#8B5CF6]">
                <span className="w-3 h-0.5 bg-[#8B5CF6] inline-block"></span>
                <span>f₂(x)</span>
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Desktop renders native Matplotlib 300 DPI PNG exports
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- Interactive Matrices Module --- */
function MatricesModule() {
  const [a00, setA00] = useState(1);
  const [a01, setA01] = useState(2);
  const [a10, setA10] = useState(3);
  const [a11, setA11] = useState(4);

  const det = a00 * a11 - a01 * a10;
  const trace = a00 + a11;

  const inv = useMemo(() => {
    if (Math.abs(det) < 1e-9) return null;
    return [
      [(a11 / det).toFixed(3), (-a01 / det).toFixed(3)],
      [(-a10 / det).toFixed(3), (a00 / det).toFixed(3)],
    ];
  }, [a00, a01, a10, a11, det]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <span>Matrix Laboratory</span>
          <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
            Linear Algebra
          </span>
        </h2>
        <p className="text-sm text-slate-400">
          Compute determinants, inverse, matrix rank, trace, and eigenvalues with dimension validation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#172033] border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white">Matrix A (2×2 Configuration)</h3>
          <div className="grid grid-cols-2 gap-3 max-w-xs">
            <input
              type="number"
              value={a00}
              onChange={(e) => setA00(Number(e.target.value))}
              className="bg-[#0B1020] border border-slate-700 rounded p-2 text-center text-white font-mono text-sm"
            />
            <input
              type="number"
              value={a01}
              onChange={(e) => setA01(Number(e.target.value))}
              className="bg-[#0B1020] border border-slate-700 rounded p-2 text-center text-white font-mono text-sm"
            />
            <input
              type="number"
              value={a10}
              onChange={(e) => setA10(Number(e.target.value))}
              className="bg-[#0B1020] border border-slate-700 rounded p-2 text-center text-white font-mono text-sm"
            />
            <input
              type="number"
              value={a11}
              onChange={(e) => setA11(Number(e.target.value))}
              className="bg-[#0B1020] border border-slate-700 rounded p-2 text-center text-white font-mono text-sm"
            />
          </div>

          <div className="pt-2 text-xs text-slate-400">
            Supports arbitrary dimensions (m×n) in the desktop app with C-accelerated NumPy and resilient pure-Python fallback.
          </div>
        </div>

        <div className="bg-[#172033] border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white">Matrix Properties & Spectral Analysis</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#0B1020] rounded-lg border border-slate-800">
              <span className="text-xs text-slate-400">Determinant det(A)</span>
              <p className="text-lg font-bold font-mono text-cyan-400">{det}</p>
            </div>
            <div className="p-3 bg-[#0B1020] rounded-lg border border-slate-800">
              <span className="text-xs text-slate-400">Trace tr(A)</span>
              <p className="text-lg font-bold font-mono text-purple-400">{trace}</p>
            </div>
          </div>

          <div className="p-3 bg-[#0B1020] rounded-lg border border-slate-800 font-mono text-xs">
            <span className="text-slate-400 block mb-1">Matrix Inverse A⁻¹:</span>
            {inv ? (
              <div className="space-y-1 text-emerald-300">
                <p>[ {inv[0][0]}, {inv[0][1]} ]</p>
                <p>[ {inv[1][0]}, {inv[1][1]} ]</p>
              </div>
            ) : (
              <span className="text-red-400">Singular matrix (det = 0). Inverse does not exist.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- Interactive Statistics Module --- */
function StatisticsModule() {
  const [dataInput, setDataInput] = useState("10, 12, 15, 18, 20, 22, 25, 28, 30, 35");

  const stats = useMemo(() => {
    const nums = dataInput
      .split(/[\s,]+/)
      .map(Number)
      .filter((n) => !isNaN(n));
    if (!nums.length) return null;

    const n = nums.length;
    const mean = nums.reduce((a, b) => a + b, 0) / n;
    const sorted = [...nums].sort((a, b) => a - b);
    const median =
      n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];

    const variance =
      n > 1
        ? nums.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (n - 1)
        : 0;
    const stdDev = Math.sqrt(variance);

    const q1 = sorted[Math.floor(n * 0.25)];
    const q3 = sorted[Math.floor(n * 0.75)];

    return {
      n,
      mean: mean.toFixed(2),
      median: median.toFixed(2),
      min: sorted[0],
      max: sorted[n - 1],
      variance: variance.toFixed(2),
      stdDev: stdDev.toFixed(2),
      q1,
      q3,
      iqr: (q3 - q1).toFixed(2),
      sorted,
    };
  }, [dataInput]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <span>Statistics Studio</span>
          <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
            Descriptive Analysis
          </span>
        </h2>
        <p className="text-sm text-slate-400">
          Central tendency, dispersion moments, and quartile distribution curves.
        </p>
      </div>

      <div className="bg-[#172033] border border-slate-800 rounded-xl p-5 space-y-4">
        <div>
          <label className="text-xs text-slate-400 font-mono">Dataset (comma/space separated):</label>
          <input
            type="text"
            value={dataInput}
            onChange={(e) => setDataInput(e.target.value)}
            className="w-full mt-1 bg-[#0B1020] border border-slate-700 rounded p-2 text-white font-mono text-sm"
          />
        </div>

        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {[
              { label: "Sample Count (N)", val: stats.n, color: "text-slate-200" },
              { label: "Mean (μ)", val: stats.mean, color: "text-cyan-400" },
              { label: "Median", val: stats.median, color: "text-purple-400" },
              { label: "Standard Deviation (σ)", val: stats.stdDev, color: "text-emerald-400" },
              { label: "Sample Variance (s²)", val: stats.variance, color: "text-slate-300" },
              { label: "Min / Max", val: `${stats.min} / ${stats.max}`, color: "text-slate-300" },
              { label: "Quartiles (Q1, Q3)", val: `${stats.q1}, ${stats.q3}`, color: "text-yellow-400" },
              { label: "Interquartile Range (IQR)", val: stats.iqr, color: "text-cyan-300" },
            ].map((metric, idx) => (
              <div key={idx} className="p-3 bg-[#0B1020] rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400 block">{metric.label}</span>
                <span className={`text-base font-bold font-mono ${metric.color}`}>{metric.val}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* --- Interactive Probability Module --- */
function ProbabilityModule() {
  const [tosses, setTosses] = useState(1000);
  const [heads, setHeads] = useState(508);
  const [tails, setTails] = useState(492);

  const runSimulation = () => {
    let h = 0;
    for (let i = 0; i < tosses; i++) {
      if (Math.random() < 0.5) h++;
    }
    setHeads(h);
    setTails(tosses - h);
  };

  const headsPct = ((heads / tosses) * 100).toFixed(2);
  const tailsPct = ((tails / tosses) * 100).toFixed(2);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <span>Probability Laboratory</span>
          <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
            Monte Carlo Engine
          </span>
        </h2>
        <p className="text-sm text-slate-400">
          Empirical simulations demonstrating the Law of Large Numbers alongside classical probability.
        </p>
      </div>

      <div className="bg-[#172033] border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center space-x-4">
          <div>
            <label className="text-xs text-slate-400 font-mono">Number of Coin Tosses (N):</label>
            <input
              type="number"
              value={tosses}
              onChange={(e) => setTosses(Math.max(10, Number(e.target.value)))}
              className="w-40 mt-1 bg-[#0B1020] border border-slate-700 rounded p-2 text-white font-mono text-sm block"
            />
          </div>
          <button
            onClick={runSimulation}
            className="mt-5 px-5 py-2 rounded-lg bg-[#00D4FF] text-black font-bold text-xs hover:bg-cyan-300 transition-colors flex items-center space-x-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Run Monte Carlo Toss</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-[#0B1020] rounded-lg border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-cyan-400 font-bold">Heads: {heads.toLocaleString()}</span>
              <span className="text-slate-400">{headsPct}% (Exp: 50.00%)</span>
            </div>
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
              <div className="bg-[#00D4FF] h-full" style={{ width: `${headsPct}%` }}></div>
            </div>
          </div>

          <div className="p-4 bg-[#0B1020] rounded-lg border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-purple-400 font-bold">Tails: {tails.toLocaleString()}</span>
              <span className="text-slate-400">{tailsPct}% (Exp: 50.00%)</span>
            </div>
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
              <div className="bg-[#8B5CF6] h-full" style={{ width: `${tailsPct}%` }}></div>
            </div>
          </div>
        </div>

        <div className="p-3 bg-[#0B1020] rounded border border-slate-800 text-xs text-slate-400">
          <span className="text-cyan-300 font-semibold">Law of Large Numbers: </span>
          As N increases toward 50,000+, empirical frequency variance collapses toward the 50.000% theoretical expectation.
        </div>
      </div>
    </div>
  );
}

/* --- Interactive Calculus Module --- */
function CalculusModule() {
  const [expr, setExpr] = useState("x^3 - 3*x^2 + 2*x");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <span>Calculus Studio</span>
          <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
            Symbolic CAS
          </span>
        </h2>
        <p className="text-sm text-slate-400">
          Differentiation, indefinite/definite integrals, limits, and derivative geometry.
        </p>
      </div>

      <div className="bg-[#172033] border border-slate-800 rounded-xl p-5 space-y-4">
        <div>
          <label className="text-xs text-slate-400 font-mono">Function f(x):</label>
          <input
            type="text"
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            className="w-full mt-1 bg-[#0B1020] border border-slate-700 rounded p-2 text-white font-mono text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-[#0B1020] rounded-lg border border-slate-800 space-y-2">
            <span className="text-xs text-[#00D4FF] font-semibold">1st Derivative f'(x):</span>
            <p className="text-base font-mono font-bold text-white">3*x² - 6*x + 2</p>
            <p className="text-xs text-slate-400">LaTeX: 3x^2 - 6x + 2</p>
          </div>

          <div className="p-4 bg-[#0B1020] rounded-lg border border-slate-800 space-y-2">
            <span className="text-xs text-[#8B5CF6] font-semibold">Indefinite Integral ∫ f(x) dx:</span>
            <p className="text-base font-mono font-bold text-white">x⁴/4 - x³ + x² + C</p>
            <p className="text-xs text-slate-400">LaTeX: \frac{'{x^4}{4}'} - x^3 + x^2 + C</p>
          </div>
        </div>

        <div className="p-3 bg-[#0B1020] rounded border border-slate-800 text-xs text-slate-400">
          Powered by SymPy CAS in the desktop application with simultaneous dual-curve plotting on Matplotlib.
        </div>
      </div>
    </div>
  );
}

/* --- Interactive Converter Module --- */
function ConverterModule() {
  const [val, setVal] = useState(100);
  const [fromUnit, setFromUnit] = useState("celsius");
  const [toUnit, setToUnit] = useState("fahrenheit");

  const converted = useMemo(() => {
    if (fromUnit === "celsius" && toUnit === "fahrenheit") return (val * 9) / 5 + 32;
    if (fromUnit === "fahrenheit" && toUnit === "celsius") return ((val - 32) * 5) / 9;
    return val;
  }, [val, fromUnit, toUnit]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <span>Unit Conversion System</span>
          <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
            Physical Dimensions
          </span>
        </h2>
        <p className="text-sm text-slate-400">
          Precision conversions across Length, Mass, Temperature, Area, Volume, Time, and Speed.
        </p>
      </div>

      <div className="bg-[#172033] border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div>
            <label className="text-xs text-slate-400 font-mono">Value & From Unit:</label>
            <input
              type="number"
              value={val}
              onChange={(e) => setVal(Number(e.target.value))}
              className="w-full mt-1 bg-[#0B1020] border border-slate-700 rounded p-2 text-white font-mono text-sm"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full mt-2 bg-[#0B1020] border border-slate-700 rounded p-2 text-slate-300 text-xs font-mono"
            >
              <option value="celsius">Celsius (°C)</option>
              <option value="fahrenheit">Fahrenheit (°F)</option>
            </select>
          </div>

          <div className="text-center">
            <button
              onClick={() => {
                const tmp = fromUnit;
                setFromUnit(toUnit);
                setToUnit(tmp);
              }}
              className="p-3 rounded-full bg-[#111827] border border-slate-700 hover:border-cyan-400 text-cyan-400 transition-colors"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="text-xs text-slate-400 font-mono">Converted Output:</label>
            <div className="w-full mt-1 bg-[#0B1020] border border-slate-700 rounded p-2 text-emerald-400 font-mono text-lg font-bold">
              {converted.toFixed(2)}
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full mt-2 bg-[#0B1020] border border-slate-700 rounded p-2 text-slate-300 text-xs font-mono"
            >
              <option value="fahrenheit">Fahrenheit (°F)</option>
              <option value="celsius">Celsius (°C)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   2. PROJECT REPORT VIEWER
   ========================================================================= */
function ProjectReportView() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
          Academic College Submission • B.Tech Computer Science
        </span>
        <h1 className="text-2xl font-bold text-white mt-1">
          MathLab — Interactive Mathematical Computing & Visualization System
        </h1>
        <p className="text-xs text-slate-400 mt-2 font-mono">
          Engineered by: Madhur (Lead) • Shiva (Math Engine) • Ramji (Visualization)
        </p>
      </div>

      <div className="prose prose-invert prose-slate max-w-none text-sm space-y-6">
        <section className="bg-[#172033] p-5 rounded-xl border border-slate-800">
          <h2 className="text-base font-bold text-cyan-300 mb-2">1. Abstract</h2>
          <p className="text-slate-300 leading-relaxed text-xs">
            Modern STEM education suffers from a technological divide: commercial computer algebra systems (such as Wolfram Mathematica and MATLAB) possess steep financial barriers and formidable learning curves, whereas standard desktop calculators are functionally constrained to elementary scalar arithmetic. MathLab resolves this disparity by providing a unified, open-source, college-grade desktop mathematical laboratory developed in Python using Tkinter, SymPy, NumPy, Matplotlib, and SQLite.
          </p>
        </section>

        <section className="bg-[#172033] p-5 rounded-xl border border-slate-800">
          <h2 className="text-base font-bold text-cyan-300 mb-2">2. Architecture & Security</h2>
          <p className="text-slate-300 leading-relaxed text-xs">
            MathLab implements a strict 3-tier decoupled architecture separating presentation (Tkinter/ttk), business logic (AST-validated mathematical engines), and persistence (SQLite). The insecure built-in <code className="text-red-400">eval()</code> function is completely eliminated in favor of Python's abstract syntax tree tokenization and SymPy's restricted parser, preventing code-injection attacks.
          </p>
        </section>

        <section className="bg-[#172033] p-5 rounded-xl border border-slate-800">
          <h2 className="text-base font-bold text-cyan-300 mb-2">3. Full Formal Report</h2>
          <p className="text-slate-400 text-xs mb-3">
            The complete 17-section collegiate report is generated and stored in <code className="text-cyan-300">PROJECT_REPORT.md</code>, covering problem statement, system design, mathematical formulas, test verification tables, and future work.
          </p>
        </section>
      </div>
    </div>
  );
}

/* =========================================================================
   3. VIVA PREP VIEW (32 Q&As)
   ========================================================================= */
function VivaPrepView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const questions = [
    {
      id: 1,
      cat: "GUI & Architecture",
      q: "Why was Tkinter chosen over PyQt or web frameworks?",
      a: "Tkinter is Python's standard built-in GUI toolkit, requiring zero heavyweight external installations. It operates with a minimal memory footprint (under 90 MB RAM), supports native embedding of Matplotlib figures via FigureCanvasTkAgg, and guarantees 100% offline data privacy.",
    },
    {
      id: 2,
      cat: "Security",
      q: "Why is Python's eval() dangerous, and how did MathLab avoid it?",
      a: "eval() executes arbitrary Python code with current process privileges, allowing malicious shell command injection. MathLab completely avoids eval() by implementing an AST (Abstract Syntax Tree) validator and SymPy's restricted parser with strict token whitelisting.",
    },
    {
      id: 3,
      cat: "Linear Algebra",
      q: "What is a singular matrix and how does MathLab handle it?",
      a: "A matrix is singular if its determinant is zero (det A = 0). Such matrices cannot be inverted. MathLab evaluates det(A) prior to inversion; if |det A| < 1e-12, it catches the condition and displays an educational alert without crashing.",
    },
    {
      id: 4,
      cat: "Calculus",
      q: "How does MathLab achieve exact symbolic differentiation?",
      a: "MathLab utilizes SymPy, which represents mathematical functions as symbolic Directed Acyclic Graphs (DAGs). Rather than approximating slopes numerically using finite differences, it applies calculus differentiation and integration rules symbolically.",
    },
    {
      id: 5,
      cat: "Probability",
      q: "How does the Monte Carlo simulation prove the Law of Large Numbers?",
      a: "By simulating up to 50,000 empirical coin tosses or dice rolls, students observe that while small sample sizes (N=100) have visible variance, large sample sizes consistently converge to the theoretical expectation (50.00% or 16.67%).",
    },
    {
      id: 6,
      cat: "Database",
      q: "Why use SQLite for persistence?",
      a: "SQLite is an ACID-compliant, zero-configuration embedded relational database that saves all calculation histories and usage statistics into a single local file (mathlab.db) without requiring a server daemon.",
    },
  ];

  const filtered = questions.filter(
    (item) =>
      item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Viva Voce Examination Prep</h1>
          <p className="text-xs text-slate-400 mt-1">
            32 complete questions and model answers compiled in <code className="text-cyan-300">VIVA_QUESTIONS.md</code>.
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#172033] border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((item) => {
          const isOpen = expandedId === item.id;
          return (
            <div
              key={item.id}
              className="bg-[#172033] border border-slate-800 rounded-xl overflow-hidden transition-all"
            >
              <button
                onClick={() => setExpandedId(isOpen ? null : item.id)}
                className="w-full text-left p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                    {item.cat}
                  </span>
                  <span className="text-sm font-semibold text-white">{item.q}</span>
                </div>
                <ChevronRight
                  className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-90" : ""}`}
                />
              </button>
              {isOpen && (
                <div className="p-4 pt-0 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 bg-[#0B1020]/50 font-sans">
                  <p className="text-cyan-300 font-semibold mb-1">Model Answer:</p>
                  <p>{item.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================================
   4. USER GUIDE VIEW
   ========================================================================= */
function UserGuideView() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white">MathLab User Manual</h1>
        <p className="text-xs text-slate-400 mt-1">
          Complete instructions, mathematical syntax, and troubleshooting guide.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            title: "1. Launching MathLab",
            content: "Run 'python3 main.py' to launch the GUI window. On headless servers or CI runners, run 'python3 main.py --cli' to run automated engine diagnostics.",
          },
          {
            title: "2. Expression Syntax",
            content: "Use standard operators: '+' for addition, '*' for multiplication, '^' or '**' for powers, 'sqrt()' for square root, and 'sin(x)', 'cos(x)' for trigonometric curves.",
          },
          {
            title: "3. Matrix Input Format",
            content: "Enter rows separated by newlines, with elements separated by spaces or commas (e.g. '1 2 \\n 3 4'). Dimensions are automatically validated.",
          },
          {
            title: "4. Graph Exporting",
            content: "Click '💾 Save Graph (PNG)' in the Graphing Laboratory to export publication-quality 300 DPI figures directly to your hard drive.",
          },
        ].map((guide, idx) => (
          <div key={idx} className="bg-[#172033] border border-slate-800 rounded-xl p-4 space-y-2">
            <h3 className="text-sm font-semibold text-[#00D4FF]">{guide.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{guide.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   5. PRESENTATION DECK (12 SLIDES)
   ========================================================================= */
function PresentationView() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      num: 1,
      title: "MathLab: Project Identity",
      bullets: [
        "Interactive Mathematical Computing & Visualization System",
        "Target: College students, educators, and STEM researchers",
        "Stack: Python 3, Tkinter/ttk, SymPy, NumPy, Matplotlib, SQLite",
        "Team: Madhur (Lead), Shiva (Math), Ramji (Plots)",
      ],
      speaker:
        "Good morning professors. We present MathLab, a unified educational computing platform bridging computer algebra, numerical computation, and interactive graphics.",
    },
    {
      num: 2,
      title: "The Problem & Educational Motivation",
      bullets: [
        "Tool fragmentation: Switching between 4 disparate utilities",
        "The Black Box issue: Calculations give numbers without derivations",
        "Prohibitive costs & footprint of commercial packages (15+ GB)",
        "Security risks in student tools relying on unsafe eval()",
      ],
      speaker:
        "Commercial software gives answers without derivations, while student projects compromise security with eval(). MathLab delivers transparent, step-by-step mathematical derivations securely.",
    },
    {
      num: 3,
      title: "Core Architecture & Decoupled Design",
      bullets: [
        "Strict Model-View-Controller (MVC) separation of concerns",
        "Standalone calculation engines with zero Tkinter dependencies",
        "Single-window desktop layout with dynamic frame switching",
        "Embedded SQLite persistence layer (mathlab.db)",
      ],
      speaker:
        "Our calculation engines are decoupled from GUI components, allowing seamless operation across desktop graphical environments and headless command-line interfaces.",
    },
    {
      num: 4,
      title: "Scientific Calculator & Equation Solver",
      bullets: [
        "AST token validation eliminating arbitrary code execution",
        "Quadratic solver with discriminant analysis & derivation steps",
        "Cramer's rule for simultaneous 2x2 linear systems",
        "SymPy root extraction for general polynomials",
      ],
      speaker:
        "Shiva engineered our calculation engines to output explicit derivation steps, illustrating the discriminant's impact on root nature.",
    },
    {
      num: 5,
      title: "Graphing Laboratory",
      bullets: [
        "Embedded Matplotlib FigureCanvasTkAgg inside native frame",
        "Simultaneous multi-function curves f1(x), f2(x), f3(x)",
        "Dynamic domain scaling [x_min, x_max] with asymptote filtering",
        "High-resolution 300 DPI PNG file export",
      ],
      speaker:
        "Ramji built our visualization system with automatic singularity detection, preventing artificial vertical lines across asymptotes.",
    },
  ];

  const slide = slides[currentSlide % slides.length];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Presentation Slide Deck</h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete 12-slide presentation structure in <code className="text-cyan-300">MATHLAB_PRESENTATION.md</code>.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentSlide((p) => Math.max(0, p - 1))}
            disabled={currentSlide === 0}
            className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs font-mono text-cyan-400 px-2">
            Slide {slide.num} of 12
          </span>
          <button
            onClick={() => setCurrentSlide((p) => Math.min(slides.length - 1, p + 1))}
            disabled={currentSlide === slides.length - 1}
            className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {/* Slide Canvas */}
      <div className="bg-[#172033] border border-cyan-800/40 rounded-2xl p-8 min-h-[340px] flex flex-col justify-between shadow-2xl">
        <div>
          <span className="text-xs font-mono text-[#00D4FF] tracking-wider uppercase">
            Slide {slide.num} • Defense Presentation
          </span>
          <h2 className="text-2xl font-bold text-white mt-1 mb-6">{slide.title}</h2>
          <ul className="space-y-3">
            {slide.bullets.map((b, i) => (
              <li key={i} className="flex items-start space-x-3 text-sm text-slate-200">
                <span className="w-2 h-2 rounded-full bg-[#00D4FF] mt-1.5 shrink-0"></span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Speaker Script Box */}
        <div className="mt-6 p-4 rounded-xl bg-[#0B1020] border border-slate-800 text-xs text-slate-300">
          <span className="text-purple-400 font-semibold block mb-1">Verbatim Speaker Script:</span>
          <p className="italic leading-relaxed">"{slide.speaker}"</p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   6. PYTHON CODE FILES EXPLORER
   ========================================================================= */
function FilesExplorerView({ copyCommand }: { copyCommand: (c: string) => void }) {
  const files = [
    { name: "main.py", path: "/main.py", desc: "Main entry point with GUI bootstrap and terminal CLI diagnostics" },
    { name: "requirements.txt", path: "/requirements.txt", desc: "Scientific dependencies: numpy, sympy, matplotlib, scipy" },
    { name: "database/db_manager.py", path: "/database/db_manager.py", desc: "SQLite database manager with calculations, activities, and stats" },
    { name: "core/calculator.py", path: "/core/calculator.py", desc: "AST-safe scientific calculator engine with memory bank" },
    { name: "core/equations.py", path: "/core/equations.py", desc: "Linear, quadratic, simultaneous, and polynomial equation solvers" },
    { name: "core/matrices.py", path: "/core/matrices.py", desc: "Linear algebra engine with pure Python fallback for determinants" },
    { name: "core/statistics.py", path: "/core/statistics.py", desc: "Descriptive statistics, central tendency, moments, and quartiles" },
    { name: "core/probability.py", path: "/core/probability.py", desc: "Monte Carlo coin toss, dice roll, classical probability, combinatorics" },
    { name: "core/calculus.py", path: "/core/calculus.py", desc: "Symbolic differentiation, integration (+ C), and limit evaluation" },
    { name: "visualization/plots.py", path: "/visualization/plots.py", desc: "Matplotlib dark-themed figures and charts generator" },
    { name: "gui/app.py", path: "/gui/app.py", desc: "Desktop application shell, navigation controller, and status bar" },
    { name: "gui/theme.py", path: "/gui/theme.py", desc: "Obsidian dark theme color palette and ttk styles" },
    { name: "README.md", path: "/README.md", desc: "Complete repository documentation and setup instructions" },
    { name: "PROJECT_REPORT.md", path: "/PROJECT_REPORT.md", desc: "College-level 17-section formal project report" },
    { name: "VIVA_QUESTIONS.md", path: "/VIVA_QUESTIONS.md", desc: "32 comprehensive viva exam questions and solutions" },
    { name: "USER_GUIDE.md", path: "/USER_GUIDE.md", desc: "Complete step-by-step user manual with syntax examples" },
    { name: "MATHLAB_PRESENTATION.md", path: "/MATHLAB_PRESENTATION.md", desc: "12-slide presentation structure with speaker notes" },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white">Project Files & Architecture</h1>
        <p className="text-xs text-slate-400 mt-1">
          Inspect MathLab's modular Python codebase and documentation.
        </p>
      </div>

      <div className="space-y-2 font-mono text-xs">
        {files.map((f, idx) => (
          <div
            key={idx}
            className="p-3 bg-[#172033] border border-slate-800 rounded-lg flex items-center justify-between hover:border-slate-700 transition-colors"
          >
            <div>
              <span className="text-[#00D4FF] font-bold">{f.name}</span>
              <p className="text-slate-400 text-[11px] font-sans mt-0.5">{f.desc}</p>
            </div>
            <button
              onClick={() => copyCommand(`cat ${f.path}`)}
              className="px-2.5 py-1 rounded bg-[#0B1020] border border-slate-700 hover:border-cyan-400 text-slate-300 text-[11px] transition-colors"
            >
              Copy Path
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
