export type NavigationTab =
  | "workbench"
  | "report"
  | "viva"
  | "guide"
  | "presentation"
  | "files";

export type WorkbenchModule =
  | "calculator"
  | "equations"
  | "graphing"
  | "matrices"
  | "statistics"
  | "probability"
  | "calculus"
  | "converter";

export interface VivaQuestion {
  id: number;
  category: string;
  question: string;
  answer: string;
  keywords: string[];
  keyConcepts?: string[];
}

export interface PresentationSlide {
  num: number;
  title: string;
  subtitle?: string;
  bullets: string[];
  layoutDescription: string;
  speaker: string;
  anticipatedQA?: { q: string; a: string };
}

export interface CalculationHistoryItem {
  id: string;
  module: string;
  expression: string;
  result: string;
  timestamp: string;
}

export type CalculationLog = CalculationHistoryItem;
