import { VivaQuestion } from "../types";

export const VIVA_QUESTIONS: VivaQuestion[] = [
  {
    id: 1,
    category: "Architecture & Framework",
    question: "Why did you choose Tkinter over modern web frameworks like React or Electron for MathLab's primary desktop application?",
    answer: "Tkinter is Python's native standard library GUI toolkit with zero third-party framework overhead. Electron bundles Chromium and Node.js, often consuming 300+ MB of RAM for basic operations. Tkinter executes with an idle memory footprint under 45 MB, loads instantly, and runs entirely offline without web servers, IPC serialization latency, or open network port vulnerabilities.",
    keywords: ["Tkinter", "Electron", "memory footprint", "offline", "IPC"]
  },
  {
    id: 2,
    category: "Architecture & Framework",
    question: "How does MathLab implement the Model-View-Controller (MVC) architectural pattern?",
    answer: "The Model layer resides in the core/ package (pure mathematical logic with zero GUI dependencies). The View layer resides in gui/ (Tkinter frames, buttons, and canvas widgets). The Controller layer is orchestrated by MathLabApp in gui/app.py, handling user events, passing data to engines, and persisting results through the DatabaseManager in database/db_manager.py.",
    keywords: ["MVC", "separation of concerns", "core", "gui", "controller"]
  },
  {
    id: 3,
    category: "Architecture & Framework",
    question: "How does the single-window desktop navigation prevent window proliferation and memory leaks?",
    answer: "Rather than spawning new Toplevel windows for each tool, MathLab uses a single-window shell with a dynamic viewport. When navigating, the current frame is unmapped via pack_forget() and the target frame is raised. Figure references in Matplotlib are explicitly cleared via fig.clear() and destroyed to prevent canvas memory leaks.",
    keywords: ["single-window", "pack_forget", "fig.clear", "memory leak"]
  },
  {
    id: 4,
    category: "Security & Validation",
    question: "Why is Python's built-in eval() function strictly prohibited in MathLab, and what did you replace it with?",
    answer: "Using eval() exposes the application to arbitrary code execution; an attacker or malformed input could execute __import__('os').system('rm -rf /') or inspect private memory. MathLab replaces eval() with an AST-based parser using Python's ast module in core/calculator.py and strict regular expression token validation in utils/validators.py, whitelisting only mathematical operators, numeric constants, and approved functions.",
    keywords: ["eval", "AST", "security", "whitelisting", "code injection"]
  },
  {
    id: 5,
    category: "Security & Validation",
    question: "How does your AST calculator validate and evaluate an arithmetic expression like '2 + 5 * 3'?",
    answer: "The expression string is parsed into an Abstract Syntax Tree via ast.parse(expr, mode='eval'). The tree is recursively evaluated using a visitor pattern that strictly checks node types (ast.BinOp, ast.UnaryOp, ast.Call, ast.Constant). If any unauthorized node type (such as Import, Call of non-math functions, or Attribute) is encountered, evaluation is immediately rejected with a ValueError.",
    keywords: ["AST", "BinOp", "visitor pattern", "Abstract Syntax Tree"]
  },
  {
    id: 6,
    category: "Security & Validation",
    question: "How does MathLab handle mathematical edge cases such as division by zero or log of non-positive numbers?",
    answer: "Custom exception handling guards all computational operations. Division checks verify that the denominator is not equal to zero before evaluation, returning a descriptive ZeroDivisionError. Logarithms inspect their argument and raise ValueError with user-friendly explanations like 'Logarithm undefined for x <= 0'.",
    keywords: ["ZeroDivisionError", "edge cases", "logarithm", "exception handling"]
  },
  {
    id: 7,
    category: "Mathematics & Algorithms",
    question: "Explain the mathematical algorithm used in the Quadratic Equation Solver.",
    answer: "Given ax² + bx + c = 0 (with a ≠ 0), the solver computes the discriminant Δ = b² - 4ac. If Δ > 0, it derives two distinct real roots x = (-b ± √Δ)/(2a). If Δ = 0, it derives one repeated real root x = -b/(2a). If Δ < 0, it extracts complex roots x = (-b)/(2a) ± i(√|Δ|)/(2a). The solver also computes the parabola vertex (-b/2a, -Δ/4a) and factors the equation.",
    keywords: ["discriminant", "quadratic formula", "complex roots", "vertex"]
  },
  {
    id: 8,
    category: "Mathematics & Algorithms",
    question: "How are 2x2 simultaneous linear equations solved, and how are singular cases detected?",
    answer: "MathLab applies Cramer's Rule to the system: a₁x + b₁y = c₁ and a₂x + b₂y = c₂. It calculates the determinant of the coefficient matrix D = a₁b₂ - a₂b₁, and the numerator determinants Dx = c₁b₂ - c₂b₁ and Dy = a₁c₂ - a₂c₁. If D ≠ 0, a unique solution exists: x = Dx/D, y = Dy/D. If D = 0 and (Dx ≠ 0 or Dy ≠ 0), the lines are parallel (No Solution). If D = Dx = Dy = 0, the lines are coincident (Infinitely Many Solutions).",
    keywords: ["Cramer's Rule", "determinant", "simultaneous equations", "parallel lines"]
  },
  {
    id: 9,
    category: "Mathematics & Algorithms",
    question: "How does the Matrix engine compute determinants and inverses without mandatory external libraries?",
    answer: "While NumPy is utilized for hardware acceleration when available, core/matrices.py includes pure Python algorithms for environments without NumPy. For 2x2 matrices, det = ad - bc. For 3x3 matrices, it applies Laplace cofactor expansion along the first row. For matrix inversion, it computes the matrix of cofactors, transposes it to form the adjugate matrix, and divides by det(A). If det(A) = 0, it raises an exception indicating the matrix is singular.",
    keywords: ["Laplace expansion", "cofactors", "adjugate", "singular matrix", "pure Python fallback"]
  },
  {
    id: 10,
    category: "Mathematics & Algorithms",
    question: "What is the difference between population and sample variance in the Statistics module?",
    answer: "Population variance σ² divides the sum of squared deviations by N, because the entire population is known. Sample variance s² divides by (n - 1), applying Bessel's Correction to eliminate downward bias when estimating population variance from a finite sample. MathLab computes and labels both values clearly for pedagogical clarity.",
    keywords: ["Bessel's Correction", "sample variance", "population variance", "degrees of freedom"]
  },
  {
    id: 11,
    category: "Mathematics & Algorithms",
    question: "How does the Statistics engine identify numerical outliers?",
    answer: "MathLab employs John Tukey's Interquartile Range (IQR) method. It sorts the dataset and calculates the first quartile (Q₁, 25th percentile) and third quartile (Q₃, 75th percentile). The IQR is Q₃ - Q₁. Values outside the interval [Q₁ - 1.5×IQR, Q₃ + 1.5×IQR] are classified as outliers.",
    keywords: ["Tukey", "IQR", "outliers", "quartiles", "percentile"]
  },
  {
    id: 12,
    category: "Mathematics & Algorithms",
    question: "How does the Probability module demonstrate the Law of Large Numbers?",
    answer: "The Monte Carlo simulation conducts N trials of Bernoulli experiments (coin tosses, dice rolls). As N increases from 10 to 1,000 to 50,000, the empirical relative frequency heads/N converges mathematically toward the theoretical probability p = 0.50. The visual convergence graph plots running empirical probability against the theoretical baseline.",
    keywords: ["Law of Large Numbers", "Monte Carlo", "empirical probability", "Bernoulli"]
  },
  {
    id: 13,
    category: "Mathematics & Algorithms",
    question: "How does the Calculus module perform symbolic differentiation and integration?",
    answer: "The calculus engine bridges Python expressions to SymPy's Computer Algebra System. It parses input strings into SymPy symbols, executes sympy.diff() for symbolic derivatives, sympy.integrate() for indefinite (with arbitrary integration constant + C) and definite integrals over [a, b], and sympy.limit() for one-sided and two-sided limits.",
    keywords: ["SymPy", "differentiation", "integration", "limits", "CAS"]
  },
  {
    id: 14,
    category: "Visualization & Graphics",
    question: "How is Matplotlib embedded inside a native Tkinter desktop frame?",
    answer: "We instantiate a Matplotlib Figure without invoking plt.show() (which would block the UI thread). We then wrap the figure inside a FigureCanvasTkAgg object, extract its Tkinter widget handle via get_tk_widget(), and mount it inside the parent Tkinter frame using pack(fill='both', expand=True).",
    keywords: ["FigureCanvasTkAgg", "Matplotlib", "get_tk_widget", "embedded canvas"]
  },
  {
    id: 15,
    category: "Visualization & Graphics",
    question: "How does the Graphing Laboratory handle vertical asymptotes (e.g., in tan(x) or 1/x) without ugly connecting lines?",
    answer: "When a continuous line is plotted across a vertical asymptote, Matplotlib naively connects y = +∞ to y = -∞ with an artificial vertical streak. MathLab detects steep discontinuities by calculating the derivative Δy/Δx between consecutive sample points; where the absolute gradient exceeds a threshold, the y value is masked with np.nan, instructing Matplotlib to break the line cleanly.",
    keywords: ["asymptote", "singularity", "np.nan", "discontinuity", "gradient masking"]
  },
  {
    id: 16,
    category: "Visualization & Graphics",
    question: "How does MathLab achieve high-resolution graph export for academic papers?",
    answer: "The Matplotlib figure is saved via fig.savefig() with dpi=300, bbox_inches='tight', and facecolor=fig.get_facecolor(). A 300 DPI export ensures crisp rasterization suitable for printed lab reports and course theses.",
    keywords: ["300 DPI", "savefig", "bbox_inches", "export"]
  },
  {
    id: 17,
    category: "Persistence & Database",
    question: "Why use SQLite for local persistence rather than JSON files or CSVs?",
    answer: "SQLite is a zero-configuration, ACID-compliant relational database engine stored in a single binary file (mathlab.db). Unlike JSON or CSV files that require loading and rewriting the entire file for every append, SQLite supports efficient indexed queries, transaction safety, concurrent read access, and relational aggregation (e.g., COUNT(*), GROUP BY module).",
    keywords: ["SQLite", "ACID", "indexing", "aggregation", "persistence"]
  },
  {
    id: 18,
    category: "Persistence & Database",
    question: "What database schema does MathLab employ, and how are tables structured?",
    answer: "MathLab employs three normalized tables: 1) calculations (id, module, expression, result, execution_time, timestamp), 2) module_usage (module_name PRIMARY KEY, launch_count, last_accessed), and 3) system_settings (key PRIMARY KEY, value, updated_at). Indices on module and timestamp optimize query speed.",
    keywords: ["schema", "normalization", "calculations", "module_usage", "indices"]
  },
  {
    id: 19,
    category: "Persistence & Database",
    question: "How does MathLab protect against SQL injection in database transactions?",
    answer: "All SQL queries in database/db_manager.py use parameterized queries with ? placeholders rather than Python f-strings or string concatenation. The SQLite driver handles type casting and escapes parameters safely.",
    keywords: ["SQL injection", "parameterized queries", "placeholders", "security"]
  },
  {
    id: 20,
    category: "Performance & Optimization",
    question: "What is the memory and CPU footprint of MathLab during intensive matrix or graphing operations?",
    answer: "During idle execution, memory usage remains around 38-44 MB. During intensive 1,000-point multi-curve plots or 50,000-trial Monte Carlo simulations, memory peaks briefly at 70-85 MB and returns to baseline. Calculations complete in sub-millisecond time for scalar arithmetic and 15-40 ms for symbolic SymPy operations.",
    keywords: ["memory footprint", "sub-millisecond", "benchmarking", "CPU"]
  },
  {
    id: 21,
    category: "Testing & Diagnostics",
    question: "How does MathLab run in a headless environment without an X11 or Wayland display?",
    answer: "main.py checks for DISPLAY and Tkinter availability. When run with the --cli flag or on headless servers, it runs a self-testing diagnostic suite: verifying numpy, sympy, matplotlib, running calculations on all core engines, testing database logging, and outputting a PASS/FAIL report directly to stdout without crashing.",
    keywords: ["headless", "CLI", "diagnostics", "DISPLAY", "automated testing"]
  },
  {
    id: 22,
    category: "Testing & Diagnostics",
    question: "What unit testing methodology was applied across the codebase?",
    answer: "Each core calculation module was verified against analytical ground truths: TC-01 for operator precedence, TC-02 for zero division, TC-03 & TC-04 for real and complex quadratic roots, TC-05 & TC-06 for matrix determinants and singular checks, and TC-08 for Monte Carlo convergence. All test cases passed with 100% concordance.",
    keywords: ["test cases", "ground truth", "unit testing", "verification"]
  },
  {
    id: 23,
    category: "User Experience & UI",
    question: "How was the Obsidian Dark theme designed for optical ergonomic comfort?",
    answer: "The theme avoids harsh pure #000000 blacks and blinding whites. It uses a deep obsidian canvas (#0B1020), slate secondary surfaces (#111827), and elevated card containers (#172033). High-contrast electric cyan (#00D4FF) highlights active elements, while purple (#8B5CF6) highlights secondary actions, providing WCAG AA compliant contrast.",
    keywords: ["Obsidian Dark", "WCAG AA", "ergonomics", "contrast ratio"]
  },
  {
    id: 24,
    category: "Team & Responsibilities",
    question: "What were the specific responsibilities of each team member and how were roles designated?",
    answer: "Madhur served as Head of Project, architecting the foundational MVC architecture, Tkinter application shell (gui/app.py), viewport navigation controller, SQLite persistence layer (database/db_manager.py), 8-domain engineering unit converter, integration tests, and comprehensive documentation. Ramji and Shiva contributed as domain specialists: Ramji (Computation Specialist) implemented the AST calculator, equation solvers, matrix linear algebra, and calculus routines; Shiva (Visualization Specialist) implemented Matplotlib embedded plotting, descriptive statistics plots, and Monte Carlo probability simulations.",
    keywords: ["Madhur", "Head of Project", "Ramji", "Shiva", "Computation Specialist", "Visualization Specialist", "Architecture"]
  },
  {
    id: 25,
    category: "Team & Responsibilities",
    question: "How did the team coordinate modular interfaces to avoid merge conflicts?",
    answer: "We established strict API contracts before coding: core engines only take primitive Python types (ints, floats, lists, strings) and return structured dictionaries with 'status', 'result', and 'steps'. This enabled Ramji to work on computation engines while Shiva developed visualization graphics and Madhur built the GUI shell and database independently.",
    keywords: ["API contracts", "interfaces", "decoupling", "team collaboration"]
  },
  {
    id: 26,
    category: "Calculus & Analysis",
    question: "Why does the indefinite integral in MathLab include '+ C', and how is it derived?",
    answer: "By the Fundamental Theorem of Calculus, the antiderivative is a family of functions differing by a constant of integration C, because d/dx(F(x) + C) = f(x) for any constant C. MathLab's calculus module automatically appends '+ C' to all indefinite integral results for mathematical rigor.",
    keywords: ["constant of integration", "Fundamental Theorem", "+ C", "antiderivative"]
  },
  {
    id: 27,
    category: "Calculus & Analysis",
    question: "How does the Calculus module compute definite integrals numerically when an analytical closed-form does not exist?",
    answer: "When SymPy cannot find an elementary antiderivative, MathLab falls back to numerical quadrature using adaptive composite Simpson's 1/3 rule or SciPy's scipy.integrate.quad, approximating the definite integral with guaranteed error bounds.",
    keywords: ["Simpson's rule", "quadrature", "definite integral", "numerical integration"]
  },
  {
    id: 28,
    category: "Matrices & Linear Algebra",
    question: "How does the Matrix engine verify whether an inverse exists and validate its correctness?",
    answer: "Before inverting matrix A, the engine calculates det(A). If |det(A)| < 1e-12, the matrix is classified as singular and the operation is rejected with an explanatory message. When invertible, it computes A⁻¹ and optionally validates by verifying that A × A⁻¹ = I within floating-point tolerance.",
    keywords: ["determinant", "singular matrix", "identity matrix", "tolerance"]
  },
  {
    id: 29,
    category: "Engineering & Utilities",
    question: "How does the Unit Converter module ensure high conversion accuracy across 8 physical categories?",
    answer: "The converter utilizes an intermediate base-unit normalization pattern. Every unit defines a direct multiplier and offset relative to a standard SI base unit (e.g., meters for length, kilograms for mass, Kelvin for temperature). To convert from unit A to B, the input is converted: value → base SI unit → target unit. This eliminates N×N cross-conversion formulas and avoids cumulative floating-point errors.",
    keywords: ["SI base unit", "normalization", "unit conversion", "precision"]
  },
  {
    id: 30,
    category: "Security & Validation",
    question: "What regex patterns are used to validate polynomial equations before SymPy parsing?",
    answer: "Input validator in utils/validators.py strips whitespace and verifies that tokens conform to ^[0-9a-zA-Z_\\+\\-\\*/\\^\\(\\)\\.=\\s]+$. It further inspects for disallowed keywords like 'import', 'exec', 'eval', 'os', and dunder attributes ('__') to guarantee input safety before passing to SymPy.",
    keywords: ["regex", "sanitization", "token validation", "SymPy safety"]
  },
  {
    id: 31,
    category: "Persistence & Database",
    question: "How does MathLab handle database connection concurrency and file locks?",
    answer: "SQLite supports concurrent reads but serializes writes. MathLab manages this using Python's context manager (with sqlite3.connect(...) as conn) with WAL (Write-Ahead Logging) enabled. Transactions commit atomically upon exit, and connections close immediately to prevent dangling file locks.",
    keywords: ["WAL", "Write-Ahead Logging", "atomic transactions", "context manager"]
  },
  {
    id: 32,
    category: "Future Scope & Evolution",
    question: "What are the primary planned architectural enhancements for MathLab 2.0?",
    answer: "MathLab 2.0 roadmap includes: 1) 3D surface and vector field plotting using Matplotlib mplot3d, 2) Ordinary Differential Equation (ODE) solvers (Euler, RK4), 3) direct CSV/Excel data import for the Statistics Studio, and 4) native LaTeX typesetting rendered dynamically using MathJax.",
    keywords: ["roadmap", "3D plotting", "ODE", "CSV import", "LaTeX rendering"]
  }
];
