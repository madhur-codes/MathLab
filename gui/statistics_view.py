"""
MathLab Statistics Laboratory View
Descriptive statistics calculator with embedded distribution charts (histogram, box plot, bar, pie).
Developed by: Shiva (Visualization & Statistics)
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
from core.statistics import StatisticsEngine
from visualization.plots import PlotEngine
from utils.validators import validate_number_list

try:
    from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
    CANVAS_TK_AVAILABLE = True
except ImportError:
    CANVAS_TK_AVAILABLE = False


class StatisticsView(ttk.Frame if TKINTER_AVAILABLE else object):
    """Descriptive statistics analytical workbench."""

    def __init__(self, parent, app):
        if not TKINTER_AVAILABLE:
            return
        super().__init__(parent, style="TFrame")
        self.app = app
        self.engine = StatisticsEngine(db_manager=app.db)
        self.plot_engine = PlotEngine()
        self.current_data = []
        self._build_ui()

    def _build_ui(self):
        header_frame = ttk.Frame(self, style="TFrame")
        header_frame.pack(fill="x", padx=24, pady=(20, 10))

        ttk.Label(header_frame, text="Statistics Laboratory", font=FONT_TITLE).pack(anchor="w")
        ttk.Label(
            header_frame,
            text="Analyze central tendency, dispersion, quartiles, and view statistical distribution charts.",
            font=FONT_SUBHEADING,
            foreground=COLOR_TEXT_SECONDARY,
        ).pack(anchor="w", pady=(4, 0))

        content = ttk.Frame(self, style="TFrame")
        content.pack(fill="both", expand=True, padx=24, pady=(0, 20))

        # Left Column: Input and Tabular Metrics (width 360)
        left_col = tk.Frame(content, bg=COLOR_BG, width=380)
        left_col.pack(side="left", fill="both", padx=(0, 14))
        left_col.pack_propagate(False)

        # Input Card
        input_card = tk.Frame(left_col, bg=COLOR_CARD, highlightbackground=COLOR_BG_SECONDARY, highlightthickness=1)
        input_card.pack(fill="x", pady=(0, 10))

        tk.Label(input_card, text="Data Series Input (comma or space separated):", font=FONT_SUBHEADING, fg=COLOR_ACCENT, bg=COLOR_CARD).pack(anchor="w", padx=12, pady=(10, 4))

        self.data_entry = tk.Entry(input_card, font=FONT_MONO, bg=COLOR_BG, fg=COLOR_TEXT_PRIMARY, insertbackground=COLOR_TEXT_PRIMARY, bd=0)
        self.data_entry.insert(0, "10, 12, 15, 18, 20, 22, 25, 28, 30, 35")
        self.data_entry.pack(fill="x", padx=12, pady=(0, 8), ipady=4)

        btn_bar = tk.Frame(input_card, bg=COLOR_CARD)
        btn_bar.pack(fill="x", padx=12, pady=(0, 10))

        tk.Button(btn_bar, text="Analyze Data", font=FONT_BODY_BOLD, bg=COLOR_ACCENT, fg="#000000", bd=0, padx=12, pady=4, command=self.on_analyze).pack(side="left")
        tk.Button(btn_bar, text="Sample 1", font=FONT_BODY, bg=COLOR_BG_SECONDARY, fg=COLOR_TEXT_PRIMARY, bd=0, padx=8, pady=4, command=lambda: self.load_sample("12, 15, 12, 18, 25, 30, 30, 30, 45, 50")).pack(side="left", padx=4)
        tk.Button(btn_bar, text="Sample 2", font=FONT_BODY, bg=COLOR_BG_SECONDARY, fg=COLOR_TEXT_PRIMARY, bd=0, padx=8, pady=4, command=lambda: self.load_sample("55, 62, 70, 72, 75, 80, 85, 90, 92, 98")).pack(side="left")

        # Table of Summary Metrics
        metrics_card = tk.Frame(left_col, bg=COLOR_CARD, highlightbackground=COLOR_BG_SECONDARY, highlightthickness=1)
        metrics_card.pack(fill="both", expand=True)

        tk.Label(metrics_card, text="Descriptive Statistics Summary", font=FONT_SUBHEADING, fg=COLOR_TEXT_PRIMARY, bg=COLOR_CARD).pack(anchor="w", padx=12, pady=(10, 6))

        columns = ("metric", "value")
        self.tree = ttk.Treeview(metrics_card, columns=columns, show="headings", height=12)
        self.tree.heading("metric", text="Metric")
        self.tree.heading("value", text="Value")
        self.tree.column("metric", width=180, anchor="w")
        self.tree.column("value", width=160, anchor="w")

        scrollbar = ttk.Scrollbar(metrics_card, orient="vertical", command=self.tree.yview)
        self.tree.configure(yscrollcommand=scrollbar.set)
        self.tree.pack(side="left", fill="both", expand=True, padx=(8, 0), pady=(0, 8))
        scrollbar.pack(side="right", fill="y", pady=(0, 8))

        # Right Column: Chart Selector & Embedded Canvas
        right_col = tk.Frame(content, bg=COLOR_CARD, highlightbackground=COLOR_BG_SECONDARY, highlightthickness=1)
        right_col.pack(side="right", fill="both", expand=True)

        # Chart controls toolbar
        chart_bar = tk.Frame(right_col, bg=COLOR_CARD)
        chart_bar.pack(fill="x", padx=14, pady=(12, 8))

        tk.Label(chart_bar, text="Distribution Visualization:", font=FONT_SUBHEADING, fg=COLOR_ACCENT, bg=COLOR_CARD).pack(side="left")

        self.chart_type = tk.StringVar(value="histogram")
        types = [("Histogram", "histogram"), ("Box Plot", "box"), ("Bar Chart", "bar"), ("Pie Chart", "pie")]
        for lbl, val in types:
            btn = tk.Radiobutton(
                chart_bar,
                text=lbl,
                variable=self.chart_type,
                value=val,
                bg=COLOR_CARD,
                fg=COLOR_TEXT_PRIMARY,
                selectcolor=COLOR_BG_SECONDARY,
                activebackground=COLOR_CARD,
                activeforeground=COLOR_ACCENT,
                command=self.render_chart,
            )
            btn.pack(side="left", padx=8)

        self.chart_container = tk.Frame(right_col, bg=COLOR_CARD)
        self.chart_container.pack(fill="both", expand=True, padx=14, pady=(0, 14))

        # Initial Analysis
        self.on_analyze()

    def load_sample(self, text: str):
        self.data_entry.delete(0, tk.END)
        self.data_entry.insert(0, text)
        self.on_analyze()

    def on_analyze(self):
        text = self.data_entry.get().strip()
        valid, err, numbers = validate_number_list(text)
        if not valid:
            messagebox.showerror("Data Error", err)
            return

        res = self.engine.analyze(numbers)
        if not res["success"]:
            messagebox.showerror("Analysis Error", res["error"])
            return

        self.current_data = numbers

        # Update table
        for r in self.tree.get_children():
            self.tree.delete(r)

        for metric, val in res["metrics"].items():
            self.tree.insert("", "end", values=(metric, val))

        self.render_chart()
        self.app.set_status(f"Analyzed {len(numbers)} values. Mean = {res['values']['mean']:.3f}")

    def render_chart(self):
        for w in self.chart_container.winfo_children():
            w.destroy()

        if not self.current_data:
            return

        ctype = self.chart_type.get()
        success, fig, err = self.plot_engine.plot_statistics(self.current_data, chart_type=ctype)
        if not success:
            tk.Label(self.chart_container, text=err, fg=COLOR_TEXT_SECONDARY, bg=COLOR_CARD).pack(expand=True)
            return

        if CANVAS_TK_AVAILABLE:
            canvas = FigureCanvasTkAgg(fig, master=self.chart_container)
            canvas.draw()
            canvas.get_tk_widget().pack(fill="both", expand=True)
