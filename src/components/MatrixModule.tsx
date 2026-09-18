import React, { useState } from "react";
import { Sparkles, Copy, Check, RotateCcw, AlertTriangle } from "lucide-react";

export const MatrixModule: React.FC = () => {
  const [dim, setDim] = useState<2 | 3>(2);
  const [scalar, setScalar] = useState<number>(2);

  // Matrix A state
  const [matA, setMatA] = useState<number[][]>([
    [1, 2],
    [3, 4],
  ]);

  // Matrix B state
  const [matB, setMatB] = useState<number[][]>([
    [5, 6],
    [7, 8],
  ]);

  const [activeOp, setActiveOp] = useState<
    "det" | "inverse" | "transpose" | "trace" | "scalar" | "add" | "multiply"
  >("det");

  const [copied, setCopied] = useState<boolean>(false);

  // Dimension switch handler
  const handleDimChange = (newDim: 2 | 3) => {
    setDim(newDim);
    if (newDim === 2) {
      setMatA([
        [1, 2],
        [3, 4],
      ]);
      setMatB([
        [5, 6],
        [7, 8],
      ]);
    } else {
      setMatA([
        [1, 2, 3],
        [0, 1, 4],
        [5, 6, 0],
      ]);
      setMatB([
        [2, 0, -1],
        [1, 3, 2],
        [0, 4, 1],
      ]);
    }
  };

  const updateCellA = (r: number, c: number, val: number) => {
    const next = matA.map((row, ri) =>
      row.map((cell, ci) => (ri === r && ci === c ? val : cell))
    );
    setMatA(next);
  };

  const updateCellB = (r: number, c: number, val: number) => {
    const next = matB.map((row, ri) =>
      row.map((cell, ci) => (ri === r && ci === c ? val : cell))
    );
    setMatB(next);
  };

  // --- DETERMINANT CALCULATION ---
  const calcDet = (m: number[][]): { val: number; steps: string[] } => {
    if (m.length === 2) {
      const val = m[0][0] * m[1][1] - m[0][1] * m[1][0];
      const steps = [
        `det(A) = (a₁₁ · a₂₂) - (a₁₂ · a₂₁)`,
        `det(A) = (${m[0][0]} · ${m[1][1]}) - (${m[0][1]} · ${m[1][0]}) = ${m[0][0] * m[1][1]} - ${m[0][1] * m[1][0]} = ${val}`,
      ];
      return { val, steps };
    } else {
      // 3x3 Laplace expansion
      const a = m[0][0], b = m[0][1], c = m[0][2];
      const minor1 = m[1][1] * m[2][2] - m[1][2] * m[2][1];
      const minor2 = m[1][0] * m[2][2] - m[1][2] * m[2][0];
      const minor3 = m[1][0] * m[2][1] - m[1][1] * m[2][0];
      const val = a * minor1 - b * minor2 + c * minor3;
      const steps = [
        `Laplace expansion along first row: det(A) = a₁₁·M₁₁ - a₁₂·M₁₂ + a₁₃·M₁₃`,
        `Minor M₁₁: (${m[1][1]}·${m[2][2]} - ${m[1][2]}·${m[2][1]}) = ${minor1}`,
        `Minor M₁₂: (${m[1][0]}·${m[2][2]} - ${m[1][2]}·${m[2][0]}) = ${minor2}`,
        `Minor M₁₃: (${m[1][0]}·${m[2][1]} - ${m[1][1]}·${m[2][0]}) = ${minor3}`,
        `det(A) = ${a}(${minor1}) - ${b}(${minor2}) + ${c}(${minor3}) = ${val}`,
      ];
      return { val, steps };
    }
  };

  // --- TRACE ---
  const calcTrace = (m: number[][]): number => {
    let tr = 0;
    for (let i = 0; i < m.length; i++) tr += m[i][i];
    return tr;
  };

  // --- TRANSPOSE ---
  const calcTranspose = (m: number[][]): number[][] => {
    return m[0].map((_, colIndex) => m.map(row => row[colIndex]));
  };

  // --- INVERSE ---
  const calcInverse = (m: number[][]): { inv?: number[][]; err?: string } => {
    const { val: det } = calcDet(m);
    if (Math.abs(det) < 1e-12) {
      return { err: "Matrix is singular (det(A) = 0). Inverse does not exist." };
    }
    if (m.length === 2) {
      const inv = [
        [m[1][1] / det, -m[0][1] / det],
        [-m[1][0] / det, m[0][0] / det],
      ];
      return { inv };
    } else {
      // 3x3 Inverse using Adjugate
      const cofactors = [
        [
          (m[1][1] * m[2][2] - m[1][2] * m[2][1]),
          -(m[1][0] * m[2][2] - m[1][2] * m[2][0]),
          (m[1][0] * m[2][1] - m[1][1] * m[2][0]),
        ],
        [
          -(m[0][1] * m[2][2] - m[0][2] * m[2][1]),
          (m[0][0] * m[2][2] - m[0][2] * m[2][0]),
          -(m[0][0] * m[2][1] - m[0][1] * m[2][0]),
        ],
        [
          (m[0][1] * m[1][2] - m[0][2] * m[1][1]),
          -(m[0][0] * m[1][2] - m[0][2] * m[1][0]),
          (m[0][0] * m[1][1] - m[0][1] * m[1][0]),
        ],
      ];
      // Transpose of cofactor = adjugate
      const adj = calcTranspose(cofactors);
      const inv = adj.map(row => row.map(cell => cell / det));
      return { inv };
    }
  };

  // --- ADDITION ---
  const calcAdd = (a: number[][], b: number[][]): number[][] => {
    return a.map((row, r) => row.map((val, c) => val + b[r][c]));
  };

  // --- MULTIPLICATION ---
  const calcMultiply = (a: number[][], b: number[][]): number[][] => {
    const n = a.length;
    const res: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        for (let k = 0; k < n; k++) {
          res[i][j] += a[i][k] * b[k][j];
        }
      }
    }
    return res;
  };

  // Preset setter
  const applyPreset = (type: "identity" | "symmetric" | "hilbert" | "singular") => {
    if (dim === 2) {
      if (type === "identity") setMatA([[1, 0], [0, 1]]);
      if (type === "symmetric") setMatA([[4, 2], [2, 5]]);
      if (type === "hilbert") setMatA([[1, 0.5], [0.5, 0.333]]);
      if (type === "singular") setMatA([[2, 4], [1, 2]]);
    } else {
      if (type === "identity") setMatA([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
      if (type === "symmetric") setMatA([[2, 1, 3], [1, 5, 0], [3, 0, 4]]);
      if (type === "hilbert") setMatA([[1, 0.5, 0.333], [0.5, 0.333, 0.25], [0.333, 0.25, 0.2]]);
      if (type === "singular") setMatA([[1, 2, 3], [2, 4, 6], [1, 1, 1]]);
    }
  };

  const detA = calcDet(matA);
  const traceA = calcTrace(matA);
  const transposeA = calcTranspose(matA);
  const invA = calcInverse(matA);
  const addRes = calcAdd(matA, matB);
  const mulRes = calcMultiply(matA, matB);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-bold text-white tracking-tight">Matrix Laboratory</h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/60 text-[#00D4FF]">
              Engine: Ramji (Computation)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Linear algebra workspace supporting determinants, Gaussian inversion, cofactor adjugate expansion, and matrix arithmetic.
          </p>
        </div>

        {/* Dimension Selector */}
        <div className="flex items-center space-x-2 bg-[#0E1526] border border-slate-800 p-1 rounded-lg">
          <button
            onClick={() => handleDimChange(2)}
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
              dim === 2 ? "bg-[#00D4FF] text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            2 × 2 Grid
          </button>
          <button
            onClick={() => handleDimChange(3)}
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
              dim === 3 ? "bg-[#00D4FF] text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            3 × 3 Grid
          </button>
        </div>
      </div>

      {/* Matrix Grids Input Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Matrix A Card */}
        <div className="lg:col-span-6 bg-[#0E1526] border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00D4FF]" />
              <span>Matrix A ({dim}×{dim})</span>
            </h3>

            {/* Presets */}
            <div className="flex items-center space-x-1 text-[10px]">
              <button onClick={() => applyPreset("identity")} className="px-2 py-0.5 rounded bg-[#151E34] hover:bg-slate-800 text-slate-300">Identity</button>
              <button onClick={() => applyPreset("symmetric")} className="px-2 py-0.5 rounded bg-[#151E34] hover:bg-slate-800 text-slate-300">Symmetric</button>
              <button onClick={() => applyPreset("singular")} className="px-2 py-0.5 rounded bg-[#151E34] hover:bg-slate-800 text-rose-300">Singular</button>
            </div>
          </div>

          {/* Matrix A Inputs */}
          <div className="p-4 bg-[#080C16] border border-slate-800 rounded-lg flex justify-center">
            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: `repeat(${dim}, minmax(0, 1fr))` }}
            >
              {matA.map((row, r) =>
                row.map((val, c) => (
                  <input
                    key={`${r}-${c}`}
                    type="number"
                    value={val}
                    onChange={(e) => updateCellA(r, c, parseFloat(e.target.value) || 0)}
                    className="w-16 sm:w-20 h-12 bg-[#151E34] border border-cyan-900/60 focus:border-cyan-400 rounded-md text-center font-mono font-bold text-white text-base focus:outline-none"
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Matrix B Card */}
        <div className="lg:col-span-6 bg-[#0E1526] border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
              <span>Matrix B ({dim}×{dim}) [For Binary Ops]</span>
            </h3>
          </div>

          {/* Matrix B Inputs */}
          <div className="p-4 bg-[#080C16] border border-slate-800 rounded-lg flex justify-center">
            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: `repeat(${dim}, minmax(0, 1fr))` }}
            >
              {matB.map((row, r) =>
                row.map((val, c) => (
                  <input
                    key={`${r}-${c}`}
                    type="number"
                    value={val}
                    onChange={(e) => updateCellB(r, c, parseFloat(e.target.value) || 0)}
                    className="w-16 sm:w-20 h-12 bg-[#151E34] border border-purple-900/60 focus:border-purple-400 rounded-md text-center font-mono font-bold text-white text-base focus:outline-none"
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Operation Selection Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {[
          { id: "det", label: "Determinant det(A)" },
          { id: "inverse", label: "Inverse A⁻¹" },
          { id: "transpose", label: "Transpose Aᵀ" },
          { id: "trace", label: "Trace Tr(A)" },
          { id: "add", label: "Addition (A + B)" },
          { id: "multiply", label: "Multiplication (A × B)" },
        ].map((op) => (
          <button
            key={op.id}
            onClick={() => setActiveOp(op.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeOp === op.id
                ? "bg-[#00D4FF] text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                : "bg-[#0E1526] hover:bg-slate-800 text-slate-300 border border-slate-800"
            }`}
          >
            {op.label}
          </button>
        ))}
      </div>

      {/* Results Viewport */}
      <div className="bg-[#0E1526] border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        {/* Determinant */}
        {activeOp === "det" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-slate-400">Determinant Result:</span>
              <span className="text-2xl font-bold font-mono text-[#00D4FF]">
                det(A) = {detA.val}
              </span>
            </div>
            <div className="p-4 rounded-lg bg-[#080C16] border border-slate-800 font-mono text-xs space-y-1.5 text-slate-300">
              <span className="text-cyan-400 font-bold block mb-1">Analytical Expansion:</span>
              {detA.steps.map((s, idx) => (
                <p key={idx}>{s}</p>
              ))}
            </div>
          </div>
        )}

        {/* Inverse */}
        {activeOp === "inverse" && (
          <div className="space-y-3">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-slate-400">Inverse Matrix (A⁻¹):</span>
            </div>
            {invA.err ? (
              <div className="p-4 bg-rose-950/30 border border-rose-800/40 rounded-lg text-rose-300 text-xs font-mono flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{invA.err}</span>
              </div>
            ) : (
              <div className="p-4 bg-[#080C16] border border-slate-800 rounded-lg flex justify-center">
                <div
                  className="grid gap-3 font-mono"
                  style={{ gridTemplateColumns: `repeat(${dim}, minmax(0, 1fr))` }}
                >
                  {invA.inv?.map((row, r) =>
                    row.map((val, c) => (
                      <div
                        key={`${r}-${c}`}
                        className="w-20 sm:w-24 h-12 bg-[#151E34] border border-slate-700 rounded flex items-center justify-center font-bold text-cyan-300 text-sm"
                      >
                        {Number.isInteger(val) ? val : val.toFixed(3)}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Transpose */}
        {activeOp === "transpose" && (
          <div className="space-y-3">
            <span className="text-xs font-mono text-slate-400 block border-b border-slate-800 pb-3">
              Transpose Matrix Aᵀ (rows switched with columns):
            </span>
            <div className="p-4 bg-[#080C16] border border-slate-800 rounded-lg flex justify-center">
              <div
                className="grid gap-3 font-mono"
                style={{ gridTemplateColumns: `repeat(${dim}, minmax(0, 1fr))` }}
              >
                {transposeA.map((row, r) =>
                  row.map((val, c) => (
                    <div
                      key={`${r}-${c}`}
                      className="w-20 sm:w-24 h-12 bg-[#151E34] border border-slate-700 rounded flex items-center justify-center font-bold text-white text-base"
                    >
                      {val}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Trace */}
        {activeOp === "trace" && (
          <div className="p-6 bg-[#080C16] border border-slate-800 rounded-lg text-center font-mono">
            <span className="text-xs text-slate-400 block mb-1">Matrix Trace (Sum of Main Diagonal):</span>
            <span className="text-3xl font-bold text-[#00D4FF]">Tr(A) = {traceA}</span>
          </div>
        )}

        {/* Addition */}
        {activeOp === "add" && (
          <div className="space-y-3">
            <span className="text-xs font-mono text-slate-400 block border-b border-slate-800 pb-3">
              Element-wise Sum (A + B):
            </span>
            <div className="p-4 bg-[#080C16] border border-slate-800 rounded-lg flex justify-center">
              <div
                className="grid gap-3 font-mono"
                style={{ gridTemplateColumns: `repeat(${dim}, minmax(0, 1fr))` }}
              >
                {addRes.map((row, r) =>
                  row.map((val, c) => (
                    <div
                      key={`${r}-${c}`}
                      className="w-20 sm:w-24 h-12 bg-[#151E34] border border-slate-700 rounded flex items-center justify-center font-bold text-emerald-400 text-base"
                    >
                      {val}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Multiplication */}
        {activeOp === "multiply" && (
          <div className="space-y-3">
            <span className="text-xs font-mono text-slate-400 block border-b border-slate-800 pb-3">
              Matrix Product (A × B):
            </span>
            <div className="p-4 bg-[#080C16] border border-slate-800 rounded-lg flex justify-center">
              <div
                className="grid gap-3 font-mono"
                style={{ gridTemplateColumns: `repeat(${dim}, minmax(0, 1fr))` }}
              >
                {mulRes.map((row, r) =>
                  row.map((val, c) => (
                    <div
                      key={`${r}-${c}`}
                      className="w-20 sm:w-24 h-12 bg-[#151E34] border border-slate-700 rounded flex items-center justify-center font-bold text-[#00D4FF] text-base"
                    >
                      {val}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
