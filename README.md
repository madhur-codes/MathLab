# MathLab — Interactive Mathematical Computing & Visualization System

[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![GUI: Tkinter](https://img.shields.io/badge/GUI-Tkinter%20%2B%20ttk-orange.svg)](https://docs.python.org/3/library/tkinter.html)
[![Mathematics: SymPy & NumPy](https://img.shields.io/badge/Math-SymPy%20%7C%20NumPy-cyan.svg)](https://www.sympy.org/)
[![Visualization: Matplotlib](https://img.shields.io/badge/Plots-Matplotlib-purple.svg)](https://matplotlib.org/)
[![Database: SQLite3](https://img.shields.io/badge/Database-SQLite3-lightgrey.svg)](https://www.sqlite.org/)

**MathLab** is an integrated, collegiate-grade desktop mathematical computing environment and educational laboratory engineered in Python. It bridges symbolic computer algebra, numerical computation, empirical probability experiments, matrix linear algebra, descriptive statistics, and differential calculus within a modern dark graphical interface.

---

## 🏛️ Project Identity & Engineering Team

**Institution Project:** College Laboratory & Course Project Presentation  
**Lead Architecture & Coordination:**
- **Madhur (Team Head)**: System architecture, desktop GUI shell, navigation controller, SQLite database persistence layer, integration testing, documentation, and viva defense coordination.
- **Ramji (Mathematical Computation Specialist)**: Mathematical core engines, AST-safe expression parser, linear/quadratic/polynomial equation solver, matrix linear algebra algorithms, symbolic calculus (differentiation, indefinite/definite integrals, limits), and SymPy bindings.
- **Shiva (Visualization & Statistics Specialist)**: Dark-themed Matplotlib graphics engine, multi-function curve graphing studio, descriptive statistics distributions (histogram, box plot, bar, pie), and Monte Carlo probability simulations (coin toss & dice roll).

---

## 🌟 Key Capabilities & Modules

| Module | Core Functionality | Underlying Mathematics / Engine |
| :--- | :--- | :--- |
| **◈ Dashboard** | Real-time analytics, module usage frequency, recent calculation activity log, quick-launch action cards. | SQLite aggregated queries & event logging. |
| **∑ Scientific Calculator** | High-precision arithmetic, trigonometric, hyperbolic, logarithmic, and power functions with memory registers (M+, M-, MR, MC). | Python `math` module & recursive AST expression validation (no unsafe `eval()`). |
| **ƒ Equation Solver** | Step-by-step linear equation derivation, quadratic solver with discriminant ($\Delta = b^2 - 4ac$) analysis, 2x2 simultaneous systems, and general $n$-th degree polynomials. | SymPy symbolic roots & quadratic analytical formulas. |
| **📈 Graphing Laboratory** | Simultaneous multi-function plotting ($f_1(x), f_2(x), f_3(x)$), interactive domain scaling $[x_{\min}, x_{\max}]$, dark-theme grid, and high-resolution 300 DPI PNG export. | Matplotlib embedded canvas (`FigureCanvasTkAgg`) with NumPy vectorized evaluation. |
| **▦ Matrix Laboratory** | Addition, subtraction, matrix multiplication, scalar multiplication, transpose ($A^T$), determinant ($\det A$), inversion ($A^{-1}$), rank, trace, and eigenvalue/eigenvector spectral decomposition. | C-accelerated NumPy linear algebra with built-in pure Python fallback algorithms. |
| **σ Statistics Studio** | Sample and population mean, median, mode, sample/population variance, standard deviation, quartiles ($Q_1, Q_2, Q_3$), IQR, range, histogram, box plot, bar, and pie charts. | SciPy/NumPy descriptive metrics and Matplotlib statistical plots. |
| **P Probability Lab** | Empirical Monte Carlo coin toss ($N$ tosses) and fair dice roll ($N$ rolls) experiments, deviation from theoretical expectation, classical probability $P(A) = \frac{n(A)}{n(S)}$, and combinatorics ($nPr, nCr$). | Python `random` simulation engine, combinatorial factorials, and frequency distribution charts. |
| **∫ Calculus Studio** | Symbolic differentiation ($n$-th order derivatives), analytical indefinite integration ($+ C$), definite integration over $[a, b]$, limits $\lim_{x \to c} f(x)$, and derivative curve comparisons. | SymPy CAS engine with comparative Matplotlib plotting. |
| **⇄ Unit Converter** | Dimensional analysis and conversion across Length, Mass, Temperature, Area, Volume, Time, and Speed with instant reciprocal swap. | Standard SI and Imperial physical conversion coefficients. |
| **⚙ Settings & Diagnostics**| SQLite database maintenance (clear history, reset counters), application diagnostics, and system verification. | SQLite schema migrations and operational monitors. |

---

## 📐 System Architecture

MathLab is built on a clean 3-tier decoupled architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                    Desktop UI / View Layer                  │
│   (Tkinter + ttk, Modern Dark Theme: #0B1020, Segoe UI)     │
│   Dashboard | Calculator | Equations | Graphs | Matrices... │
└──────────────────────────────┬──────────────────────────────┘
                               │ Dispatches Actions
┌──────────────────────────────▼──────────────────────────────┐
│                    Core Engine Layer                        │
│   AST Validators | Safe Preprocessor | Helper Formatters    │
│   CalculatorEngine | EquationSolver | MatrixEngine          │
│   StatisticsEngine | ProbabilityEngine | CalculusEngine     │
└───────────────┬──────────────────────────────┬──────────────┘
                │                              │
┌───────────────▼──────────────┐┌──────────────▼──────────────┐
│     Data Persistence Layer   ││   Visualization Layer        │
│   SQLite Database (mathlab.db││   Matplotlib Dark Plots      │
│   Calculations & Activity Log││   Embedded TkAgg Canvas      │
└──────────────────────────────┘└─────────────────────────────┘
```

### Security Directives
- **Zero Unsafe `eval()`**: Dynamic user expressions are preprocessed and parsed using mathematical AST validation and SymPy's restricted symbol parsing.
- **Dependency Resilience**: Core calculations (matrices, statistics, probability, equations) include pure Python fallback algorithms, ensuring execution reliability even when external scientific libraries are absent.
- **Graceful Execution**: The application detects GUI display availability automatically; on headless servers or CI runners, it transitions into an interactive diagnostic engine.

---

## 🚀 Installation & Getting Started

### 1. Prerequisites
- Python 3.8 or higher
- Tkinter GUI library:
  - **Windows / macOS**: Bundled with official Python installer.
  - **Linux (Debian/Ubuntu)**: `sudo apt-get install python3-tk`
  - **Linux (Fedora)**: `sudo dnf install python3-tkinter`

### 2. Clone or Extract Project
```bash
git clone https://github.com/your-team/mathlab.git
cd mathlab
```

### 3. Install Python Dependencies
```bash
pip install -r requirements.txt
```

*Contents of `requirements.txt`:*
- `numpy>=1.22.0`
- `sympy>=1.10.0`
- `matplotlib>=3.5.0`
- `scipy>=1.8.0`

### 4. Run MathLab
To launch the desktop graphical interface:
```bash
python3 main.py
```

To run the automated engine diagnostics and self-test verification via terminal (or on headless servers):
```bash
python3 main.py --cli
```

---

## 🎨 Design System & Theme Specifications

MathLab implements a curated, distraction-free visual environment designed for extended mathematical research sessions:

- **Canvas Background**: Deep Obsidian Navy (`#0B1020`)
- **Secondary Surfaces & Panels**: Slate Secondary (`#111827`)
- **Interactive Cards**: Midnight Indigo (`#172033`)
- **Primary Cyber Accent**: Electric Cyan (`#00D4FF`)
- **Secondary Harmonic Accent**: Royal Violet (`#8B5CF6`)
- **Success & Verification**: Emerald Green (`#10B981`)
- **Alert & Error**: Coral Crimson (`#F87171`)
- **Typography**: Clean Segoe UI display pairing with Consolas / Menus Monospace for numerical precision.

---

## 📁 Repository Structure

```
mathlab/
│
├── main.py                     # Primary executable bootstrap and diagnostic entry point
├── requirements.txt            # Python dependencies specification
├── LICENSE                     # MIT Open Source License
├── README.md                   # Comprehensive repository documentation
├── PROJECT_REPORT.md           # Formal college project report
├── VIVA_QUESTIONS.md           # 30+ viva examination questions & solutions
├── USER_GUIDE.md               # User manual with step-by-step examples
├── MATHLAB_PRESENTATION.md     # 12-slide presentation structure & speaker notes
│
├── database/
│   ├── __init__.py
│   └── db_manager.py           # SQLite persistence layer and statistical aggregators
│
├── utils/
│   ├── __init__.py
│   ├── helpers.py              # Mathematical formatters, expression sanitizers
│   └── validators.py           # Input bounds checking, matrix shape validation
│
├── core/
│   ├── __init__.py
│   ├── calculator.py           # Scientific calculator engine with memory bank
│   ├── equations.py            # Linear, quadratic, simultaneous & polynomial solvers
│   ├── matrices.py             # Linear algebra engine with pure-Python fallback
│   ├── statistics.py           # Descriptive statistics analysis engine
│   ├── probability.py          # Monte Carlo simulator & combinatorics engine
│   └── calculus.py             # Symbolic differentiation, integration & limits
│
├── visualization/
│   ├── __init__.py
│   └── plots.py                # Matplotlib dark-theme charting & Figure generator
│
└── gui/
    ├── __init__.py
    ├── theme.py                # Color palette, font definitions, and ttk styles
    ├── app.py                  # Main application shell & sidebar controller
    ├── dashboard.py            # Overview dashboard & system status
    ├── calculator_view.py      # Scientific calculator grid & history drawer
    ├── equations_view.py       # Multi-category equation solver interface
    ├── graphing_view.py        # Multi-function graph canvas with PNG export
    ├── matrix_view.py          # Matrix dimensions grid & operations workbench
    ├── statistics_view.py      # Statistical table & distribution chart view
    ├── probability_view.py     # Coin/dice experiment simulator & probability tool
    ├── calculus_view.py        # Differential & integral calculus studio
    ├── converter_view.py       # Dimensional unit conversion workbench
    └── settings_view.py        # Database administration & team credits
```

---

## 🧪 Testing & Quality Assurance

All core computing engines are unit tested for numerical precision, edge conditions (such as zero division, singular matrices, negative square roots, and empty datasets), and AST injection safety.

To execute the diagnostic test suite:
```bash
python3 main.py --cli
```

---

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
Developed with academic excellence for college demonstration and viva evaluation.
