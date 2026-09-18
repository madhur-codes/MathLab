import React, { useState, useMemo } from "react";
import { VIVA_QUESTIONS } from "../data/vivaData";
import { Search, HelpCircle, ChevronDown, ChevronUp, Bookmark, BookmarkCheck, CheckCircle2, UserCheck } from "lucide-react";

export const VivaModule: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedIds, setExpandedIds] = useState<number[]>([1, 26, 27, 28]);
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([1, 27, 28]);

  const categories = [
    { id: "all", label: "All Questions (30)" },
    { id: "Architecture & Design", label: "Architecture (6)" },
    { id: "Mathematics & Computing", label: "Math & Computing (8)" },
    { id: "Python, Libraries & Tools", label: "Python & Libraries (6)" },
    { id: "Algorithms, Complexity & Performance", label: "Algorithms (5)" },
    { id: "Project Defense & Team Contributions", label: "Team Defense (5)" },
  ];

  const filteredQuestions = useMemo(() => {
    return VIVA_QUESTIONS.filter((q) => {
      const matchesCategory = selectedCategory === "all" || q.category === selectedCategory;
      const terms = q.keyConcepts || q.keywords || [];
      const matchesSearch =
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        terms.some((k: string) => k.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleBookmark = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const expandAll = () => {
    setExpandedIds(filteredQuestions.map((q) => q.id));
  };

  const collapseAll = () => {
    setExpandedIds([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-bold text-white tracking-tight">Viva Preparation Studio</h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-800/60 text-emerald-300">
              30 Curated Defense Questions
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Comprehensive college viva questions, technical answers, key architectural concepts, and team attribution.
          </p>
        </div>

        {/* Expand / Collapse buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={expandAll}
            className="px-2.5 py-1.5 rounded-lg bg-[#0E1526] hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-colors"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-2.5 py-1.5 rounded-lg bg-[#0E1526] hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-colors"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Project & Role Overview Bar */}
      <div className="bg-[#0E1526] border border-slate-800 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="text-[11px] uppercase tracking-wider text-slate-500">Head of Project:</span>
          <span className="text-white font-medium">Madhur</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Architecture, Desktop Shell & SQLite</span>
        </div>
        <div className="flex items-center space-x-3 text-slate-400 text-[11px]">
          <span>Ramji (Computation)</span>
          <span className="text-slate-700">•</span>
          <span>Shiva (Visualization)</span>
        </div>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search viva questions by keyword (e.g., AST, Cramer, Shiva, Ramji, SQLite, Bessel)..."
            className="w-full bg-[#0E1526] border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
          />
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? "bg-[#00D4FF] text-slate-950 font-bold"
                  : "bg-[#0E1526] hover:bg-slate-800 text-slate-300 border border-slate-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filteredQuestions.length === 0 ? (
          <div className="p-12 text-center bg-[#0E1526] border border-slate-800 rounded-xl text-slate-400 text-sm">
            No viva questions matched your query.
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isExpanded = expandedIds.includes(q.id);
            const isBookmarked = bookmarkedIds.includes(q.id);

            return (
              <div
                key={q.id}
                className={`bg-[#0E1526] border rounded-xl overflow-hidden transition-all ${
                  isExpanded ? "border-cyan-700/60 shadow-lg" : "border-slate-800 hover:border-slate-700"
                }`}
              >
                {/* Question Header Bar */}
                <div
                  onClick={() => toggleExpand(q.id)}
                  className="p-4 sm:p-5 flex items-start justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-start space-x-3.5">
                    <span className="w-7 h-7 rounded-lg bg-[#151E34] border border-slate-700 flex items-center justify-center font-mono font-bold text-xs text-[#00D4FF] shrink-0 mt-0.5">
                      Q{q.id}
                    </span>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          {q.category}
                        </span>
                        {q.id >= 26 && (
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 text-[#00D4FF] border border-cyan-800 flex items-center space-x-1">
                            <UserCheck className="w-3 h-3" />
                            <span>Team Attribution</span>
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                        {q.question}
                      </h3>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={(e) => toggleBookmark(q.id, e)}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
                      title="Bookmark Question"
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                    <div className="text-slate-500">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Answer Body */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-800/80 space-y-4">
                    <div className="bg-[#080C16] p-4 rounded-lg border border-slate-800/80">
                      <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase block mb-1.5">
                        Definitive Technical Answer:
                      </span>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                        {q.answer}
                      </p>
                    </div>

                    {/* Key Concepts Pills */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mr-1">
                        Key Concepts:
                      </span>
                      {(q.keyConcepts || q.keywords || []).map((concept: string, idx: number) => (
                        <span
                          key={idx}
                          className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#151E34] text-cyan-300 border border-slate-700/60"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
