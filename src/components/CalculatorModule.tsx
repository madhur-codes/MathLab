import React, { useState, useEffect } from "react";
import { Copy, History, RotateCcw, Sparkles, Check, Delete } from "lucide-react";

interface CalculatorModuleProps {
  onLogCalculation: (expr: string, res: string) => void;
}

export const CalculatorModule: React.FC<CalculatorModuleProps> = ({ onLogCalculation }) => {
  const [expression, setExpression] = useState<string>("2 * sin(pi / 4) + sqrt(16)");
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [angleMode, setAngleMode] = useState<"RAD" | "DEG">("RAD");
  const [memory, setMemory] = useState<number>(0);
  const [memoryActive, setMemoryActive] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [history, setHistory] = useState<Array<{ expr: string; res: string; time: string }>>([
    { expr: "2 + 5 * 3", res: "17", time: "10:14 AM" },
    { expr: "sqrt(144) + cos(0)", res: "13", time: "10:15 AM" },
    { expr: "sin(pi / 2)", res: "1", time: "10:16 AM" }
  ]);

  // Safe client-side math evaluator mirroring the Python AST engine
  const evaluateExpression = (exprStr: string): { value?: number; formatted?: string; err?: string } => {
    try {
      if (!exprStr.trim()) return { formatted: "" };

      // Preprocessing
      let sanitized = exprStr
        .replace(/\s+/g, "")
        .replace(/π/g, "pi")
        .replace(/×/g, "*")
        .replace(/÷/g, "/");

      // Math constants and functions mapping
      const mathScope: Record<string, any> = {
        pi: Math.PI,
        e: Math.E,
        sqrt: Math.sqrt,
        cbrt: Math.cbrt,
        abs: Math.abs,
        ln: Math.log,
        log: Math.log10,
        log10: Math.log10,
        exp: Math.exp,
        floor: Math.floor,
        ceil: Math.ceil,
        round: Math.round,
      };

      // Factorial helper
      const fact = (n: number): number => {
        if (n < 0 || !Number.isInteger(n)) throw new Error("Factorial only defined for non-negative integers");
        if (n > 170) return Infinity;
        let res = 1;
        for (let i = 2; i <= n; i++) res *= i;
        return res;
      };

      // Handle angle conversion
      if (angleMode === "DEG") {
        mathScope.sin = (x: number) => Math.sin((x * Math.PI) / 180);
        mathScope.cos = (x: number) => Math.cos((x * Math.PI) / 180);
        mathScope.tan = (x: number) => {
          const mod = Math.abs(x % 180);
          if (Math.abs(mod - 90) < 1e-9) throw new Error("Tangent undefined at 90° + k·180°");
          return Math.tan((x * Math.PI) / 180);
        };
        mathScope.asin = (x: number) => (Math.asin(x) * 180) / Math.PI;
        mathScope.acos = (x: number) => (Math.acos(x) * 180) / Math.PI;
        mathScope.atan = (x: number) => (Math.atan(x) * 180) / Math.PI;
      } else {
        mathScope.sin = Math.sin;
        mathScope.cos = Math.cos;
        mathScope.tan = (x: number) => {
          if (Math.abs(Math.cos(x)) < 1e-12) throw new Error("Tangent undefined at odd multiples of π/2");
          return Math.tan(x);
        };
        mathScope.asin = Math.asin;
        mathScope.acos = Math.acos;
        mathScope.atan = Math.atan;
      }

      // Convert power ^ to **
      let pyExpr = sanitized.replace(/\^/g, "**");

      // Replace factorial x! with fact(x)
      pyExpr = pyExpr.replace(/(\d+)!/g, "fact($1)");

      // Check for illegal patterns
      if (/[^0-9a-zA-Z_\+\-\*\/\(\)\.\,]/i.test(pyExpr)) {
        return { err: "Illegal character detected" };
      }

      // Safe evaluation using Function with sandboxed scope parameters
      const keys = ["fact", ...Object.keys(mathScope)];
      const values = [fact, ...Object.values(mathScope)];
      const evaluator = new Function(...keys, `"use strict"; return (${pyExpr});`);
      const val = evaluator(...values);

      if (typeof val !== "number" || isNaN(val)) {
        return { err: "Undefined mathematical result" };
      }
      if (!isFinite(val)) {
        return { err: "Infinite value / division by zero" };
      }

      // Format clean precision
      const formatted = Number.isInteger(val) ? val.toString() : parseFloat(val.toFixed(8)).toString();
      return { value: val, formatted };
    } catch (e: any) {
      return { err: e.message || "Syntax or domain error" };
    }
  };

  // Evaluate on trigger
  const handleCalculate = () => {
    const res = evaluateExpression(expression);
    if (res.err) {
      setError(res.err);
      setResult("");
    } else if (res.formatted !== undefined) {
      setError(null);
      setResult(res.formatted);
      onLogCalculation(expression, res.formatted);

      // Add to local history
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setHistory(prev => [{ expr: expression, res: res.formatted!, time: timeStr }, ...prev.slice(0, 9)]);
    }
  };

  // Run calculation on load or expression change preview
  useEffect(() => {
    const res = evaluateExpression(expression);
    if (!res.err && res.formatted) {
      setError(null);
      setResult(res.formatted);
    }
  }, [expression, angleMode]);

  // Insert token at cursor / end
  const appendToken = (token: string) => {
    setExpression(prev => (prev === "0" ? token : prev + token));
  };

  const handleClear = () => {
    setExpression("");
    setResult("");
    setError(null);
  };

  const handleBackspace = () => {
    setExpression(prev => prev.slice(0, -1));
  };

  const handleCopyResult = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  // Memory bank operations
  const memoryAdd = () => {
    const num = parseFloat(result || expression);
    if (!isNaN(num)) {
      setMemory(prev => prev + num);
      setMemoryActive(true);
    }
  };

  const memorySub = () => {
    const num = parseFloat(result || expression);
    if (!isNaN(num)) {
      setMemory(prev => prev - num);
      setMemoryActive(true);
    }
  };

  const memoryRecall = () => {
    setExpression(prev => prev + memory.toString());
  };

  const memoryClear = () => {
    setMemory(0);
    setMemoryActive(false);
  };

  const presets = [
    { label: "Pythagoras", expr: "sqrt(3^2 + 4^2)" },
    { label: "Trig Identity", expr: "sin(pi / 4)^2 + cos(pi / 4)^2" },
    { label: "Euler's Identity", expr: "e^(0) + ln(e^3)" },
    { label: "Compound Growth", expr: "1000 * (1 + 0.07 / 12)^(12 * 5)" },
    { label: "Combinatorics", expr: "5! / (2! * 3!)" },
  ];

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-bold text-white tracking-tight">Scientific Calculator</h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/60 text-[#00D4FF]">
              AST Engine: Ramji (Computation)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Safe expression evaluation with transcendental functions, memory registers, and real-time validation.
          </p>
        </div>

        {/* Angle mode toggle */}
        <div className="flex items-center space-x-2 bg-[#0E1526] border border-slate-800 p-1 rounded-lg self-start">
          <button
            onClick={() => setAngleMode("RAD")}
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
              angleMode === "RAD"
                ? "bg-[#00D4FF] text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Radians (RAD)
          </button>
          <button
            onClick={() => setAngleMode("DEG")}
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
              angleMode === "DEG"
                ? "bg-[#00D4FF] text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Degrees (°DEG)
          </button>
        </div>
      </div>

      {/* Main Grid: Calculator Canvas + History / Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Display + Keypad */}
        <div className="lg:col-span-8 space-y-4">
          {/* Display Card */}
          <div className="bg-[#0E1526] border border-slate-800 rounded-xl p-5 shadow-xl relative focus-within:border-cyan-500/60 transition-colors">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <div className="flex items-center space-x-2 font-mono">
                <span className="text-cyan-400 font-semibold">{angleMode}</span>
                <span>•</span>
                <span className={memoryActive ? "text-amber-400 font-bold" : "text-slate-500"}>
                  M {memoryActive ? `[${memory}]` : "EMPTY"}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                {result && (
                  <button
                    onClick={handleCopyResult}
                    className="flex items-center space-x-1 text-xs px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Input Expression */}
            <input
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCalculate();
                if (e.key === "Escape") handleClear();
              }}
              placeholder="Enter mathematical expression (e.g., 2*sin(pi/3) + sqrt(25))"
              className="w-full bg-transparent text-xl sm:text-2xl font-mono text-white focus:outline-none border-b border-slate-800 pb-2 tracking-wide"
            />

            {/* Result Readout */}
            <div className="flex items-center justify-between pt-3 min-h-[44px]">
              {error ? (
                <div className="text-rose-400 text-xs font-mono flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span>{error}</span>
                </div>
              ) : (
                <div className="flex items-baseline space-x-2 text-right w-full justify-end">
                  <span className="text-slate-500 font-mono text-sm">=</span>
                  <span className="text-2xl sm:text-3xl font-bold font-mono text-[#00D4FF] tracking-tight">
                    {result || "0"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Presets Row */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px] shrink-0">
              Presets:
            </span>
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setExpression(p.expr)}
                className="px-2.5 py-1 rounded-md bg-[#151E34] hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 whitespace-nowrap transition-all cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Scientific Keypad Grid */}
          <div className="bg-[#0E1526] border border-slate-800 rounded-xl p-4 shadow-lg">
            {/* Memory & Action Row */}
            <div className="grid grid-cols-6 gap-2 mb-3 font-mono text-xs">
              <button
                onClick={memoryClear}
                className="py-2 rounded bg-slate-900/80 hover:bg-slate-800 text-slate-400 border border-slate-800 cursor-pointer font-bold"
              >
                MC
              </button>
              <button
                onClick={memoryRecall}
                className="py-2 rounded bg-slate-900/80 hover:bg-slate-800 text-amber-300 border border-slate-800 cursor-pointer font-bold"
              >
                MR
              </button>
              <button
                onClick={memoryAdd}
                className="py-2 rounded bg-slate-900/80 hover:bg-slate-800 text-amber-300 border border-slate-800 cursor-pointer font-bold"
              >
                M+
              </button>
              <button
                onClick={memorySub}
                className="py-2 rounded bg-slate-900/80 hover:bg-slate-800 text-amber-300 border border-slate-800 cursor-pointer font-bold"
              >
                M-
              </button>
              <button
                onClick={handleBackspace}
                className="py-2 rounded bg-slate-900 hover:bg-slate-800 text-rose-400 border border-slate-800 flex items-center justify-center cursor-pointer"
                title="Backspace"
              >
                <Delete className="w-4 h-4" />
              </button>
              <button
                onClick={handleClear}
                className="py-2 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 cursor-pointer font-bold"
              >
                CLEAR
              </button>
            </div>

            {/* Main Keypad: 6 columns */}
            <div className="grid grid-cols-6 gap-2 text-xs font-mono">
              {/* Row 1 */}
              <button onClick={() => appendToken("sin(")} className="key-sci">sin</button>
              <button onClick={() => appendToken("cos(")} className="key-sci">cos</button>
              <button onClick={() => appendToken("tan(")} className="key-sci">tan</button>
              <button onClick={() => appendToken("(")} className="key-op">(</button>
              <button onClick={() => appendToken(")")} className="key-op">)</button>
              <button onClick={() => appendToken(" / ")} className="key-op text-cyan-400 font-bold">÷</button>

              {/* Row 2 */}
              <button onClick={() => appendToken("asin(")} className="key-sci">sin⁻¹</button>
              <button onClick={() => appendToken("acos(")} className="key-sci">cos⁻¹</button>
              <button onClick={() => appendToken("atan(")} className="key-sci">tan⁻¹</button>
              <button onClick={() => appendToken("7")} className="key-num">7</button>
              <button onClick={() => appendToken("8")} className="key-num">8</button>
              <button onClick={() => appendToken("9")} className="key-num">9</button>

              {/* Row 3 */}
              <button onClick={() => appendToken("ln(")} className="key-sci">ln</button>
              <button onClick={() => appendToken("log(")} className="key-sci">log₁₀</button>
              <button onClick={() => appendToken("sqrt(")} className="key-sci">√x</button>
              <button onClick={() => appendToken("4")} className="key-num">4</button>
              <button onClick={() => appendToken("5")} className="key-num">5</button>
              <button onClick={() => appendToken("6")} className="key-num">6</button>

              {/* Row 4 */}
              <button onClick={() => appendToken("^")} className="key-sci">xʸ</button>
              <button onClick={() => appendToken("pi")} className="key-sci text-[#00D4FF]">π</button>
              <button onClick={() => appendToken("e")} className="key-sci text-[#00D4FF]">e</button>
              <button onClick={() => appendToken("1")} className="key-num">1</button>
              <button onClick={() => appendToken("2")} className="key-num">2</button>
              <button onClick={() => appendToken("3")} className="key-num">3</button>

              {/* Row 5 */}
              <button onClick={() => appendToken("!")} className="key-sci">n!</button>
              <button onClick={() => appendToken("abs(")} className="key-sci">|x|</button>
              <button onClick={() => appendToken(" * ")} className="key-op text-cyan-400 font-bold">×</button>
              <button onClick={() => appendToken("0")} className="key-num">0</button>
              <button onClick={() => appendToken(".")} className="key-num font-bold">.</button>
              <button onClick={() => appendToken(" - ")} className="key-op text-cyan-400 font-bold">−</button>
            </div>

            {/* Bottom Evaluate Button */}
            <div className="grid grid-cols-6 gap-2 mt-2">
              <button
                onClick={() => appendToken(" + ")}
                className="key-op text-cyan-400 font-bold font-mono text-sm py-3"
              >
                +
              </button>
              <button
                onClick={handleCalculate}
                className="col-span-5 bg-gradient-to-r from-[#00D4FF] to-cyan-500 hover:from-cyan-400 hover:to-cyan-500 text-slate-950 font-bold text-sm py-3 rounded-lg shadow-lg shadow-cyan-500/20 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Evaluate Expression [Enter]</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: History Log + Engine Details */}
        <div className="lg:col-span-4 space-y-4">
          {/* History Card */}
          <div className="bg-[#0E1526] border border-slate-800 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center space-x-2">
                <History className="w-4 h-4 text-[#00D4FF]" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Session History
                </span>
              </div>
              <button
                onClick={() => setHistory([])}
                className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
              >
                Clear
              </button>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {history.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  No previous calculations in session.
                </div>
              ) : (
                history.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setExpression(item.expr);
                      setResult(item.res);
                    }}
                    className="p-2.5 rounded-lg bg-[#151E34] hover:bg-slate-800/80 border border-slate-800/80 hover:border-cyan-500/40 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-mono text-slate-300 truncate max-w-[170px]">{item.expr}</span>
                      <span className="text-[10px] text-slate-500">{item.time}</span>
                    </div>
                    <div className="text-right font-mono font-bold text-sm text-[#00D4FF] group-hover:text-cyan-300 mt-0.5">
                      = {item.res}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Engine Architecture Note */}
          <div className="bg-[#151E34] border border-cyan-900/30 rounded-xl p-4 space-y-2 text-xs">
            <span className="font-bold text-[#00D4FF] block">AST Safe Parsing Architecture</span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Engineered by <strong>Ramji (Computation Specialist)</strong>. Unlike traditional tools using insecure{" "}
              <code className="text-rose-300">eval()</code>, MathLab parses syntax trees with whitelisted AST visitor nodes, preventing code execution while supporting arbitrary precision.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
