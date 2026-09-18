"""
MathLab Probability Laboratory View
Interactive simulations: Monte Carlo Coin Toss, Fair Dice Roll, Classical Probability, and Combinatorics.
Developed by: Ramji (Visualization & Probability)
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
from core.probability import ProbabilityEngine
from visualization.plots import PlotEngine

try:
    from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
    CANVAS_TK_AVAILABLE = True
except ImportError:
    CANVAS_TK_AVAILABLE = False


class ProbabilityView(ttk.Frame if TKINTER_AVAILABLE else object):
    """Educational probability simulator and classical calculator."""

    def __init__(self, parent, app):
        if not TKINTER_AVAILABLE:
            return
        super().__init__(parent, style="TFrame")
        self.app = app
        self.engine = ProbabilityEngine(db_manager=app.db)
        self.plot_engine = PlotEngine()
        self._build_ui()

    def _build_ui(self):
        header_frame = ttk.Frame(self, style="TFrame")
        header_frame.pack(fill="x", padx=24, pady=(20, 10))

        ttk.Label(header_frame, text="Probability Laboratory", font=FONT_TITLE).pack(anchor="w")
        ttk.Label(
            header_frame,
            text="Monte Carlo empirical simulations and classical theoretical probability experiments.",
            font=FONT_SUBHEADING,
            foreground=COLOR_TEXT_SECONDARY,
        ).pack(anchor="w", pady=(4, 0))

        self.notebook = ttk.Notebook(self)
        self.notebook.pack(fill="both", expand=True, padx=24, pady=(0, 20))

        self.tab_coin = ttk.Frame(self.notebook, style="TFrame")
        self.tab_dice = ttk.Frame(self.notebook, style="TFrame")
        self.tab_classical = ttk.Frame(self.notebook, style="TFrame")

        self.notebook.add(self.tab_coin, text=" Coin Toss Simulation ")
        self.notebook.add(self.tab_dice, text=" Dice Roll Experiment ")
        self.notebook.add(self.tab_classical, text=" Classical Probability & Combinatorics ")

        self._build_coin_tab()
        self._build_dice_tab()
        self._build_classical_tab()

    def _build_coin_tab(self):
        content = ttk.Frame(self.tab_coin, style="TFrame")
        content.pack(fill="both", expand=True, padx=16, pady=16)

        left_ctrl = tk.Frame(content, bg=COLOR_CARD, width=280)
        left_ctrl.pack(side="left", fill="y", padx=(0, 12))
        left_ctrl.pack_propagate(False)

        tk.Label(left_ctrl, text="Coin Toss Parameters", font=FONT_SUBHEADING, fg=COLOR_ACCENT, bg=COLOR_CARD).pack(anchor="w", padx=12, pady=(12, 6))
        tk.Label(left_ctrl, text="Number of Tosses (N):", fg=COLOR_TEXT_SECONDARY, bg=COLOR_CARD).pack(anchor="w", padx=12)

        self.coin_n_entry = tk.Entry(left_ctrl, font=FONT_MONO, bg=COLOR_BG, fg=COLOR_TEXT_PRIMARY, bd=0)
        self.coin_n_entry.insert(0, "1000")
        self.coin_n_entry.pack(fill="x", padx=12, pady=4, ipady=4)

        presets = [100, 1000, 10000, 50000]
        p_frame = tk.Frame(left_ctrl, bg=COLOR_CARD)
        p_frame.pack(fill="x", padx=12, pady=4)
        for p in presets:
            tk.Button(p_frame, text=f"{p:,}", font=FONT_BODY, bg=COLOR_BG_SECONDARY, fg=COLOR_TEXT_PRIMARY, bd=0, padx=6, pady=2, command=lambda val=p: self.set_coin_n(val)).pack(side="left", padx=2)

        tk.Button(left_ctrl, text="Run Simulation", font=FONT_BODY_BOLD, bg=COLOR_ACCENT, fg="#000000", bd=0, pady=6, command=self.on_run_coin).pack(fill="x", padx=12, pady=12)

        self.coin_stats_lbl = tk.Label(left_ctrl, text="", font=FONT_MONO, fg=COLOR_TEXT_PRIMARY, bg=COLOR_BG_SECONDARY, justify="left", padx=8, pady=8)
        self.coin_stats_lbl.pack(fill="x", padx=12, pady=(0, 12))

        # Chart container
        self.coin_chart_container = tk.Frame(content, bg=COLOR_CARD)
        self.coin_chart_container.pack(side="right", fill="both", expand=True)

        self.on_run_coin()

    def set_coin_n(self, n: int):
        self.coin_n_entry.delete(0, tk.END)
        self.coin_n_entry.insert(0, str(n))
        self.on_run_coin()

    def on_run_coin(self):
        try:
            n = int(self.coin_n_entry.get().strip())
        except ValueError:
            messagebox.showerror("Error", "Toss count must be a positive integer.")
            return

        res = self.engine.simulate_coin_toss(n)
        if not res["success"]:
            messagebox.showerror("Simulation Error", res["error"])
            return

        self.coin_stats_lbl.configure(text=(
            f"Tosses: {res['tosses']:,}\n\n"
            f"Heads: {res['heads_count']:,} ({res['heads_prob_exp']*100:.2f}%)\n"
            f"Tails: {res['tails_count']:,} ({res['tails_prob_exp']*100:.2f}%)\n\n"
            f"Theoretical: 50.00%\n"
            f"Deviation: ±{res['heads_diff']*100:.3f}%"
        ))

        for w in self.coin_chart_container.winfo_children():
            w.destroy()

        success, fig, _ = self.plot_engine.plot_probability_simulation("coin", res)
        if success and CANVAS_TK_AVAILABLE:
            canvas = FigureCanvasTkAgg(fig, master=self.coin_chart_container)
            canvas.draw()
            canvas.get_tk_widget().pack(fill="both", expand=True)

        self.app.set_status(f"Simulated {n:,} coin tosses.")

    def _build_dice_tab(self):
        content = ttk.Frame(self.tab_dice, style="TFrame")
        content.pack(fill="both", expand=True, padx=16, pady=16)

        left_ctrl = tk.Frame(content, bg=COLOR_CARD, width=280)
        left_ctrl.pack(side="left", fill="y", padx=(0, 12))
        left_ctrl.pack_propagate(False)

        tk.Label(left_ctrl, text="Dice Roll Parameters", font=FONT_SUBHEADING, fg=COLOR_ACCENT, bg=COLOR_CARD).pack(anchor="w", padx=12, pady=(12, 6))
        tk.Label(left_ctrl, text="Number of Rolls (N):", fg=COLOR_TEXT_SECONDARY, bg=COLOR_CARD).pack(anchor="w", padx=12)

        self.dice_n_entry = tk.Entry(left_ctrl, font=FONT_MONO, bg=COLOR_BG, fg=COLOR_TEXT_PRIMARY, bd=0)
        self.dice_n_entry.insert(0, "6000")
        self.dice_n_entry.pack(fill="x", padx=12, pady=4, ipady=4)

        presets = [600, 3000, 6000, 30000]
        p_frame = tk.Frame(left_ctrl, bg=COLOR_CARD)
        p_frame.pack(fill="x", padx=12, pady=4)
        for p in presets:
            tk.Button(p_frame, text=f"{p:,}", font=FONT_BODY, bg=COLOR_BG_SECONDARY, fg=COLOR_TEXT_PRIMARY, bd=0, padx=6, pady=2, command=lambda val=p: self.set_dice_n(val)).pack(side="left", padx=2)

        tk.Button(left_ctrl, text="Roll Dice", font=FONT_BODY_BOLD, bg=COLOR_ACCENT, fg="#000000", bd=0, pady=6, command=self.on_run_dice).pack(fill="x", padx=12, pady=12)

        self.dice_stats_lbl = tk.Label(left_ctrl, text="", font=FONT_MONO, fg=COLOR_TEXT_PRIMARY, bg=COLOR_BG_SECONDARY, justify="left", padx=8, pady=8)
        self.dice_stats_lbl.pack(fill="x", padx=12, pady=(0, 12))

        self.dice_chart_container = tk.Frame(content, bg=COLOR_CARD)
        self.dice_chart_container.pack(side="right", fill="both", expand=True)

        self.on_run_dice()

    def set_dice_n(self, n: int):
        self.dice_n_entry.delete(0, tk.END)
        self.dice_n_entry.insert(0, str(n))
        self.on_run_dice()

    def on_run_dice(self):
        try:
            n = int(self.dice_n_entry.get().strip())
        except ValueError:
            messagebox.showerror("Error", "Roll count must be a positive integer.")
            return

        res = self.engine.simulate_dice_roll(n)
        if not res["success"]:
            messagebox.showerror("Simulation Error", res["error"])
            return

        stats_lines = [f"Total Rolls: {n:,}\nTheoretical: 16.67% each\n"]
        for face, data in res["frequencies"].items():
            stats_lines.append(f"Face {face}: {data['count']:,} ({data['percentage']:.2f}%)")
        self.dice_stats_lbl.configure(text="\n".join(stats_lines))

        for w in self.dice_chart_container.winfo_children():
            w.destroy()

        success, fig, _ = self.plot_engine.plot_probability_simulation("dice", res)
        if success and CANVAS_TK_AVAILABLE:
            canvas = FigureCanvasTkAgg(fig, master=self.dice_chart_container)
            canvas.draw()
            canvas.get_tk_widget().pack(fill="both", expand=True)

        self.app.set_status(f"Simulated {n:,} dice rolls.")

    def _build_classical_tab(self):
        content = ttk.Frame(self.tab_classical, style="TFrame")
        content.pack(fill="both", expand=True, padx=16, pady=16)

        # Classical Card
        c_card = tk.Frame(content, bg=COLOR_CARD, highlightbackground=COLOR_BG_SECONDARY, highlightthickness=1)
        c_card.pack(fill="x", pady=(0, 14))

        tk.Label(c_card, text="Classical Probability Calculator: P(A) = n(A) / n(S)", font=FONT_SUBHEADING, fg=COLOR_ACCENT, bg=COLOR_CARD).pack(anchor="w", padx=16, pady=(12, 8))

        row1 = tk.Frame(c_card, bg=COLOR_CARD)
        row1.pack(fill="x", padx=16, pady=(0, 12))

        tk.Label(row1, text="Favorable Outcomes n(A):", fg=COLOR_TEXT_PRIMARY, bg=COLOR_CARD).pack(side="left")
        self.fav_entry = tk.Entry(row1, width=10, font=FONT_MONO, bg=COLOR_BG, fg=COLOR_TEXT_PRIMARY, bd=0)
        self.fav_entry.insert(0, "3")
        self.fav_entry.pack(side="left", padx=(6, 16), ipady=3)

        tk.Label(row1, text="Total Sample Space n(S):", fg=COLOR_TEXT_PRIMARY, bg=COLOR_CARD).pack(side="left")
        self.tot_entry = tk.Entry(row1, width=10, font=FONT_MONO, bg=COLOR_BG, fg=COLOR_TEXT_PRIMARY, bd=0)
        self.tot_entry.insert(0, "6")
        self.tot_entry.pack(side="left", padx=(6, 16), ipady=3)

        tk.Button(row1, text="Compute P(A)", font=FONT_BODY_BOLD, bg=COLOR_ACCENT, fg="#000000", bd=0, padx=14, pady=4, command=self.on_calc_classical).pack(side="left")

        self.classical_res_lbl = tk.Label(c_card, text="", font=FONT_MONO, fg=COLOR_TEXT_PRIMARY, bg=COLOR_BG_SECONDARY, justify="left", padx=12, pady=10)
        self.classical_res_lbl.pack(fill="x", padx=16, pady=(0, 16))

        # Combinatorics Card
        comb_card = tk.Frame(content, bg=COLOR_CARD, highlightbackground=COLOR_BG_SECONDARY, highlightthickness=1)
        comb_card.pack(fill="x", pady=(0, 14))

        tk.Label(comb_card, text="Combinatorics (Permutations & Combinations)", font=FONT_SUBHEADING, fg=COLOR_SECONDARY_ACCENT, bg=COLOR_CARD).pack(anchor="w", padx=16, pady=(12, 8))

        row2 = tk.Frame(comb_card, bg=COLOR_CARD)
        row2.pack(fill="x", padx=16, pady=(0, 12))

        tk.Label(row2, text="Total Items (n):", fg=COLOR_TEXT_PRIMARY, bg=COLOR_CARD).pack(side="left")
        self.comb_n_entry = tk.Entry(row2, width=8, font=FONT_MONO, bg=COLOR_BG, fg=COLOR_TEXT_PRIMARY, bd=0)
        self.comb_n_entry.insert(0, "10")
        self.comb_n_entry.pack(side="left", padx=(6, 16), ipady=3)

        tk.Label(row2, text="Subset Size (r):", fg=COLOR_TEXT_PRIMARY, bg=COLOR_CARD).pack(side="left")
        self.comb_r_entry = tk.Entry(row2, width=8, font=FONT_MONO, bg=COLOR_BG, fg=COLOR_TEXT_PRIMARY, bd=0)
        self.comb_r_entry.insert(0, "3")
        self.comb_r_entry.pack(side="left", padx=(6, 16), ipady=3)

        tk.Button(row2, text="Calculate nPr & nCr", font=FONT_BODY_BOLD, bg=COLOR_SECONDARY_ACCENT, fg="#FFFFFF", bd=0, padx=14, pady=4, command=self.on_calc_comb).pack(side="left")

        self.comb_res_lbl = tk.Label(comb_card, text="", font=FONT_MONO, fg=COLOR_TEXT_PRIMARY, bg=COLOR_BG_SECONDARY, justify="left", padx=12, pady=10)
        self.comb_res_lbl.pack(fill="x", padx=16, pady=(0, 16))

        self.on_calc_classical()
        self.on_calc_comb()

    def on_calc_classical(self):
        try:
            fav = int(self.fav_entry.get().strip())
            tot = int(self.tot_entry.get().strip())
        except ValueError:
            messagebox.showerror("Error", "Favorable and total outcomes must be integers.")
            return

        res = self.engine.calculate_classical_probability(fav, tot)
        if not res["success"]:
            messagebox.showerror("Calculation Error", res["error"])
            return

        self.classical_res_lbl.configure(text=(
            f"Probability P(A) = {res['display']}\n"
            f"Complement P(A') = 1 - P(A) = {res['complement']:.4f} ({res['complement']*100:.2f}%)\n"
            f"Odds in Favor: {res['odds_in_favor']}"
        ))

    def on_calc_comb(self):
        try:
            n = int(self.comb_n_entry.get().strip())
            r = int(self.comb_r_entry.get().strip())
        except ValueError:
            messagebox.showerror("Error", "n and r must be integers.")
            return

        res = self.engine.combinatorics(n, r)
        if not res["success"]:
            messagebox.showerror("Combinatorics Error", res["error"])
            return

        self.comb_res_lbl.configure(text=(
            f"Permutations P({n}, {r}) = {res['permutations']:,}\n"
            f"Combinations C({n}, {r}) = {res['combinations']:,}\n"
            f"Factorials: {n}! = {res['factorial_n']:,},  {r}! = {res['factorial_r']:,}"
        ))
