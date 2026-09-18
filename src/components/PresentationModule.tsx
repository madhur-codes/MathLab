import React, { useState } from "react";
import { PRESENTATION_SLIDES } from "../data/slidesData";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Volume2, Users, FileText, CheckCircle2 } from "lucide-react";

export const PresentationModule: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const slide = PRESENTATION_SLIDES[currentSlideIndex];
  const totalSlides = PRESENTATION_SLIDES.length;

  const nextSlide = () => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  return (
    <div className={`space-y-6 ${isFullscreen ? "fixed inset-0 z-50 bg-[#070B14] p-8 overflow-y-auto" : ""}`}>
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-bold text-white tracking-tight">Presentation & Defense Deck</h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/60 text-[#00D4FF]">
              12 Professional Slides
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Official project defense slides with team roles, architectural diagrams, and verbatim speaker notes.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
              showSpeakerNotes
                ? "bg-amber-950/40 text-amber-300 border-amber-700/60"
                : "bg-[#0E1526] text-slate-400 border-slate-800"
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{showSpeakerNotes ? "Speaker Notes ON" : "Speaker Notes OFF"}</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#0E1526] hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
          </button>
        </div>
      </div>

      {/* Main Slide Card */}
      <div className="bg-[#0B1020] border border-cyan-900/50 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden min-h-[420px] flex flex-col justify-between">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top Slide Meta */}
        <div>
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#00D4FF] text-slate-950">
                SLIDE {slide.num} / {totalSlides}
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                MathLab Academic Evaluation
              </span>
            </div>

            {/* Team Roles Pill */}
            <div className="flex items-center space-x-2 text-[11px] font-mono">
              <span className="text-slate-400">Head of Project:</span>
              <span className="text-white font-medium">Madhur</span>
              <span className="text-slate-600">|</span>
              <span className="text-cyan-400">Ramji (Comp)</span>
              <span className="text-slate-600">•</span>
              <span className="text-purple-400">Shiva (Vis)</span>
            </div>
          </div>

          {/* Slide Title & Subtitle */}
          <div className="space-y-2 mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              {slide.title}
            </h1>
            <h2 className="text-sm sm:text-base font-semibold text-[#00D4FF]">
              {slide.subtitle}
            </h2>
          </div>

          {/* Bullets List */}
          <div className="space-y-3.5 my-6 max-w-3xl">
            {slide.bullets.map((bullet, idx) => (
              <div key={idx} className="flex items-start space-x-3">
                <CheckCircle2 className="w-4 h-4 text-[#00D4FF] mt-0.5 shrink-0" />
                <span className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
                  {bullet}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Slide Footer Navigation */}
        <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between mt-8">
          <button
            onClick={prevSlide}
            disabled={currentSlideIndex === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold text-xs transition-all ${
              currentSlideIndex === 0
                ? "text-slate-600 bg-slate-900/50 cursor-not-allowed"
                : "text-white bg-[#151E34] hover:bg-slate-800 border border-slate-700 cursor-pointer"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Slide</span>
          </button>

          {/* Slide Indicator dots */}
          <div className="flex items-center space-x-1.5 overflow-x-auto max-w-xs">
            {PRESENTATION_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlideIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentSlideIndex === i ? "w-6 bg-[#00D4FF]" : "bg-slate-700 hover:bg-slate-500"
                }`}
                title={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            disabled={currentSlideIndex === totalSlides - 1}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold text-xs transition-all ${
              currentSlideIndex === totalSlides - 1
                ? "text-slate-600 bg-slate-900/50 cursor-not-allowed"
                : "text-slate-950 bg-[#00D4FF] hover:bg-cyan-400 font-bold shadow-lg shadow-cyan-500/20 cursor-pointer"
            }`}
          >
            <span>Next Slide</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Speaker Notes Drawer */}
      {showSpeakerNotes && (
        <div className="bg-[#0E1526] border border-amber-900/40 rounded-xl p-5 shadow-xl space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span>Verbatim Defense Speaker Script (For Oral Presentation):</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans bg-[#080C16] p-4 rounded-lg border border-slate-800">
            "{slide.speaker}"
          </p>
        </div>
      )}
    </div>
  );
};
