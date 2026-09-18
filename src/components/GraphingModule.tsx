import React, { useState, useMemo, useRef } from "react";
import { ZoomIn, ZoomOut, RotateCcw, Download, Eye, EyeOff, Sparkles, Compass } from "lucide-react";

export const GraphingModule: React.FC = () => {
  // Functions state
  const [f1Expr, setF1Expr] = useState<string>("sin(x)");
  const [f1Visible, setF1Visible] = useState<boolean>(true);

  const [f2Expr, setF2Expr] = useState<string>("cos(x)");
  const [f2Visible, setF2Visible] = useState<boolean>(true);

  const [f3Expr, setF3Expr] = useState<string>("");
  const [f3Visible, setF3Visible] = useState<boolean>(false);

  // Domain & range
  const [xMin, setXMin] = useState<number>(-7);
  const [xMax, setXMax] = useState<number>(7);
  const [yMin, setYMin] = useState<number>(-3);
  const [yMax, setYMax] = useState<number>(3);

  // Tangent line tool
  const [showTangent, setShowTangent] = useState<boolean>(false);
  const [tangentX, setTangentX] = useState<number>(1);

  // Hover crosshair
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number; px: number; py: number } | null>(null);

  const svgWidth = 800;
  const svgHeight = 440;
  const padding = 40;

  // Safe compiler for expression string f(x)
  const compileFunction = (expr: string): ((x: number) => number | null) => {
    if (!expr.trim()) return () => null;
    try {
      let sanitized = expr
        .replace(/\s+/g, "")
        .replace(/π/g, "Math.PI")
        .replace(/pi/g, "Math.PI")
        .replace(/e/g, "Math.E")
        .replace(/\^/g, "**")
        .replace(/sin/g, "Math.sin")
        .replace(/cos/g, "Math.cos")
        .replace(/tan/g, "Math.tan")
        .replace(/sqrt/g, "Math.sqrt")
        .replace(/abs/g, "Math.abs")
        .replace(/ln/g, "Math.log")
        .replace(/log/g, "Math.log10")
        .replace(/exp/g, "Math.exp");

      // Replace 2x with 2*x
      sanitized = sanitized.replace(/(\d)x/g, "$1*x");

      const fn = new Function("x", `"use strict"; try { const y = (${sanitized}); return (typeof y === "number" && isFinite(y)) ? y : null; } catch { return null; }`);
      return fn as (x: number) => number | null;
    } catch {
      return () => null;
    }
  };

  const fn1 = useMemo(() => compileFunction(f1Expr), [f1Expr]);
  const fn2 = useMemo(() => compileFunction(f2Expr), [f2Expr]);
  const fn3 = useMemo(() => compileFunction(f3Expr), [f3Expr]);

  // Coordinate transforms
  const toScreenX = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * (svgWidth - 2 * padding);
  const toScreenY = (y: number) => svgHeight - padding - ((y - yMin) / (yMax - yMin)) * (svgHeight - 2 * padding);
  const toMathX = (px: number) => xMin + ((px - padding) / (svgWidth - 2 * padding)) * (xMax - xMin);
  const toMathY = (py: number) => yMin + ((svgHeight - padding - py) / (svgHeight - 2 * padding)) * (yMax - yMin);

  // Generate SVG path for a function with asymptote / singularity detection
  const generatePath = (fn: (x: number) => number | null): string => {
    const steps = 400;
    const dx = (xMax - xMin) / steps;
    let path = "";
    let prevY: number | null = null;

    for (let i = 0; i <= steps; i++) {
      const x = xMin + i * dx;
      const y = fn(x);

      if (y === null || isNaN(y)) {
        prevY = null;
        continue;
      }

      // Asymptote discontinuity check (e.g. for tan(x) or 1/x)
      if (prevY !== null && Math.abs(y - prevY) > (yMax - yMin) * 0.75) {
        prevY = null;
        continue;
      }

      const sx = toScreenX(x);
      const sy = toScreenY(y);

      // Clamp visual points reasonably to prevent giant SVG coordinates
      const clampedY = Math.max(-50, Math.min(svgHeight + 50, sy));

      if (prevY === null) {
        path += `M ${sx.toFixed(1)} ${clampedY.toFixed(1)} `;
      } else {
        path += `L ${sx.toFixed(1)} ${clampedY.toFixed(1)} `;
      }
      prevY = y;
    }

    return path;
  };

  const path1 = useMemo(() => generatePath(fn1), [fn1, xMin, xMax, yMin, yMax]);
  const path2 = useMemo(() => generatePath(fn2), [fn2, xMin, xMax, yMin, yMax]);
  const path3 = useMemo(() => generatePath(fn3), [fn3, xMin, xMax, yMin, yMax]);

  // Tangent line calculation at tangentX for f1
  const tangentData = useMemo(() => {
    if (!showTangent) return null;
    const y0 = fn1(tangentX);
    if (y0 === null) return null;
    const h = 1e-4;
    const yNext = fn1(tangentX + h);
    const yPrev = fn1(tangentX - h);
    if (yNext === null || yPrev === null) return null;
    const slope = (yNext - yPrev) / (2 * h);

    // Line equation: y - y0 = m(x - x0) => y = m(x - x0) + y0
    const xLeft = xMin;
    const yLeft = slope * (xLeft - tangentX) + y0;
    const xRight = xMax;
    const yRight = slope * (xRight - tangentX) + y0;

    return {
      x0: tangentX,
      y0,
      slope,
      xLeft,
      yLeft,
      xRight,
      yRight,
      sx0: toScreenX(tangentX),
      sy0: toScreenY(y0),
      sxLeft: toScreenX(xLeft),
      syLeft: toScreenY(yLeft),
      sxRight: toScreenX(xRight),
      syRight: toScreenY(yRight),
    };
  }, [showTangent, tangentX, fn1, xMin, xMax, yMin, yMax]);

  // Grid tick markers
  const gridTicks = useMemo(() => {
    const xTicks: number[] = [];
    const yTicks: number[] = [];
    const xStep = Math.max(1, Math.round((xMax - xMin) / 8));
    const yStep = Math.max(1, Math.round((yMax - yMin) / 6));

    for (let x = Math.ceil(xMin / xStep) * xStep; x <= xMax; x += xStep) {
      if (x !== 0) xTicks.push(x);
    }
    for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
      if (y !== 0) yTicks.push(y);
    }
    return { xTicks, yTicks };
  }, [xMin, xMax, yMin, yMax]);

  // Zoom controls
  const handleZoom = (factor: number) => {
    const xMid = (xMin + xMax) / 2;
    const xHalf = ((xMax - xMin) * factor) / 2;
    const yMid = (yMin + yMax) / 2;
    const yHalf = ((yMax - yMin) * factor) / 2;
    setXMin(Math.round(xMid - xHalf));
    setXMax(Math.round(xMid + xHalf));
    setYMin(Math.round(yMid - yHalf));
    setYMax(Math.round(yMid + yHalf));
  };

  const handleResetView = () => {
    setXMin(-7);
    setXMax(7);
    setYMin(-3);
    setYMax(3);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    if (px >= padding && px <= svgWidth - padding && py >= padding && py <= svgHeight - padding) {
      const mx = toMathX(px);
      const my = toMathY(py);
      setHoverCoord({ x: parseFloat(mx.toFixed(2)), y: parseFloat(my.toFixed(2)), px, py });
    } else {
      setHoverCoord(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-bold text-white tracking-tight">Graphing Laboratory</h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-950/70 border border-purple-800/60 text-purple-300">
              Graphics Engine: Shiva (Visualization)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Embedded multi-function coordinate canvas, dynamic domain bounds, asymptote masking, and tangent line visualizer.
          </p>
        </div>

        {/* View Zoom & Reset Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleZoom(0.8)}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-[#0E1526] hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5 text-cyan-400" />
            <span>Zoom In</span>
          </button>
          <button
            onClick={() => handleZoom(1.25)}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-[#0E1526] hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5 text-cyan-400" />
            <span>Zoom Out</span>
          </button>
          <button
            onClick={handleResetView}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-[#0E1526] hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-colors"
            title="Reset View"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Coordinate Canvas & Side Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Interactive SVG Canvas */}
        <div className="lg:col-span-8 bg-[#0E1526] border border-slate-800 rounded-xl p-4 shadow-xl relative">
          {/* Canvas Header Info */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
            <div className="flex items-center space-x-3">
              <span className="text-cyan-400">f₁(x)</span>
              <span className="text-purple-400">f₂(x)</span>
              <span className="text-emerald-400">f₃(x)</span>
            </div>
            <div>
              {hoverCoord ? (
                <span className="text-amber-300 font-bold">
                  ({hoverCoord.x >= 0 ? "+" : ""}{hoverCoord.x}, {hoverCoord.y >= 0 ? "+" : ""}{hoverCoord.y})
                </span>
              ) : (
                <span className="text-slate-500">Hover canvas for coordinates</span>
              )}
            </div>
          </div>

          {/* SVG Plot */}
          <div className="w-full overflow-hidden rounded-lg bg-[#070B14] border border-slate-800/80 cursor-crosshair">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto select-none"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoverCoord(null)}
            >
              {/* Background Grid Lines */}
              {gridTicks.xTicks.map((x) => (
                <g key={`x-${x}`}>
                  <line
                    x1={toScreenX(x)}
                    y1={padding}
                    x2={toScreenX(x)}
                    y2={svgHeight - padding}
                    stroke="#1E293B"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={toScreenX(x)}
                    y={svgHeight - padding + 15}
                    fill="#64748B"
                    fontSize="10"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    {x}
                  </text>
                </g>
              ))}

              {gridTicks.yTicks.map((y) => (
                <g key={`y-${y}`}>
                  <line
                    x1={padding}
                    y1={toScreenY(y)}
                    x2={svgWidth - padding}
                    y2={toScreenY(y)}
                    stroke="#1E293B"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={padding - 10}
                    y={toScreenY(y) + 4}
                    fill="#64748B"
                    fontSize="10"
                    textAnchor="end"
                    fontFamily="monospace"
                  >
                    {y}
                  </text>
                </g>
              ))}

              {/* Main X and Y Axes */}
              <line
                x1={padding}
                y1={toScreenY(0)}
                x2={svgWidth - padding}
                y2={toScreenY(0)}
                stroke="#475569"
                strokeWidth="1.5"
              />
              <line
                x1={toScreenX(0)}
                y1={padding}
                x2={toScreenX(0)}
                y2={svgHeight - padding}
                stroke="#475569"
                strokeWidth="1.5"
              />

              {/* Function 1 Curve (Cyan) */}
              {f1Visible && path1 && (
                <path
                  d={path1}
                  fill="none"
                  stroke="#00D4FF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Function 2 Curve (Purple) */}
              {f2Visible && path2 && (
                <path
                  d={path2}
                  fill="none"
                  stroke="#A855F7"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Function 3 Curve (Emerald) */}
              {f3Visible && path3 && (
                <path
                  d={path3}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Tangent Line at x0 */}
              {tangentData && (
                <g>
                  <line
                    x1={tangentData.sxLeft}
                    y1={tangentData.syLeft}
                    x2={tangentData.sxRight}
                    y2={tangentData.syRight}
                    stroke="#F59E0B"
                    strokeWidth="2"
                    strokeDasharray="5 3"
                  />
                  <circle
                    cx={tangentData.sx0}
                    cy={tangentData.sy0}
                    r="5"
                    fill="#F59E0B"
                    stroke="#000"
                    strokeWidth="1.5"
                  />
                </g>
              )}

              {/* Hover Crosshairs */}
              {hoverCoord && (
                <g>
                  <line
                    x1={hoverCoord.px}
                    y1={padding}
                    x2={hoverCoord.px}
                    y2={svgHeight - padding}
                    stroke="#FBBF24"
                    strokeWidth="0.8"
                    strokeDasharray="2 2"
                  />
                  <line
                    x1={padding}
                    y1={hoverCoord.py}
                    x2={svgWidth - padding}
                    y2={hoverCoord.py}
                    stroke="#FBBF24"
                    strokeWidth="0.8"
                    strokeDasharray="2 2"
                  />
                  <circle cx={hoverCoord.px} cy={hoverCoord.py} r="4" fill="#FBBF24" />
                </g>
              )}
            </svg>
          </div>

          {/* Coordinate Domain Bounds readout */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2 px-1">
            <span>Domain X: [{xMin}, {xMax}]</span>
            <span>Range Y: [{yMin}, {yMax}]</span>
          </div>
        </div>

        {/* Right 4 Cols: Function Inputs & Tool Panels */}
        <div className="lg:col-span-4 space-y-4">
          {/* Function Inputs */}
          <div className="bg-[#0E1526] border border-slate-800 rounded-xl p-4 space-y-3 shadow-lg">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Plot Functions
            </h3>

            {/* Function 1 */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[#00D4FF] font-bold">f₁(x) =</span>
                <button
                  onClick={() => setF1Visible(!f1Visible)}
                  className="text-slate-400 hover:text-white"
                >
                  {f1Visible ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>
              <input
                type="text"
                value={f1Expr}
                onChange={(e) => setF1Expr(e.target.value)}
                className="w-full bg-[#151E34] border border-cyan-800/60 rounded px-2.5 py-1.5 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>

            {/* Function 2 */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-purple-400 font-bold">f₂(x) =</span>
                <button
                  onClick={() => setF2Visible(!f2Visible)}
                  className="text-slate-400 hover:text-white"
                >
                  {f2Visible ? <Eye className="w-3.5 h-3.5 text-purple-400" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>
              <input
                type="text"
                value={f2Expr}
                onChange={(e) => setF2Expr(e.target.value)}
                className="w-full bg-[#151E34] border border-purple-800/60 rounded px-2.5 py-1.5 text-xs text-white font-mono focus:border-purple-400 focus:outline-none"
              />
            </div>

            {/* Function 3 */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-emerald-400 font-bold">f₃(x) =</span>
                <button
                  onClick={() => setF3Visible(!f3Visible)}
                  className="text-slate-400 hover:text-white"
                >
                  {f3Visible ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>
              <input
                type="text"
                value={f3Expr}
                onChange={(e) => setF3Expr(e.target.value)}
                placeholder="Optional 3rd function (e.g., x^2 - 2)"
                className="w-full bg-[#151E34] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-mono focus:border-emerald-400 focus:outline-none"
              />
            </div>

            {/* Presets Grid */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                Educational Presets:
              </span>
              <div className="space-y-1.5 text-xs">
                <button
                  onClick={() => {
                    setF1Expr("sin(x)");
                    setF2Expr("cos(x)");
                    setF3Expr("");
                    setF1Visible(true);
                    setF2Visible(true);
                    setF3Visible(false);
                  }}
                  className="w-full p-2 rounded bg-[#151E34] hover:bg-slate-800 border border-slate-800 text-left text-slate-300 hover:text-cyan-300 transition-colors"
                >
                  <span className="font-bold text-white block">Sine & Cosine Phase</span>
                  <span className="text-[10px] text-slate-400">Orthogonal trigonometric waves</span>
                </button>
                <button
                  onClick={() => {
                    setF1Expr("exp(-0.2*x) * sin(3*x)");
                    setF2Expr("exp(-0.2*x)");
                    setF3Expr("-exp(-0.2*x)");
                    setF1Visible(true);
                    setF2Visible(true);
                    setF3Visible(true);
                  }}
                  className="w-full p-2 rounded bg-[#151E34] hover:bg-slate-800 border border-slate-800 text-left text-slate-300 hover:text-cyan-300 transition-colors"
                >
                  <span className="font-bold text-white block">Damped Harmonic Oscillator</span>
                  <span className="text-[10px] text-slate-400">Wave oscillation with decay envelope</span>
                </button>
                <button
                  onClick={() => {
                    setF1Expr("x^3 - 3*x");
                    setF2Expr("3*x^2 - 3");
                    setF3Expr("");
                    setF1Visible(true);
                    setF2Visible(true);
                    setF3Visible(false);
                  }}
                  className="w-full p-2 rounded bg-[#151E34] hover:bg-slate-800 border border-slate-800 text-left text-slate-300 hover:text-cyan-300 transition-colors"
                >
                  <span className="font-bold text-white block">Function vs Derivative</span>
                  <span className="text-[10px] text-slate-400">Cubic polynomial with quadratic tangent slope</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tangent Slope Tool */}
          <div className="bg-[#0E1526] border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase font-mono">Tangent Line Tool</span>
              <button
                onClick={() => setShowTangent(!showTangent)}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                  showTangent ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "bg-slate-800 text-slate-400"
                }`}
              >
                {showTangent ? "Active" : "Disabled"}
              </button>
            </div>

            {showTangent && tangentData && (
              <div className="space-y-2 text-xs font-mono">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Point x₀: {tangentX.toFixed(1)}</span>
                    <span className="text-amber-400 font-bold">Slope m = {tangentData.slope.toFixed(3)}</span>
                  </div>
                  <input
                    type="range"
                    min={xMin}
                    max={xMax}
                    step="0.1"
                    value={tangentX}
                    onChange={(e) => setTangentX(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
                <div className="p-2 rounded bg-[#151E34] border border-slate-800 text-[11px] text-slate-300">
                  Equation: y = {tangentData.slope.toFixed(2)}x {tangentData.y0 - tangentData.slope * tangentData.x0 >= 0 ? "+ " : "- "}
                  {Math.abs(tangentData.y0 - tangentData.slope * tangentData.x0).toFixed(2)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
