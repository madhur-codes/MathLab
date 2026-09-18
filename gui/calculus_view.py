"""
MathLab Calculus Studio View
Symbolic differentiation, indefinite/definite integrals, limits, and function vs derivative plotting.
Developed by: Shiva (Mathematical Computation)
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
    FONT_TITLE, FONT_SUBHEADING, FONT_BODY, FONT_BODY_BOLD, FONT_MONO
)
from core.calculus import CalculusEngine
from visualization.plots import PlotEngine

try:
    from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
    CANVAS_TK_AVAILABLE = True
except ImportError:
    CANVAS_TK_AVAILABLE = False


class CalculusView(ttk.Frame if TKINTER_AVAILABLE else object):
    """Calculus module interface."""

    def __init__(self, parent, app):
        if not TKINTER_AVAILABLE:
            return
        super().__init__(parent, style="TFrame")
        self.app = app
        self.engine = CalculusEngine(db_manager=app.db)
        self.plot_engine = PlotEngine()
        self._build_ui()

    def _build_ui(self):
        header_frame = ttk.Frame(self, style="TFrame")
        header_frame.pack(fill="x", padx=24, pady=(20, 10))

        ttk.Label(header_frame, text="Calculus Studio", font=FONT_TITLE).pack(anchor="w")
        ttk.Label(
            header_frame,
            text="Symbolic differentiation, analytical integration, limit evaluation, and differential geometry visualization.",
            font=FONT_SUBHEADING,
            foreground=COLOR_TEXT_SECONDARY,
        ).pack(anchor="w", pady=(4, 0))

        content = ttk.Frame(self, style="TFrame")
        content.pack(fill="both", expand=True, padx=24, pady=(0, 20))

        # Left Column: Tools notebook
        left_col = tk.Frame(content, bg=COLOR_BG, width=380)
        left_col.pack(side="left", fill="both", padx=(0, 14))
        left_col.pack_propagate(False)

        self.notebook = ttk.Notebook(left_col)
        self.notebook.pack(fill="both", expand=True)

        self.tab_diff = ttk.Frame(self.notebook, style="TFrame")
        self.tab_int = ttk.Frame(self.notebook, style="TFrame")
        self.tab_lim = ttk.Frame(self.notebook, style="TFrame")

        self.notebook.add(self.tab_diff, text=" Derivative f'(x) ")
        self.notebook.add(self.tab_int, text=" Integration ∫ ")
        self.notebook.add(self.tab_lim, text=" Limits lim ")

        self._build_diff_tab()
        self._build_int_tab()
        self._build_lim_tab()

        # Right Column: Visualizer Canvas
        right_col = tk.Frame(content, bg=COLOR_CARD, highlightbackground=COLOR_BG_SECONDARY, highlightthickness=1)
        right_col.pack(side="right", fill="both", expand=True)

        tk.Label(right_col, text="Function & Derivative Curve Visualizer", font=FONT_SUBHEADING, fg=COLOR_ACCENT, bg=COLOR_CARD).pack(anchor="w", padx=14, pady=(12, 6))

        self.canvas_container = tk.Frame(right_col, bg=COLOR_CARD)
        self.canvas_container.pack(fill="both", expand=True, padx=14, pady=(0, 14))

        # Initial calculation
        self.on_differentiate()

    def _build_diff_tab(self):
        container = ttk.Frame(self.tab_diff, style="TFrame")
        container.pack(fill="both", expand=True, padx=12, pady=12)

        card = tk.Frame(container, bg=COLOR_CARD, highlightbackground=COLOR_BG_SECONDARY, highlightthickness=1)
        card.pack(fill="x", pady=(0, 10))

        tk.Label(card, text="Function f(x):", font=FONT_SUBHEADING, fg=COLOR_ACCENT, bg=COLOR_CARD).pack(anchor="w", padx=12, pady=(10, 4))
        self.diff_expr = tk.Entry(card, font=FONT_MONO, bg=COLOR_BG, fg=COLOR_TEXT_PRIMARY, insertbackground=COLOR_TEXT_PRIMARY, bd=0)
        self.diff_expr.insert(0, "x^3 - 3*x^2 + 2*x")
        self.diff_expr.pack(fill="x", padx=12, pady=(0, 8), ipady=4)

        opt_row = tk.Frame(card, bg=COLOR_CARD)
        opt_row.pack(fill="x", padx=12, pady=(0, 10))

        tk.Label(opt_row, text="Order:", fg=COLOR_TEXT_SECONDARY, bg=COLOR_CARD).pack(side="left")
        self.diff_order = ttk.Combobox(opt_row, values=["1 (First f')", "2 (Second f'')", "3 (Third f''')"], width=14, state="readonly")
        self.diff_order.current(0)
        self.diff_order.pack(side="left", padx=6)

        tk.Button(opt_row, text="Differentiate", font=FONT_BODY_BOLD, bg=COLOR_ACCENT, fg="#000000", bd=0, padx=12, pady=3, command=self.on_differentiate).pack(side="right")

        # Result box
        self.diff_res_text = tk.Text(container, bg=COLOR_CARD, fg=COLOR_TEXT_PRIMARY, font=FONT_MONO, bd=0, padx=12, pady=12)
        self.diff_res_text.pack(fill="both", expand=True)

    def on_differentiate(self):
        expr = self.diff_expr.get().strip()
        if not expr:
            return

        order = int(self.diff_order.get()[0])
        res = self.engine.differentiate(expr, variable="x", order=order)

        self.diff_res_text.delete("1.0", tk.END)
        if not res["success"]:
            self.diff_res_text.insert(tk.END, f"Error: {res['error']}")
            return

        self.diff_res_text.insert(tk.END, f"FUNCTION: f(x) = {expr}\n\n")
        self.diff_res_text.insert(tk.END, f"DERIVATIVE:\n{res['display']}\n\n")
        self.diff_res_text.insert(tk.END, f"LaTeX:\n{res['latex']}\n")

        # Render curves on right canvas
        self._render_curve_comparison(expr, res["derivative"])
        self.app.set_status(f"Differentiated: {res['display']}")

    def _build_int_tab(self):
        container = ttk.Frame(self.tab_int, style="TFrame")
        container.pack(fill="both", expand=True, padx=12, pady=12)

        card = tk.Frame(container, bg=COLOR_CARD, highlightbackground=COLOR_BG_SECONDARY, highlightthickness=1)
        card.pack(fill="x", pady=(0, 10))

        tk.Label(card, text="Integrand Function f(x):", font=FONT_SUBHEADING, fg=COLOR_ACCENT, bg=COLOR_CARD).pack(anchor="w", padx=12, pady=(10, 4))
        self.int_expr = tk.Entry(card, font=FONT_MONO, bg=COLOR_BG, fg=COLOR_TEXT_PRIMARY, insertbackground=COLOR_TEXT_PRIMARY, bd=0)
        self.int_expr.insert(0, "3*x^2 + 2*x + 1")
        self.int_expr.pack(fill="x", padx=12, pady=(0, 8), ipady=4)

        # Definite limits row
        lim_row = tk.Frame(card, bg=COLOR_CARD)
        lim_row.pack(fill="x", padx=12, pady=(0, 10))

        tk.Label(lim_row, text="Limits [a, b] (Optional):", fg=COLOR_TEXT_SECONDARY, bg=COLOR_CARD).pack(side="left")
        self.int_a = tk.Entry(lim_row, width=5, font=FONT_MONO, bg=COLOR_BG, fg=COLOR_TEXT_PRIMARY, bd=0)
        self.int_a.insert(0, "0")
        self.int_a.pack(side="left", padx=4)
        tk.Label(lim_row, text="to", fg=COLOR_TEXT_SECONDARY, bg=COLOR_CARD).pack(side="left")
        self.int_b = tk.Entry(lim_row, width=5, font=FONT_MONO, bg=COLOR_BG, fg=COLOR_TEXT_PRIMARY, bd=0)
        self.int_b.insert(0, "2")
        self.int_b.pack(side="left", padx=4)

        btn_row = tk.Frame(card, bg=COLOR_CARD)
        btn_row.pack(fill="x", padx=12, pady=(0, 10))
        tk.Button(btn_row, text="Indefinite ∫", font=FONT_BODY_BOLD, bg=COLOR_ACCENT, fg="#000000", bd=0, padx=8, pady=3, command=self.on_integrate_indefinite).pack(side="left", fill="x", expand=True, padx=(0, 4))
        tk.Button(btn_row, text="Definite ∫_a^b", font=FONT_BODY_BOLD, bg=COLOR_SECONDARY_ACCENT, fg="#FFFFFF", bd=0, padx=8, pady=3, command=self.on_integrate_definite).pack(side="right", fill="x", expand=True, padx=(4, 0))

        self.int_res_text = tk.Text(container, bg=COLOR_CARD, fg=COLOR_TEXT_PRIMARY, font=FONT_MONO, bd=0, padx=12, pady=12)
        self.int_res_text.pack(fill="both", expand=True)

    def on_integrate_indefinite(self):
        expr = self.int_expr.get().strip()
        if not expr:
            return
        res = self.engine.integrate_indefinite(expr)
        self.int_res_text.delete("1.0", tk.END)
        if not res["success"]:
            self.int_res_text.insert(tk.END, f"Error: {res['error']}")
            return
        self.int_res_text.insert(tk.END, f"INDEFINITE INTEGRAL:\n{res['display']}\n\nLaTeX: {res['latex']}")
        self.app.set_status(f"Integrated: {res['display']}")

    def on_integrate_definite(self):
        expr = self.int_expr.get().strip()
        a = self.int_a.get().strip()
        b = self.int_b.get().strip()
        if not expr or not a or not b:
            return
        res = self.engine.integrate_definite(expr, a, b)
        self.int_res_text.delete("1.0", tk.END)
        if not res["success"]:
            self.int_res_text.insert(tk.END, f"Error: {res['error']}")
            return
        self.int_res_text.insert(tk.END, f"DEFINITE INTEGRAL over [{a}, {b}]:\n\n{res['display']}\n\nExact Symbolic: {res['exact']}")
        self.app.set_status(f"Evaluated definite integral: {res['display']}")

    def _build_lim_tab(self):
        container = ttk.Frame(self.tab_lim, style="TFrame")
        container.pack(fill="both", expand=True, padx=12, pady=12)

        card = tk.Frame(container, bg=COLOR_CARD, highlightbackground=COLOR_BG_SECONDARY, highlightthickness=1)
        card.pack(fill="x", pady=(0, 10))

        tk.Label(card, text="Function f(x):", font=FONT_SUBHEADING, fg=COLOR_ACCENT, bg=COLOR_CARD).pack(anchor="w", padx=12, pady=(10, 4))
        self.lim_expr = tk.Entry(card, font=FONT_MONO, bg=COLOR_BG, fg=COLOR_TEXT_PRIMARY, insertbackground=COLOR_TEXT_PRIMARY, bd=0)
        self.lim_expr.insert(0, "sin(x)/x")
        self.lim_expr.pack(fill="x", padx=12, pady=(0, 8), ipady=4)

        r = tk.Frame(card, bg=COLOR_CARD)
        r.pack(fill="x", padx=12, pady=(0, 10))
        tk.Label(r, text="x →", fg=COLOR_TEXT_SECONDARY, bg=COLOR_CARD).pack(side="left")
        self.lim_target = tk.Entry(r, width=6, font=FONT_MONO, bg=COLOR_BG, fg=COLOR_TEXT_PRIMARY, bd=0)
        self.lim_target.insert(0, "0")
        self.lim_target.pack(side="left", padx=4)

        tk.Button(r, text="Compute Limit", font=FONT_BODY_BOLD, bg=COLOR_ACCENT, fg="#000000", bd=0, padx=12, pady=3, command=self.on_compute_limit).pack(side="right")

        self.lim_res_text = tk.Text(container, bg=COLOR_CARD, fg=COLOR_TEXT_PRIMARY, font=FONT_MONO, bd=0, padx=12, pady=12)
        self.lim_res_text.pack(fill="both", expand=True)

    def on_compute_limit(self):
        expr = self.lim_expr.get().strip()
        target = self.lim_target.get().strip()
        if not expr or not target:
            return
        res = self.engine.compute_limit(expr, target)
        self.lim_res_text.delete("1.0", tk.END)
        if not res["success"]:
            self.lim_res_text.insert(tk.END, f"Error: {res['error']}")
            return
        self.lim_res_text.insert(tk.END, f"LIMIT EVALUATION:\n{res['display']}\n\nDirection: {res['direction']}")
        self.app.set_status(f"Evaluated: {res['display']}")

    def _render_curve_comparison(self, f_expr: str, f_prime_expr: str):
        for w in self.canvas_container.winfo_children():
            w.destroy()

        success, fig, err = self.plot_engine.plot_calculus_derivative(f_expr, f_prime_expr, x_min=-5, x_max=5)
        if success and CANVAS_TK_AVAILABLE:
            canvas = FigureCanvasTkAgg(fig, master=self.canvas_container)
            canvas.draw()
            canvas.get_tk_widget().pack(fill="both", expand=True)
