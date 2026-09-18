import React, { useState, useMemo } from "react";
import { BarChart3, Sliders, AlertCircle, Sparkles } from "lucide-react";

export const StatisticsModule: React.FC = () => {
  const [dataInput, setDataInput] = useState<string>("12, 15, 18, 19, 21, 22, 22, 25, 27, 29, 31, 35, 42");
  const [binCount, setBinCount] = useState<number>(6);
  const [activeChart, setActiveChart] = useState<"histogram" | "boxplot">("histogram");

  // Parse numbers
  const parsedData = useMemo(() => {
    const raw = dataInput
      .split(/[\s,]+/)
      .map((s) => parseFloat(s.trim()))
      .filter((n) => !isNaN(n));
    return raw.sort((a, b) => a - b);
  }, [dataInput]);

  // Statistics computations
  const stats = useMemo(() => {
    const n = parsedData.length;
    if (n === 0) return null;

    const sum = parsedData.reduce((acc, v) => acc + v, 0);
    const mean = sum / n;

    // Median
    let median = 0;
    if (n % 2 === 1) {
      median = parsedData[Math.floor(n / 2)];
    } else {
      median = (parsedData[n / 2 - 1] + parsedData[n / 2]) / 2;
    }

    // Mode
    const freq: Record<number, number> = {};
    parsedData.forEach((num) => {
      freq[num] = (freq[num] || 0) + 1;
    });
    let maxFreq = 0;
    Object.values(freq).forEach((f) => {
      if (f > maxFreq) maxFreq = f;
    });
    const modes = Object.keys(freq)
      .filter((k) => freq[Number(k)] === maxFreq && maxFreq > 1)
      .map(Number);

    // Variance & Std Dev
    const sqDiffs = parsedData.map((v) => Math.pow(v - mean, 2));
    const sumSqDiffs = sqDiffs.reduce((acc, v) => acc + v, 0);
    const popVar = sumSqDiffs / n;
    const sampleVar = n > 1 ? sumSqDiffs / (n - 1) : 0;
    const sampleStd = Math.sqrt(sampleVar);

    // Quartiles
    const getPercentile = (p: number) => {
      const idx = (n - 1) * p;
      const lower = Math.floor(idx);
      const upper = Math.ceil(idx);
      const weight = idx - lower;
      return parsedData[lower] * (1 - weight) + parsedData[upper] * weight;
    };

    const q1 = getPercentile(0.25);
    const q3 = getPercentile(0.75);
    const iqr = q3 - q1;

    // Tukey's Outliers
    const lowerFence = q1 - 1.5 * iqr;
    const upperFence = q3 + 1.5 * iqr;
    const outliers = parsedData.filter((v) => v < lowerFence || v > upperFence);

    // Skewness
    const m3 = parsedData.reduce((acc, v) => acc + Math.pow(v - mean, 3), 0) / n;
    const skewness = sampleStd !== 0 ? m3 / Math.pow(sampleStd, 3) : 0;

    return {
      n,
      min: parsedData[0],
      max: parsedData[n - 1],
      range: parsedData[n - 1] - parsedData[0],
      mean,
      median,
      modes: modes.length > 0 ? modes.join(", ") : "None (all unique)",
      popVar,
      sampleVar,
      sampleStd,
      q1,
      q3,
      iqr,
      outliers,
      skewness,
    };
  }, [parsedData]);

  // Histogram calculation
  const histogramData = useMemo(() => {
    if (!stats || stats.n === 0 || stats.range === 0) return [];
    const min = stats.min;
    const max = stats.max;
    const binWidth = (max - min) / binCount;
    const bins: Array<{ label: string; count: number; start: number; end: number }> = [];

    for (let i = 0; i < binCount; i++) {
      const start = min + i * binWidth;
      const end = start + binWidth;
      bins.push({
        label: `${start.toFixed(1)}-${end.toFixed(1)}`,
        count: 0,
        start,
        end,
      });
    }

    parsedData.forEach((val) => {
      let placed = false;
      for (let i = 0; i < binCount; i++) {
        if (i === binCount - 1 ? val >= bins[i].start && val <= bins[i].end : val >= bins[i].start && val < bins[i].end) {
          bins[i].count++;
          placed = true;
          break;
        }
      }
      if (!placed && bins.length > 0) {
        bins[bins.length - 1].count++;
      }
    });

    const maxCount = Math.max(...bins.map((b) => b.count), 1);
    return bins.map((b) => ({ ...b, heightRatio: b.count / maxCount }));
  }, [parsedData, stats, binCount]);

  const applyPreset = (type: "exam" | "sensors" | "normal" | "outliers") => {
    if (type === "exam") {
      setDataInput("55, 62, 68, 71, 74, 75, 78, 80, 82, 85, 88, 91, 95, 98");
    } else if (type === "sensors") {
      setDataInput("20.1, 20.4, 20.3, 20.2, 20.5, 20.3, 20.2, 20.6, 20.4, 20.1, 20.3");
    } else if (type === "normal") {
      setDataInput("42, 45, 47, 48, 49, 50, 50, 50, 51, 52, 53, 55, 58");
    } else if (type === "outliers") {
      setDataInput("10, 12, 14, 15, 15, 16, 17, 18, 19, 21, 22, 65, 82");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-bold text-white tracking-tight">Statistics Studio</h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-950/70 border border-purple-800/60 text-purple-300">
              Module: Shiva (Visualization & Stats)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Descriptive statistics, central tendency, Tukey's outlier fences, interactive histograms, and box plots.
          </p>
        </div>

        {/* Chart View Toggle */}
        <div className="flex items-center space-x-2 bg-[#0E1526] border border-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveChart("histogram")}
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
              activeChart === "histogram" ? "bg-[#00D4FF] text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            Histogram
          </button>
          <button
            onClick={() => setActiveChart("boxplot")}
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
              activeChart === "boxplot" ? "bg-[#00D4FF] text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            Box-and-Whisker
          </button>
        </div>
      </div>

      {/* Dataset Input & Presets */}
      <div className="bg-[#0E1526] border border-slate-800 rounded-xl p-5 space-y-3 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Sample Numbers Dataset:
          </label>
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-500 text-[11px]">Presets:</span>
            <button onClick={() => applyPreset("exam")} className="px-2 py-0.5 rounded bg-[#151E34] hover:bg-slate-800 text-cyan-300">Exam Grades</button>
            <button onClick={() => applyPreset("normal")} className="px-2 py-0.5 rounded bg-[#151E34] hover:bg-slate-800 text-purple-300">Normal Dist</button>
            <button onClick={() => applyPreset("outliers")} className="px-2 py-0.5 rounded bg-[#151E34] hover:bg-slate-800 text-rose-300">With Outliers</button>
          </div>
        </div>

        <textarea
          rows={2}
          value={dataInput}
          onChange={(e) => setDataInput(e.target.value)}
          placeholder="Enter numbers separated by spaces or commas (e.g., 10, 15, 20, 25)"
          className="w-full bg-[#151E34] border border-slate-700/80 rounded-lg p-3 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
        />

        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Parsed Sample Count: <strong className="text-cyan-400">{parsedData.length} values</strong></span>
          {stats && stats.outliers.length > 0 && (
            <span className="text-rose-400 flex items-center space-x-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{stats.outliers.length} Outlier(s) Detected: [{stats.outliers.join(", ")}]</span>
            </span>
          )}
        </div>
      </div>

      {stats && (
        <>
          {/* Summary Metrics Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
            <div className="p-3 bg-[#0E1526] border border-slate-800 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 uppercase block">Sample Mean (x̄)</span>
              <span className="text-lg font-bold text-[#00D4FF]">{stats.mean.toFixed(2)}</span>
            </div>
            <div className="p-3 bg-[#0E1526] border border-slate-800 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 uppercase block">Median (Q₂)</span>
              <span className="text-lg font-bold text-emerald-400">{stats.median.toFixed(2)}</span>
            </div>
            <div className="p-3 bg-[#0E1526] border border-slate-800 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 uppercase block">Sample Std Dev (s)</span>
              <span className="text-lg font-bold text-purple-400">{stats.sampleStd.toFixed(2)}</span>
            </div>
            <div className="p-3 bg-[#0E1526] border border-slate-800 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 uppercase block">Sample Variance (s²)</span>
              <span className="text-lg font-bold text-white">{stats.sampleVar.toFixed(2)}</span>
            </div>
            <div className="p-3 bg-[#0E1526] border border-slate-800 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 uppercase block">IQR (Q₃ - Q₁)</span>
              <span className="text-lg font-bold text-amber-400">{stats.iqr.toFixed(2)}</span>
            </div>
            <div className="p-3 bg-[#0E1526] border border-slate-800 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 uppercase block">Range [Min-Max]</span>
              <span className="text-lg font-bold text-cyan-300">{stats.range.toFixed(1)}</span>
            </div>
          </div>

          {/* Interactive Chart Canvas */}
          <div className="bg-[#0E1526] border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
            {/* Chart Header & Bin slider */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                {activeChart === "histogram" ? "Frequency Distribution Histogram" : "Five-Number Summary Box Plot"}
              </span>

              {activeChart === "histogram" && (
                <div className="flex items-center space-x-2 text-xs font-mono">
                  <span className="text-slate-400">Bins: {binCount}</span>
                  <input
                    type="range"
                    min="3"
                    max="12"
                    value={binCount}
                    onChange={(e) => setBinCount(parseInt(e.target.value))}
                    className="w-24 accent-[#00D4FF] cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Histogram View */}
            {activeChart === "histogram" && (
              <div className="pt-4">
                <div className="h-56 flex items-end justify-around gap-2 px-6 border-b border-l border-slate-800 pb-2">
                  {histogramData.map((bin, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                      <span className="text-[11px] font-mono text-cyan-400 font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {bin.count}
                      </span>
                      <div
                        className="w-full bg-gradient-to-t from-cyan-600 to-[#00D4FF] rounded-t hover:from-cyan-500 hover:to-cyan-300 transition-all cursor-pointer relative"
                        style={{ height: `${Math.max(8, bin.heightRatio * 180)}px` }}
                      >
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 rounded-t" />
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 mt-2 truncate max-w-full">
                        {bin.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Box-and-Whisker View */}
            {activeChart === "boxplot" && (
              <div className="p-8 flex flex-col items-center justify-center">
                <div className="w-full max-w-xl relative h-32 flex items-center">
                  {/* Baseline Axis */}
                  <div className="w-full h-1 bg-slate-800 absolute top-1/2 -translate-y-1/2" />

                  {/* SVG Box and Whisker Plot */}
                  <svg viewBox="0 0 500 120" className="w-full h-auto">
                    {/* Scale mapping: [min, max] => [40, 460] */}
                    {(() => {
                      const xMin = stats.min;
                      const xMax = stats.max;
                      const scale = (val: number) => 40 + ((val - xMin) / (xMax - xMin || 1)) * 420;

                      const sMin = scale(stats.min);
                      const sQ1 = scale(stats.q1);
                      const sMed = scale(stats.median);
                      const sQ3 = scale(stats.q3);
                      const sMax = scale(stats.max);

                      return (
                        <g>
                          {/* Whisker lines */}
                          <line x1={sMin} y1="60" x2={sQ1} y2="60" stroke="#00D4FF" strokeWidth="2" />
                          <line x1={sQ3} y1="60" x2={sMax} y2="60" stroke="#00D4FF" strokeWidth="2" />

                          {/* Whisker caps */}
                          <line x1={sMin} y1="40" x2={sMin} y2="80" stroke="#00D4FF" strokeWidth="2" />
                          <line x1={sMax} y1="40" x2={sMax} y2="80" stroke="#00D4FF" strokeWidth="2" />

                          {/* IQR Box */}
                          <rect
                            x={sQ1}
                            y="30"
                            width={Math.max(4, sQ3 - sQ1)}
                            height="60"
                            fill="#151E34"
                            stroke="#8B5CF6"
                            strokeWidth="2"
                            rx="4"
                          />

                          {/* Median line */}
                          <line x1={sMed} y1="30" x2={sMed} y2="90" stroke="#10B981" strokeWidth="3" />

                          {/* Labels */}
                          <text x={sMin} y="105" fill="#64748B" fontSize="10" textAnchor="middle" fontFamily="monospace">
                            Min: {stats.min}
                          </text>
                          <text x={sQ1} y="20" fill="#8B5CF6" fontSize="10" textAnchor="middle" fontFamily="monospace">
                            Q₁: {stats.q1.toFixed(1)}
                          </text>
                          <text x={sMed} y="105" fill="#10B981" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                            Med: {stats.median.toFixed(1)}
                          </text>
                          <text x={sQ3} y="20" fill="#8B5CF6" fontSize="10" textAnchor="middle" fontFamily="monospace">
                            Q₃: {stats.q3.toFixed(1)}
                          </text>
                          <text x={sMax} y="105" fill="#64748B" fontSize="10" textAnchor="middle" fontFamily="monospace">
                            Max: {stats.max}
                          </text>
                        </g>
                      );
                    })()}
                  </svg>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
