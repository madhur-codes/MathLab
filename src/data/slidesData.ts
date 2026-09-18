import { PresentationSlide } from "../types";

export const PRESENTATION_SLIDES: PresentationSlide[] = [
  {
    num: 1,
    title: "MathLab: Project Identity & Engineering Team",
    subtitle: "Interactive Mathematical Computing & Visualization System",
    bullets: [
      "Target Audience: College students, STEM educators, and researchers",
      "Technology Stack: Python 3, Tkinter/ttk, SymPy, NumPy, Matplotlib, SQLite",
      "Core Philosophy: Unified environment, zero black-box obscurity, educational transparency",
      "Head of Project: Madhur (Full System Architecture, Desktop Shell & Database Core)",
      "Specialist Contributors: Ramji (Computation), Shiva (Visualization)"
    ],
    layoutDescription: "Deep obsidian navy canvas (#0B1020) with electric cyan typography, prominent MathLab logo, and academic defense metadata.",
    speaker: "Good morning, respected professors and members of the evaluation committee. Led by our Head of Project Madhur, alongside computational specialist Ramji and visualization specialist Shiva, we present MathLab: an Interactive Mathematical Computing and Visualization System. MathLab eliminates fragmented tools by synthesizing scientific computation, computer algebra, empirical simulations, and data visualization into a unified, secure, and modern desktop application."
  },
  {
    num: 2,
    title: "The Problem & Educational Motivation",
    subtitle: "Overcoming Tool Fragmentation & Black-Box Calculators",
    bullets: [
      "Tool Fragmentation: Switching between 4-5 disparate utilities during study",
      "The 'Black Box' Barrier: Calculators output numbers without analytical derivations",
      "Prohibitive Costs & Footprint: Commercial tools (Mathematica/MATLAB) cost thousands and consume 15+ GB",
      "Security Pitfalls in Student Tools: Vulnerable eval() calls executing arbitrary code"
    ],
    layoutDescription: "Two-column comparison card: Current Fragmented Landscape (Red) vs The MathLab Paradigm (Emerald Green).",
    speaker: "Commercial software gives answers without derivations, while student projects compromise security with eval(). MathLab delivers transparent, step-by-step mathematical derivations securely, running offline with zero server requirements."
  },
  {
    num: 3,
    title: "Core Architecture & Decoupled Design",
    subtitle: "Model-View-Controller (MVC) Pattern & Separation of Concerns",
    bullets: [
      "Strict MVC Separation: core/ (Logic) ↔ gui/ (Presentation) ↔ database/ (Persistence)",
      "Decoupled Calculation Engines: Zero Tkinter dependencies inside core math algorithms",
      "Single-Window Shell: Dynamic frame switching preventing window clutter and memory leaks",
      "Robust Dependency Fallback: Pure Python linear algebra algorithms when NumPy is absent"
    ],
    layoutDescription: "Three-tier architecture diagram showing core engines communicating through strict APIs with the Tkinter desktop shell and SQLite storage.",
    speaker: "Our calculation engines are decoupled from GUI components, allowing seamless operation across desktop graphical environments and headless command-line interfaces. If external scientific packages are missing, pure Python fallbacks ensure the software never crashes."
  },
  {
    num: 4,
    title: "Scientific Calculator: AST Safety & Precision",
    subtitle: "Safe Expression Evaluation Without Arbitrary Code Execution",
    bullets: [
      "Abstract Syntax Tree (AST) parser eliminating code injection risks",
      "Comprehensive functions: Trigonometric, Hyperbolic, Logarithms, Powers, Factorials",
      "Dual Angle Mode: Seamless switching between Radians and Degrees",
      "Hardware Memory Bank: Dedicated registers for M+, M-, MR, and MC"
    ],
    layoutDescription: "Scientific keypad layout with live expression preview, memory status pill, and AST token validation badge.",
    speaker: "Ramji implemented the AST expression parser using Python's ast module. It verifies node types recursively, guaranteeing that no arbitrary Python commands or system exploits can be executed."
  },
  {
    num: 5,
    title: "Equation Solver Studio: Multi-Category Algebra",
    subtitle: "Linear, Quadratic, 2x2 Simultaneous, and Polynomial Roots",
    bullets: [
      "Quadratic Solver: Discriminant (Δ = b² - 4ac) analysis, vertex formula, and root classification",
      "Linear Solver: Single-variable equations with symbolic algebraic rearrangement",
      "Simultaneous Systems (2x2): Cramer's Rule determinants (D, Dx, Dy) and parallel/coincident line detection",
      "Polynomial Roots: SymPy symbolic root extraction for general n-th degree polynomials"
    ],
    layoutDescription: "Tabbed solver interface with step-by-step derivation card, discriminant status badge, and exact fractional root representations.",
    speaker: "In the Equation Solver Studio, engineered by Ramji, we support linear, quadratic, 2x2 simultaneous, and general polynomial equations. When solving ax² + bx + c = 0, MathLab displays the discriminant, root nature, step-by-step formula expansion, and parabola vertex."
  },
  {
    num: 6,
    title: "Graphing Laboratory: Embedded Matplotlib Studio",
    subtitle: "Interactive Function Visualizer & Publication-Ready Graphics",
    bullets: [
      "Embedded Matplotlib Canvas: FigureCanvasTkAgg integration inside the Tkinter frame",
      "Multi-Function Plotting: Graph up to 3 simultaneous curves (f1, f2, f3) on common axes",
      "Asymptote Masking: Automated singularity detection (NaN filtering) eliminating artifact lines",
      "High-Resolution Export: Direct 300 DPI publication-quality PNG file generation"
    ],
    layoutDescription: "Dark-themed coordinate plot with multi-function legend, domain bounds controls, and one-click 300 DPI save button.",
    speaker: "Our Graphing Laboratory, developed by Shiva, embeds Matplotlib directly into the desktop window. Students can plot up to three simultaneous functions to examine intersections and wave interference. Automated asymptote detection masks discontinuities with NaNs, preventing visual artifacts."
  },
  {
    num: 7,
    title: "Matrix Laboratory: Linear Algebra Workspace",
    subtitle: "Matrix Transformations, Determinants, and Inverses",
    bullets: [
      "Dynamic Dimensions: Configurable matrix grids (2x2, 3x3, custom)",
      "Matrix Arithmetic: Addition (A + B), Subtraction (A - B), Multiplication (A × B)",
      "Spectral & Scalar Operations: Determinant det(A), Trace, Rank, Transpose Aᵀ",
      "Matrix Inversion: Adjugate method with singularity detection (det = 0 rejection)"
    ],
    layoutDescription: "Dual matrix entry grid with quick operation buttons, step-by-step determinant expansion card, and inverse validation.",
    speaker: "Ramji developed the linear algebra engine in core/matrices.py. It computes determinants, traces, transposes, and matrix inverses. When a matrix is singular, it halts safely with an informative mathematical explanation."
  },
  {
    num: 8,
    title: "Statistics Studio: Data Analysis & Distribution Visuals",
    subtitle: "Comprehensive Descriptive Statistics & Embedded Charts",
    bullets: [
      "Measures of Central Tendency: Mean, Median, and multi-modal Mode calculation",
      "Measures of Dispersion: Population variance, sample variance (Bessel's correction), and std dev",
      "Five-Number Summary: Min, Q1 (25th percentile), Q2 (Median), Q3 (75th percentile), Max, and IQR",
      "Outlier Detection: Tukey's 1.5 × IQR fencing rule with visual outlier flag",
      "Visual Distribution Charts: Embedded SVG/Matplotlib histograms, box plots, and bar charts"
    ],
    layoutDescription: "Side-by-side view: Statistical summary metrics table on the left, distribution histogram and box plot on the right.",
    speaker: "Shiva developed the Statistics Studio. It computes comprehensive descriptive statistics, detects outliers using Tukey's method, and visualizes distributions through synchronized histograms and box-and-whisker plots."
  },
  {
    num: 9,
    title: "Probability Laboratory: Monte Carlo Simulations",
    subtitle: "Empirical Trials, Fair Dice, and Combinatorics",
    bullets: [
      "Monte Carlo Coin Toss: Scalable simulations from 10 to 50,000 trials",
      "Law of Large Numbers: Running convergence chart showing empirical frequency approaching 0.50",
      "Fair Dice Roll Simulator: 6-sided dice roll distributions with frequency analysis",
      "Combinatorics Tool: High-precision Factorials (n!), Permutations (nPr), and Combinations (nCr)"
    ],
    layoutDescription: "Simulation control panel with trial slider, outcome counter cards, and animated convergence line chart.",
    speaker: "The Probability Laboratory, engineered by Shiva, visualizes the Law of Large Numbers through Monte Carlo simulations. As students increase trials to 10,000+, the empirical frequency visibly converges to the theoretical probability."
  },
  {
    num: 10,
    title: "Calculus Studio & Engineering Unit Converter",
    subtitle: "Symbolic CAS Differentiation, Integration, and Physical Units",
    bullets: [
      "Symbolic Differentiation: First & second derivatives (f', f'') with rule breakdowns",
      "Indefinite & Definite Integration: Closed-form antiderivatives with '+ C' and numerical quadrature",
      "Limit Evaluator: Left-hand, right-hand, and two-sided limit analysis",
      "Multi-Category Converter: 8 engineering domains (Length, Mass, Temp, Area, Volume, Time, Speed, Digital)"
    ],
    layoutDescription: "Calculus derivation panel with dual-curve plot (function vs derivative) alongside the instant multi-unit conversion grid.",
    speaker: "Ramji implemented the symbolic calculus module using SymPy, ensuring rigorous mathematical output like the '+ C' integration constant. Madhur integrated the 8-category engineering unit converter with normalized base-unit scaling."
  },
  {
    num: 11,
    title: "Persistence Layer, Security & CLI Diagnostics",
    subtitle: "Embedded SQLite Architecture & Automated Self-Testing",
    bullets: [
      "ACID Storage Engine: Embedded SQLite database (mathlab.db) with normalized tables",
      "SQL Injection Immunity: 100% parameterized queries using ? placeholders",
      "Usage Analytics: Real-time module frequency counters and recent calculation logs",
      "Automated CLI Diagnostics: Headless execution verification via 'python3 main.py --cli'"
    ],
    layoutDescription: "SQLite schema diagram, calculation log table preview, and terminal diagnostic self-test output.",
    speaker: "Madhur designed the database persistence layer using SQLite. Every query uses parameterized placeholders, guaranteeing immunity from SQL injection. Main.py supports headless CLI diagnostics for automated grading."
  },
  {
    num: 12,
    title: "Work Distribution, Conclusion & Academic Roadmap",
    subtitle: "Team Contributions, Production Artifacts & Future Enhancements",
    bullets: [
      "Head of Project: Madhur — End-to-End System Architecture, GUI Shell, SQLite Persistence, Unit Converter, Project Documentation",
      "Ramji (Computation Specialist): Math Engines, AST Calculator, Equation Solvers, Matrix Algebra, Symbolic Calculus",
      "Shiva (Visualization Specialist): Matplotlib Graphics, Graphing Studio, Statistics Distributions, Monte Carlo Simulations",
      "Future Roadmap: 3D surface plotting (z = f(x, y)), ODE solvers (Runge-Kutta RK4), and CSV/Excel import"
    ],
    layoutDescription: "Structured division of labor breakdown alongside key software metrics, code distribution, and future project milestones.",
    speaker: "In conclusion, MathLab demonstrates how modern software engineering principles can be applied to build a collegiate-grade educational platform. Head of Project Madhur spearheaded the system architecture, database layer, and Tkinter GUI shell, while Ramji and Shiva contributed mathematical engines and visualization modules. Thank you for your time, and we welcome your questions."
  }
];
