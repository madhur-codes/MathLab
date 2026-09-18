import React, { useState, useMemo } from "react";
import { Dices, Coins, Play, RotateCcw, TrendingUp } from "lucide-react";

export const ProbabilityModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"coin" | "dice" | "combinatorics">("coin");

  // Coin Toss State
  const [coinTrials, setCoinTrials] = useState<number>(500);
  const [coinResults, setCoinResults] = useState<{
    heads: number;
    tails: number;
    history: number[]; // Running head ratio at milestones
  }>({
    heads: 254,
    tails: 246,
    history: [0.6, 0.52, 0.48, 0.51, 0.508],
  });

  // Dice State
  const [diceTrials, setDiceTrials] = useState<number>(600);
  const [diceCounts, setDiceCounts] = useState<number[]>([102, 98, 105, 96, 101, 98]);

  // Combinatorics State
  const [combN, setCombN] = useState<number>(7);
  const [combR, setCombR] = useState<number>(3);

  // Run Coin Simulation
  const runCoinSimulation = (trials: number) => {
    let heads = 0;
    const history: number[] = [];
    const samplePoints = Math.min(trials, 50);
    const step = Math.max(1, Math.floor(trials / samplePoints));

    for (let i = 1; i <= trials; i++) {
      if (Math.random() < 0.5) heads++;
      if (i % step === 0 || i === trials) {
        history.push(heads / i);
      }
    }

    setCoinResults({
      heads,
      tails: trials - heads,
      history,
    });
  };

  // Run Dice Simulation
  const runDiceSimulation = (trials: number) => {
    const counts = [0, 0, 0, 0, 0, 0];
    for (let i = 0; i < trials; i++) {
      const face = Math.floor(Math.random() * 6);
      counts[face]++;
    }
    setDiceCounts(counts);
  };

  // BigInt Combinatorics to avoid overflow
  const factBigInt = (n: number): bigint => {
    if (n < 0) return 0n;
    let res = 1n;
    for (let i = 2; i <= n; i++) res *= BigInt(i);
    return res;
  };

  const combStats = useMemo(() => {
    if (combN < 0 || combR < 0 || combR > combN) {
      return { nFact: "0", nPr: "Undefined (r > n)", nCr: "Undefined (r > n)" };
    }
    const nFact = factBigInt(combN);
    const nMinusRFact = factBigInt(combN - combR);
    const rFact = factBigInt(combR);

    const nPr = nMinusRFact > 0n ? nFact / nMinusRFact : 0n;
    const nCr = nMinusRFact * rFact > 0n ? nFact / (nMinusRFact * rFact) : 0n;

    return {
      nFact: nFact.toString(),
      nPr: nPr.toString(),
      nCr: nCr.toString(),
    };
  }, [combN, combR]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-bold text-white tracking-tight">Probability Laboratory</h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-950/70 border border-purple-800/60 text-purple-300">
              Simulation Engine: Shiva (Visualization)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Monte Carlo empirical trials, Law of Large Numbers convergence analysis, fair dice distributions, and combinatorics.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center space-x-1 bg-[#0E1526] border border-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("coin")}
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
              activeTab === "coin" ? "bg-[#00D4FF] text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Coin Monte Carlo</span>
          </button>
          <button
            onClick={() => setActiveTab("dice")}
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
              activeTab === "dice" ? "bg-[#00D4FF] text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            <Dices className="w-3.5 h-3.5" />
            <span>Fair Dice</span>
          </button>
          <button
            onClick={() => setActiveTab("combinatorics")}
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
              activeTab === "combinatorics" ? "bg-[#00D4FF] text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            Combinatorics (nPr / nCr)
          </button>
        </div>
      </div>

      {/* --- TAB 1: COIN TOSS SIMULATION --- */}
      {activeTab === "coin" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Card */}
          <div className="lg:col-span-5 bg-[#0E1526] border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Simulation Parameters
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Total Trials (N):</span>
                <span className="text-[#00D4FF] font-bold">{coinTrials.toLocaleString()} flips</span>
              </div>
              <input
                type="range"
                min="50"
                max="10000"
                step="50"
                value={coinTrials}
                onChange={(e) => setCoinTrials(parseInt(e.target.value))}
                className="w-full accent-[#00D4FF] cursor-pointer"
              />
            </div>

            {/* Quick Presets */}
            <div className="flex gap-2">
              {[100, 500, 2000, 10000].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    setCoinTrials(num);
                    runCoinSimulation(num);
                  }}
                  className="flex-1 py-1.5 rounded bg-[#151E34] hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 font-mono transition-colors"
                >
                  {num >= 1000 ? `${num / 1000}k` : num}
                </button>
              ))}
            </div>

            {/* Run Button */}
            <button
              onClick={() => runCoinSimulation(coinTrials)}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#00D4FF] to-cyan-500 hover:from-cyan-400 hover:to-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 active:scale-[0.99] transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Simulate {coinTrials.toLocaleString()} Coin Tosses</span>
            </button>

            {/* Theoretical note */}
            <div className="p-3 bg-[#151E34] rounded-lg border border-slate-800 text-[11px] text-slate-300 space-y-1">
              <span className="text-amber-400 font-bold block">Law of Large Numbers:</span>
              <p className="leading-relaxed">
                As the number of trials approaches infinity, the relative empirical frequency of Heads approaches the theoretical probability P(Heads) = 0.500.
              </p>
            </div>
          </div>

          {/* Results Card */}
          <div className="lg:col-span-7 bg-[#0E1526] border border-slate-800 rounded-xl p-5 space-y-5 shadow-lg">
            {/* Outcome Counters */}
            <div className="grid grid-cols-3 gap-3 text-center font-mono">
              <div className="p-3 bg-[#151E34] rounded-lg border border-cyan-900/40">
                <span className="text-[10px] text-slate-400 uppercase block">Heads Count</span>
                <span className="text-xl font-bold text-[#00D4FF]">{coinResults.heads}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  ({((coinResults.heads / coinTrials) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="p-3 bg-[#151E34] rounded-lg border border-purple-900/40">
                <span className="text-[10px] text-slate-400 uppercase block">Tails Count</span>
                <span className="text-xl font-bold text-purple-300">{coinResults.tails}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  ({((coinResults.tails / coinTrials) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="p-3 bg-[#151E34] rounded-lg border border-emerald-900/40">
                <span className="text-[10px] text-slate-400 uppercase block">Deviation Error</span>
                <span className="text-xl font-bold text-emerald-400">
                  {Math.abs(coinResults.heads / coinTrials - 0.5).toFixed(4)}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">vs P(H)=0.500</span>
              </div>
            </div>

            {/* Convergence Chart */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center space-x-1.5 text-cyan-300 font-bold">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <span>Convergence Trajectory</span>
                </span>
                <span className="text-emerald-400">P_ideal = 0.500 (Dashed)</span>
              </div>

              {/* Line chart */}
              <div className="h-44 bg-[#080C16] border border-slate-800 rounded-lg p-3 relative flex items-center">
                {/* 0.5 Baseline */}
                <div className="w-full border-b border-dashed border-emerald-500/60 absolute top-1/2 left-0" />

                <svg viewBox="0 0 400 120" className="w-full h-full overflow-visible">
                  {/* Generate polyline from history */}
                  {(() => {
                    const pts = coinResults.history;
                    if (pts.length < 2) return null;
                    const pathD = pts
                      .map((p, idx) => {
                        const x = (idx / (pts.length - 1)) * 400;
                        // Map 0.3 -> 120, 0.7 -> 0
                        const clamped = Math.max(0.3, Math.min(0.7, p));
                        const y = 120 - ((clamped - 0.3) / 0.4) * 120;
                        return `${x.toFixed(1)},${y.toFixed(1)}`;
                      })
                      .join(" ");

                    return (
                      <polyline
                        points={pathD}
                        fill="none"
                        stroke="#00D4FF"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    );
                  })()}
                </svg>
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>Trial 1</span>
                <span>Trial {coinTrials}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: FAIR DICE SIMULATION --- */}
      {activeTab === "dice" && (
        <div className="bg-[#0E1526] border border-slate-800 rounded-xl p-5 space-y-5 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                6-Sided Fair Dice Frequency Distribution
              </h3>
              <p className="text-xs text-slate-400">Theoretical Probability P(i) = 1/6 ≈ 16.67%</p>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-xs font-mono text-slate-400">Trials: {diceTrials}</span>
              <button
                onClick={() => runDiceSimulation(diceTrials)}
                className="px-3 py-1.5 rounded-lg bg-[#00D4FF] hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Roll Dice</span>
              </button>
            </div>
          </div>

          {/* Dice Bars */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
            {diceCounts.map((count, idx) => {
              const face = idx + 1;
              const pct = ((count / diceTrials) * 100).toFixed(1);
              return (
                <div key={face} className="p-3 bg-[#151E34] rounded-lg border border-slate-800 text-center font-mono">
                  <div className="w-10 h-10 mx-auto rounded-lg bg-[#0E1526] border border-cyan-800/60 flex items-center justify-center text-lg font-bold text-[#00D4FF] mb-2 shadow-inner">
                    {face}
                  </div>
                  <span className="text-base font-bold text-white block">{count} rolls</span>
                  <span className="text-xs text-slate-400">{pct}%</span>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-[#00D4FF] h-full" style={{ width: `${Math.min(100, (parseFloat(pct) / 25) * 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- TAB 3: COMBINATORICS --- */}
      {activeTab === "combinatorics" && (
        <div className="bg-[#0E1526] border border-slate-800 rounded-xl p-5 space-y-6 shadow-lg">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              High-Precision Factorials, Permutations, and Combinations
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
            <div>
              <label className="text-xs font-mono text-cyan-400 block mb-1">Set Size (n):</label>
              <input
                type="number"
                min="0"
                max="50"
                value={combN}
                onChange={(e) => setCombN(parseInt(e.target.value) || 0)}
                className="w-full bg-[#151E34] border border-slate-700 rounded-lg p-2.5 text-white font-mono text-center font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-cyan-400 block mb-1">Subset Size (r):</label>
              <input
                type="number"
                min="0"
                max="50"
                value={combR}
                onChange={(e) => setCombR(parseInt(e.target.value) || 0)}
                className="w-full bg-[#151E34] border border-slate-700 rounded-lg p-2.5 text-white font-mono text-center font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
            <div className="p-4 bg-[#151E34] rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Factorial (n!):</span>
              <span className="text-xl font-bold text-purple-300 break-all">{combStats.nFact}</span>
            </div>
            <div className="p-4 bg-[#151E34] rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Permutations (nPr = n! / (n-r)!):</span>
              <span className="text-xl font-bold text-[#00D4FF] break-all">{combStats.nPr}</span>
            </div>
            <div className="p-4 bg-[#151E34] rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Combinations (nCr = n! / (r!(n-r)!)):</span>
              <span className="text-xl font-bold text-emerald-400 break-all">{combStats.nCr}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
