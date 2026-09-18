"""
MathLab Equation Solver View
Sub-modules for Linear, Quadratic, Simultaneous System, and Polynomial Equations with steps.
Developed by: Ramji (Mathematical Computation)
"""

try:
    import tkinter as tk
    from tkinter import ttk, messagebox
    TKINTER_AVAILABLE = True
except ImportError:
    TKINTER_AVAILABLE = False

from gui.theme import (
    COLOR_BG, COLOR_BG_SECONDARY, COLOR_CARD, COLOR_ACCENT,
    COLOR_SECONDARY_ACCENT, COLOR_TEXT_PRIMARY, COLOR_TEXT_SECONDARY,
    FONT_TITLE, FONT_HEADING, FONT_SUBHEADING, FONT_BODY, FONT_BODY_BOLD,
    FONT_MONO, FONT_MONO_LARGE
)
from core.equations import EquationSolver


class EquationsView(ttk.Frame if TKINTER_AVAILABLE else object):
    """Equation Solver interface supporting multiple equation categories."""

    def __init__(self, parent, app):
        if not TKINTER_AVAILABLE:
            return
        super().__init__(parent, style="TFrame")
        self.app = app
        self.engine = EquationSolver(db_manager=app.db)
        self._build_ui()

    def _build_ui(self):
        header_frame = ttk.Frame(self, style="TFrame")
        header_frame.pack(fill="x", padx=24, pady=(20, 12))

        ttk.Label(header_frame, text="Equation Solver Studio", font=FONT_TITLE).pack(anchor="w")
        ttk.Label(
            header_frame,
            text="Solve single-variable linear, quadratic with discriminant, 2x2 simultaneous systems, and polynomials.",
            font=FONT_SUBHEADING,
            foreground=COLOR_TEXT_SECONDARY,
        ).pack(anchor="w", pady=(4, 0))

        # Notebook for categorized equation types
        self.notebook = ttk.Notebook(self)
        self.notebook.pack(fill="both", expand=True, padx=24, pady=(0, 20))

        # Tabs
        self.tab_quad = ttk.Frame(self.notebook, style="TFrame")
        self.tab_linear = ttk.Frame(self.notebook, style="TFrame")
        self.tab_simul = ttk.Frame(self.notebook, style="TFrame")
        self.tab_poly = ttk.Frame(self.notebook, style="TFrame")

        self.notebook.add(self.tab_quad, text=" Quadratic (ax² + bx + c = 0) ")
        self.notebook.add(self.tab_linear, text=" Linear (Single Variable) ")
        self.notebook.add(self.tab_simul, text=" Simultaneous (2x2 System) ")
        self.notebook.add(self.tab_poly, text=" General Polynomial ")

        self._build_quadratic_tab()
        self._build_linear_tab()
        self._build_simultaneous_tab()
        self._build_polynomial_tab()

    def _build_quadratic_tab(self):
        container = ttk.Frame(self.tab_quad, style="TFrame")
        container.pack(fill="both", expand=True, padx=16, pady=16)

        # Input card
        input_card = tk.Frame(container, bg=COLOR_CARD, highlightbackground=COLOR_BG_SECONDARY, highlightthickness=1)
        input_card.pack(fill="x", pady=(0, 14))

        tk.Label(input_card, text="Standard Quadratic Form: ax² + bx + c = 0", font=FONT_SUBHEADING, fg=COLOR_ACCENT, bg=COLOR_CARD).pack(anchor="w", padx=16, pady=(12, 8))

        row_entries = tk.Frame(input_card, bg=COLOR_CARD)
        row_entries.pack(fill="x", padx=16, pady=(0, 12))

        tk.Label(row_entries, text="a =", fg=COLOR_TEXT_PRIMARY, bg=COLOR_CARD, font=FONT_BODY_BOLD).pack(side="left")
        self.q_a = tk.Entry(row_entries, width=8, font=FONT_MONO, bg=COLOR_BG, fg=COLOR_TEXT_PRIMARY, insertbackground=COLOR_TEXT_PRIMARY, bd=0)
        self.q_a.insert(0, "1")
        self.q_a.pack(side="left", padx=(4, 16), ipady=4)

        tk.Label(row_entries, text="b =", fg=COLOR_TEXT_PRIMARY, bg=COLOR_CARD, font=FONT_BODY_BOLD).pack(side="left")
        self.q_b = tk.Entry(row_entries, width=8, font=FONT_MONO, bg=COLOR_BG, fg=COLOR_TEXT_PRIMARY, insertbackground=COLOR_TEXT_PRIMARY, bd=0)
        self.q_b.insert(0, "-5")
        self.q_b.pack(side="left", padx=(4, 16), ipady=4)

        tk.Label(row_entries, text="c =", fg=COLOR_TEXT_PRIMARY, bg=COLOR_CARD, font=FONT_BODY_BOLD).pack(side="left")
        self.q_c = tk.Entry(row_entries, width=8, font=FONT_MONO, bg=COLOR_BG, fg=COLOR_TEXT_PRIMARY, insertbackground=COLOR_TEXT_PRIMARY, bd=0)
        self.q_c.insert(0, "6")
        self.q_c.pack(side="left", padx=(4, 16), ipady=4)

        solve_btn = tk.Button(row_entries, text="Solve Quadratic", font=FONT_BODY_BOLD, bg=COLOR_ACCENT, fg="#000000", bd=0, padx=14, pady=4, command=self.on_solve_quadratic)
        solve_btn.pack(side="left", padx=8)

        # Results & Step-by-Step Explanation Box
        res_card = tk.Frame(container, bg=COLOR_CARD, highlightbackground=COLOR_BG_SECONDARY, highlightthickness=1)
        res_card.pack(fill="both", expand=True)

        tk.Label(res_card, text="Analytical Solution & Mathematical Steps", font=FONT_SUBHEADING, fg=COLOR_TEXT_PRIMARY, bg=COLOR_CARD).pack(anchor="w", padx=16, pady=(12, 6))

        self.q_output = tk.Text(res_card, bg=COLOR_BG_SECONDARY, fg=COLOR_TEXT_PRIMARY, font=FONT_MONO, bd=0, padx=12, pady=12)
        self.q_output.pack(fill="both", expand=True, padx=16, pady=(0, 16))

    def on_solve_quadratic(self):
        try:
            a = float(self.q_a.get().strip())
            b = float(self.q_b.get().strip())
            c = float(self.q_c.get().strip())
        except ValueError:
            messagebox.showerror("Input Error", "Please enter valid numerical coefficients for a, b, and c.")
            return

        res = self.engine.solve_quadratic(a, b, c)
        self.q_output.delete("1.0", tk.END)
        if not res["success"]:
            self.q_output.insert(tk.END, f"Error: {res['error']}\n")
            return

        self.q_output.insert(tk.END, f"EQUATION: {res['equation']}\n")
        self.q_output.insert(tk.END, f"DISCRIMINANT (Δ): {res['discriminant']}\n")
        self.q_output.insert(tk.END, f"ROOT NATURE: {res['root_type']}\n")
        self.q_output.insert(tk.END, f"FINAL ROOTS: {res['roots_display']}\n\n")
        self.q_output.insert(tk.END, "--- STEP-BY-STEP DERIVATION ---\n")
        for idx, step in enumerate(res["steps"], 1):
            self.q_output.insert(tk.END, f"{idx}. {step}\n")

        self.app.set_status(f"Solved quadratic: {res['roots_display']}")

    def _build_linear_tab(self):
        container = ttk.Frame(self.tab_linear, style="TFrame")
        container.pack(fill="both", expand=True, padx=16, pady=16)

        input_card = tk.Frame(container, bg=COLOR_CARD)
        input_card.pack(fill="x", pady=(0, 14))

        tk.Label(input_card, text="Enter Linear Equation (e.g., 2x + 5 = 15 or 3*x - 4 = 2*x + 6):", font=FONT_SUBHEADING, fg=COLOR_ACCENT, bg=COLOR_CARD).pack(anchor="w", padx=16, pady=(12, 6))

        row = tk.Frame(input_card, bg=COLOR_CARD)
        row.pack(fill="x", padx=16, pady=(0, 12))

        self.lin_entry = tk.Entry(row, font=FONT_MONO, bg=COLOR_BG, fg=COLOR_TEXT_PRIMARY, insertbackground=COLOR_TEXT_PRIMARY, bd=0)
        self.lin_entry.insert(0, "2*x + 5 = 15")
        self.lin_entry.pack(side="left", fill="x", expand=True, padx=(0, 12), ipady=6)

        tk.Button(row, text="Solve", font=FONT_BODY_BOLD, bg=COLOR_ACCENT, fg="#000000", bd=0, padx=16, pady=6, command=self.on_solve_linear).pack(side="right")

        self.lin_output = tk.Text(container, bg=COLOR_BG_SECONDARY, fg=COLOR_TEXT_PRIMARY, font=FONT_MONO, bd=0, padx=12, pady=12)
        self.lin_output.pack(fill="both", expand=True)

    def on_solve_linear(self):
        eq_str = self.lin_entry.get().strip()
        if not eq_str:
            return
        res = self.engine.solve_linear(eq_str)
        self.lin_output.delete("1.0", tk.END)
        if not res["success"]:
            self.lin_output.insert(tk.END, f"Error: {res['error']}\n")
            return
        self.lin_output.insert(tk.END, f"SOLUTION: x = {res.get('solution', 'N/A')}\n\n")
        self.lin_output.insert(tk.END, "--- STEP-BY-STEP DERIVATION ---\n")
        for idx, s in enumerate(res.get("steps", []), 1):
            self.lin_output.insert(tk.END, f"{idx}. {s}\n")
        self.app.set_status(f"Solved: x = {res.get('solution')}")

    def _build_simultaneous_tab(self):
        container = ttk.Frame(self.tab_simul, style="TFrame")
        container.pack(fill="both", expand=True, padx=16, pady=16)

        input_card = tk.Frame(container, bg=COLOR_CARD)
        input_card.pack(fill="x", pady=(0, 14))

        tk.Label(input_card, text="Simultaneous Linear System (2 Equations in x and y):", font=FONT_SUBHEADING, fg=COLOR_ACCENT, bg=COLOR_CARD).pack(anchor="w", padx=16, pady=(12, 6))

        r1 = tk.Frame(input_card, bg=COLOR_CARD)
        r1.pack(fill="x", padx=16, pady=4)
        tk.Label(r1, text="Eq 1:", fg=COLOR_TEXT_SECONDARY, bg=COLOR_CARD).pack(side="left")
        self.sim_1 = tk.Entry(r1, font=FONT_MONO, bg=COLOR_BG, fg=COLOR_TEXT_PRIMARY, insertbackground=COLOR_TEXT_PRIMARY, bd=0)
        self.sim_1.insert(0, "2*x + y = 7")
        self.sim_1.pack(side="left", fill="x", expand=True, padx=8, ipady=4)

        r2 = tk.Frame(input_card, bg=COLOR_CARD)
        r2.pack(fill="x", padx=16, pady=(4, 12))
        tk.Label(r2, text="Eq 2:", fg=COLOR_TEXT_SECONDARY, bg=COLOR_CARD).pack(side="left")
        self.sim_2 = tk.Entry(r2, font=FONT_MONO, bg=COLOR_BG, fg=COLOR_TEXT_PRIMARY, insertbackground=COLOR_TEXT_PRIMARY, bd=0)
        self.sim_2.insert(0, "x - y = 1")
        self.sim_2.pack(side="left", fill="x", expand=True, padx=8, ipady=4)

        tk.Button(r2, text="Solve System", font=FONT_BODY_BOLD, bg=COLOR_ACCENT, fg="#000000", bd=0, padx=16, pady=4, command=self.on_solve_simultaneous).pack(side="right")

        self.sim_output = tk.Text(container, bg=COLOR_BG_SECONDARY, fg=COLOR_TEXT_PRIMARY, font=FONT_MONO, bd=0, padx=12, pady=12)
        self.sim_output.pack(fill="both", expand=True)

    def on_solve_simultaneous(self):
        eq1 = self.sim_1.get().strip()
        eq2 = self.sim_2.get().strip()
        if not eq1 or not eq2:
            return
        res = self.engine.solve_simultaneous(eq1, eq2)
        self.sim_output.delete("1.0", tk.END)
        if not res["success"]:
            self.sim_output.insert(tk.END, f"Error: {res['error']}\n")
            return
        self.sim_output.insert(tk.END, f"RESULT: {res.get('result_display', res.get('solution_text'))}\n\n")
        self.sim_output.insert(tk.END, "--- STEP-BY-STEP SOLUTION ---\n")
        for idx, s in enumerate(res.get("steps", []), 1):
            self.sim_output.insert(tk.END, f"{idx}. {s}\n")
        self.app.set_status(f"Solved simultaneous system: {res.get('result_display')}")

    def _build_polynomial_tab(self):
        container = ttk.Frame(self.tab_poly, style="TFrame")
        container.pack(fill="both", expand=True, padx=16, pady=16)

        input_card = tk.Frame(container, bg=COLOR_CARD)
        input_card.pack(fill="x", pady=(0, 14))

        tk.Label(input_card, text="Polynomial Expression (e.g., x^3 - 6*x^2 + 11*x - 6 = 0):", font=FONT_SUBHEADING, fg=COLOR_ACCENT, bg=COLOR_CARD).pack(anchor="w", padx=16, pady=(12, 6))

        row = tk.Frame(input_card, bg=COLOR_CARD)
        row.pack(fill="x", padx=16, pady=(0, 12))

        self.poly_entry = tk.Entry(row, font=FONT_MONO, bg=COLOR_BG, fg=COLOR_TEXT_PRIMARY, insertbackground=COLOR_TEXT_PRIMARY, bd=0)
        self.poly_entry.insert(0, "x^3 - 6*x^2 + 11*x - 6 = 0")
        self.poly_entry.pack(side="left", fill="x", expand=True, padx=(0, 12), ipady=6)

        tk.Button(row, text="Find Roots", font=FONT_BODY_BOLD, bg=COLOR_ACCENT, fg="#000000", bd=0, padx=16, pady=6, command=self.on_solve_polynomial).pack(side="right")

        self.poly_output = tk.Text(container, bg=COLOR_BG_SECONDARY, fg=COLOR_TEXT_PRIMARY, font=FONT_MONO, bd=0, padx=12, pady=12)
        self.poly_output.pack(fill="both", expand=True)

    def on_solve_polynomial(self):
        expr = self.poly_entry.get().strip()
        if not expr:
            return
        res = self.engine.solve_polynomial(expr)
        self.poly_output.delete("1.0", tk.END)
        if not res["success"]:
            self.poly_output.insert(tk.END, f"Error: {res['error']}\n")
            return
        self.poly_output.insert(tk.END, f"POLYNOMIAL DEGREE: {res['degree']}\n")
        self.poly_output.insert(tk.END, f"ROOTS (Total: {len(res['roots'])}):\n\n")
        for idx, r in enumerate(res["formatted_roots"], 1):
            self.poly_output.insert(tk.END, f"Root {idx}: {r}\n")
        self.app.set_status(f"Solved polynomial: {res['display']}")
