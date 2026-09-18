import React, { useState } from "react";
import { History, Database, Download, Trash2, Search, CheckCircle, Cpu, ShieldCheck, User } from "lucide-react";
import { CalculationLog } from "../types";

interface HistoryModuleProps {
  logs: CalculationLog[];
  onClearLogs: () => void;
}

export const HistoryModule: React.FC<HistoryModuleProps> = ({ logs, onClearLogs }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredLogs = logs.filter(
    (l) =>
      l.expression.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.result.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.module.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "mathlab_calculation_history.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-bold text-white tracking-tight">Database & Persistence Studio</h2>
            <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-800/90 border border-slate-700 text-slate-300 font-medium flex items-center space-x-1.5">
              <span>Head of Project: Madhur</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Embedded SQLite persistence engine (mathlab.db), parameterized query security, and calculation analytics.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={exportJSON}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#0E1526] hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={onClearLogs}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-950/30 hover:bg-rose-900/50 border border-rose-800/40 text-xs text-rose-300 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Head of Project */}
        <div className="p-4 bg-[#0E1526] border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono uppercase text-[10px] tracking-wider text-slate-400">Head of Project</span>
            <User className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white">Madhur</div>
          <span className="text-[10px] text-slate-400 font-mono block">
            System & SQLite Architecture
          </span>
        </div>

        {/* Card 2: Queries Logged */}
        <div className="p-4 bg-[#0E1526] border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Queries Logged</span>
            <Database className="w-4 h-4 text-[#00D4FF]" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{logs.length}</div>
          <span className="text-[10px] text-emerald-400 font-mono flex items-center space-x-1">
            <CheckCircle className="w-3 h-3" />
            <span>SQLite Table Synced</span>
          </span>
        </div>

        {/* Card 3: Ramji */}
        <div className="p-4 bg-[#0E1526] border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Computation Core</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-lg font-bold font-mono text-cyan-300">Ramji (Comp)</div>
          <span className="text-[10px] text-slate-500 font-mono">AST & Equations Engine</span>
        </div>

        {/* Card 4: Shiva */}
        <div className="p-4 bg-[#0E1526] border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Visualization Layer</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-lg font-bold font-mono text-purple-300">Shiva (Vis)</div>
          <span className="text-[10px] text-slate-500 font-mono">Plots & Stats Engine</span>
        </div>
      </div>

      {/* Logs Table Card */}
      <div className="bg-[#0E1526] border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search queries by expression or result..."
            className="w-full bg-[#151E34] border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none font-mono"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Module</th>
                <th className="py-2.5 px-3">Expression Input</th>
                <th className="py-2.5 px-3">Result Output</th>
                <th className="py-2.5 px-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">
                    No calculations recorded in this session.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, idx) => (
                  <tr key={log.id} className="hover:bg-[#151E34]/50 transition-colors">
                    <td className="py-2.5 px-3 text-slate-500">{idx + 1}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/40 text-[#00D4FF] text-[10px]">
                        {log.module}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-white font-semibold">{log.expression}</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">{log.result}</td>
                    <td className="py-2.5 px-3 text-slate-500 text-[11px]">{log.timestamp}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
