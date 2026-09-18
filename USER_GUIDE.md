# MathLab — User Guide & Operator Manual

Welcome to **MathLab**, an integrated desktop mathematical computing and visualization system. This manual provides clear instructions, syntax guidelines, and hands-on examples for every module.

---

## 1. GETTING STARTED & LAUNCHING MATHLAB

### 1.1 Installation
Ensure Python 3.8+ is installed. In your terminal or command prompt:
```bash
# 1. Clone repository or extract project archive
cd mathlab

# 2. Install required scientific libraries
pip install -r requirements.txt
```

### 1.2 Running the Application
To start the desktop interface:
```bash
python3 main.py
```
*(On Windows: `python main.py`)*

To run in terminal diagnostic/CLI mode:
```bash
python3 main.py --cli
```

---

## 2. INTERFACE OVERVIEW & NAVIGATION

```
+-------------------------------------------------------------------------+
| MathLab | Computing & Visualization                     ● System Ready  |  <- Header Bar
+---------------+---------------------------------------------------------+
| NAVIGATION    |                                                         |
| ◈ Dashboard   |                                                         |
| ∑ Calculator  |                                                         |
| ƒ Equations   |                     VIEWPORT CONTAINER                  |
| 📈 Graphing   |            (Active Module Displays Here)                |
| ▦ Matrices    |                                                         |
| σ Statistics  |                                                         |
| P Probability |                                                         |
| ∫ Calculus    |                                                         |
| ⇄ Converter   |                                                         |
| ⚙ Settings    |                                                         |
+---------------+---------------------------------------------------------+
| Ready. Active module: Dashboard                       Madhur • Ramji • Shiva | <- Status Bar
+-------------------------------------------------------------------------+
```

- **Sidebar (Left):** Click any module button to switch the active view immediately.
- **Header (Top):** Displays product identity and a live **System Ready** indicator.
- **Status Bar (Bottom):** Provides real-time feedback, calculation confirmations, and error alerts.

---

## 3. MODULE-BY-MODULE USER INSTRUCTIONS

### 3.1 Dashboard Module (◈)
The Dashboard provides an overview of your session:
- **Metrics Cards:** See total calculations executed, active session duration, and database status.
- **Usage Breakdown:** View a visual breakdown of calculations per module.
- **Recent Activity Log:** Inspect your latest 10 calculations with module tags and timestamps.
- **Quick Actions:** Click any quick action button to jump directly into common tasks.

---

### 3.2 Scientific Calculator (∑)
A full-featured calculator with a memory bank and computation history audit trail.

#### How to Use:
1. Click buttons on the keypad or type directly into the expression display.
2. Press **`=`** or hit **Enter** to evaluate.
3. Use **Deg / Rad** to toggle trigonometric angle units.

#### Memory Register Operations:
- **`MC` (Memory Clear):** Resets the stored memory value to `0.0`.
- **`MR` (Memory Recall):** Recalls and inserts the stored memory value into the current expression.
- **`M+` (Memory Add):** Adds the current result to the memory register.
- **`M-` (Memory Subtract):** Subtracts the current result from the memory register.

#### Example Calculations:
- Basic: `15 * 4 - (8 / 2)^2` $\to$ **`56`**
- Trigonometry: `sin(30)` *(in Deg mode)* $\to$ **`0.5`**
- Hyperbolic: `sinh(1.5)` $\to$ **`2.129279`**
- Power & Root: `sqrt(144) + 2^5` $\to$ **`44`**

---

### 3.3 Equation Solver Studio (ƒ)
Solve equations across four specialized tabs:

#### Tab 1: Quadratic ($ax^2 + bx + c = 0$)
1. Enter coefficients `a`, `b`, and `c`.
2. Click **Solve Quadratic**.
3. View the calculated discriminant $\Delta$, the classification of roots (real distinct, real repeated, or complex conjugates), and the complete step-by-step derivation.
- *Example:* For $x^2 - 5x + 6 = 0$, enter `a = 1`, `b = -5`, `c = 6`.  
  Result: $\Delta = 1$, Roots: $x_1 = 3, x_2 = 2$.

#### Tab 2: Linear (Single Variable)
1. Enter an algebraic equation in terms of `x`.
2. Click **Solve**.
- *Example:* `2*x + 5 = 15` $\to$ **`x = 5`**
- *Example:* `3*x - 4 = 2*x + 6` $\to$ **`x = 10`**

#### Tab 3: Simultaneous (2x2 Linear System)
1. Enter Equation 1 (e.g., `2*x + y = 7`).
2. Enter Equation 2 (e.g., `x - y = 1`).
3. Click **Solve System**.
- *Result:* **`x = 2.6667, y = 1.6667`** (with Cramer's rule derivation).

#### Tab 4: General Polynomial
1. Enter a polynomial expression (e.g., `x^3 - 6*x^2 + 11*x - 6 = 0`).
2. Click **Find Roots**.
- *Result:* Polynomial degree 3, Roots: $x = 1, x = 2, x = 3$.

---

### 3.4 Graphing Laboratory (📈)
Plot multiple functions on an embedded interactive canvas with export options.

#### How to Use:
1. Define up to three functions in the input fields:
   - `f1(x) = sin(x)`
   - `f2(x) = cos(x)`
   - `f3(x) = x/2`
2. Specify the domain interval `[x_min, x_max]` (default: `-10` to `10`).
3. Click **Plot Graph**.
4. Use **Preset Functions** to quickly load standard mathematical families (polynomials, wave beats, exponential/log).
5. Click **💾 Save Graph (PNG)** to export a 300 DPI publication-quality image to your computer.

#### Mathematical Syntax:
- Exponentiation: `x^2` or `x**2`
- Multiplication: `2*x` or `3*sin(x)`
- Built-in functions: `sin(x)`, `cos(x)`, `tan(x)`, `exp(x)`, `log(x)` (natural log), `sqrt(x)`, `abs(x)`.

---

### 3.5 Matrix Laboratory (▦)
Perform matrix algebra with dimension validation.

#### Input Format:
Enter matrices row-by-row, separating elements with spaces or commas, and rows with newlines:
```
1   2   3
4   5   6
7   8   9
```

#### Supported Operations:
- **Binary Operations:**
  - **`A + B` (Addition):** Matrices must have identical dimensions ($m \times n$).
  - **`A - B` (Subtraction):** Matrices must have identical dimensions ($m \times n$).
  - **`A × B` (Multiplication):** Columns of Matrix $A$ must match rows of Matrix $B$ ($m \times k$ and $k \times n$).
  - **`k × A` (Scalar Multiplication):** Multiplies every element in $A$ by scalar $k$.
- **Unary Operations (Matrix A):**
  - **`Transpose (Aᵀ)`:** Flips matrix over its diagonal ($m \times n \to n \times m$).
  - **`Determinant det(A)`:** Computes scalar determinant (square matrices only).
  - **`Inverse (A⁻¹)`:** Computes matrix inverse (fails gracefully if $\det A = 0$).
  - **`Rank`:** Computes matrix rank via Gaussian elimination.
  - **`Trace tr(A)`:** Sum of main diagonal elements.
  - **`Eigenvalues & Eigenvectors`:** Computes spectral values $\lambda$ and corresponding modal eigenvectors.

---

### 3.6 Statistics Studio (σ)
Analyze empirical data series with metrics and distribution charts.

#### How to Use:
1. Enter your numbers separated by commas or spaces into the data entry field:  
   `10, 12, 15, 18, 20, 22, 25, 28, 30, 35`
2. Click **Analyze Data** (or click **Sample 1 / Sample 2** to load presets).
3. Review the **Descriptive Statistics Table**:
   - Count ($N$), Mean ($\mu$), Median, Mode
   - Variance ($\sigma^2$), Standard Deviation ($\sigma$), Range, Min, Max
   - Quartiles ($Q_1, Q_2, Q_3$), Interquartile Range ($IQR$)
4. Select a visualization using the radio buttons:
   - **Histogram:** Shows frequency distribution and spread.
   - **Box Plot:** Visualizes medians, quartiles, and outliers.
   - **Bar Chart:** Visualizes discrete observation values.
   - **Pie Chart:** Shows proportional distribution across values.

---

### 3.7 Probability Laboratory (P)
Explore probability through simulations and analytical calculations across three tabs:

#### Tab 1: Coin Toss Simulation
1. Enter the number of tosses $N$ (e.g., `1000` or `10000`).
2. Click **Run Simulation**.
3. View the empirical heads/tails counts, percentage frequencies, and deviation from the theoretical 50.0% expected value.
4. An interactive bar chart visually compares empirical results with theoretical expectations.

#### Tab 2: Fair Dice Roll Experiment
1. Enter total rolls $N$ (e.g., `6000`).
2. Click **Roll Dice**.
3. Inspect the frequency table and bar chart for faces 1 through 6, observing convergence toward the 16.67% theoretical baseline.

#### Tab 3: Classical Probability & Combinatorics
- **Classical Probability:** Enter favorable outcomes $n(A)$ and total sample space $n(S)$ (e.g., $n(A)=3, n(S)=6$) to compute $P(A) = 0.5$, complement $P(A') = 0.5$, and odds in favor ($1:1$).
- **Combinatorics:** Enter total items $n$ and subset size $r$ (e.g., $n=10, r=3$) to compute permutations $P(n, r) = 720$, combinations $C(n, r) = 120$, and factorials $n!$ and $r!$.

---

### 3.8 Calculus Studio (∫)
Perform symbolic and graphical calculus across three tabs:

#### Tab 1: Derivative $f'(x)$
1. Enter function $f(x)$ (e.g., `x^3 - 3*x^2 + 2*x`).
2. Select derivative order (1st, 2nd, or 3rd).
3. Click **Differentiate**.
4. View the symbolic derivative, LaTeX rendering, and a dual-curve plot comparing $f(x)$ with $f'(x)$ on the right canvas.

#### Tab 2: Integration $\int$
- **Indefinite Integral:** Enter $f(x)$ (e.g., `3*x^2 + 2*x + 1`) and click **Indefinite ∫** $\to$ **`x^3 + x^2 + x + C`**.
- **Definite Integral:** Enter bounds `a = 0` and `b = 2` and click **Definite ∫_a^b** $\to$ **`14`**.

#### Tab 3: Limits $\lim$
1. Enter function $f(x)$ (e.g., `sin(x)/x`).
2. Enter target point $x \to c$ (e.g., `0`).
3. Click **Compute Limit** $\to$ **`1`**.

---

### 3.9 Unit Conversion System (⇄)
Perform conversions across scientific and physical dimensions:
1. Select a category: **Length, Mass, Temperature, Area, Volume, Time, Speed**.
2. Enter the source numerical value.
3. Select source and target units from the dropdown menus.
4. The converted value updates instantly.
5. Click **⇄ Swap** to reverse source and target units.

---

### 3.10 Settings & Maintenance (⚙)
- **Database Status:** Displays database path, table record counts, and storage engine info.
- **Clear History:** Clears all stored calculation logs from `mathlab.db`.
- **Reset Statistics:** Resets module usage frequency counters to zero.
- **Team Credits:** Displays project details and engineering contributions.

---

## 4. FREQUENTLY ASKED QUESTIONS (FAQ) & TROUBLESHOOTING

### Q: Why do I see a warning about missing Tkinter when running on Linux?
**A:** On some minimal Linux distributions, Tkinter is not bundled with the core Python package. Install it via your distribution's package manager:
```bash
sudo apt-get install python3-tk    # Debian / Ubuntu
sudo dnf install python3-tkinter    # Fedora / Red Hat
```

### Q: Why does my graph not display?
**A:** Make sure your function syntax uses valid variable names (`x`) and valid mathematical operators (use `*` for multiplication, e.g. `2*x` instead of `2x`). Also ensure that your domain interval $[x_{\min}, x_{\max}]$ does not have $x_{\min} \ge x_{\max}$.

### Q: How can I copy calculation results to the clipboard?
**A:** You can highlight any text in the output text boxes across the modules and use standard keyboard shortcuts (**Ctrl+C** on Windows/Linux or **Cmd+C** on macOS) to copy values directly.

### Q: Can I run MathLab on a remote server without a monitor?
**A:** Yes! Running `python3 main.py --cli` launches the built-in diagnostic test runner, verifying all mathematical engines and database logging directly in your terminal.
