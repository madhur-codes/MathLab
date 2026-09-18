"""
MathLab Graphing Laboratory View
Embedded Matplotlib canvas for multi-function plotting, domain scaling, and PNG export.
Developed by: Ramji (Visualization & Statistics)
"""

try:
    import tkinter as tk
    from tkinter import ttk, messagebox, filedialog
    TKINTER_AVAILABLE = True
except ImportError:
    TKINTER_AVAILABLE = False

from gui.theme import (
    COLOR_BG, COLOR_BG_SECONDARY, COLOR_CARD, COLOR_ACCENT,
    COLOR_SECONDARY_ACCENT, COLOR_TEXT_PRIMARY, COLOR_TEXT_SECONDARY,
    FONT_TITLE, FONT_SUBHEADING, FONT_BODY, FONT_BODY_BOLD, FONT_MONO
)
from visualization.plots import PlotEngine

try:
    from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg, NavigationToolbar2Tk
    CANVAS_TK_AVAILABLE = True
except ImportError:
    CANVAS_TK_AVAILABLE = False


class GraphingView(ttk.Frame if TKINTER_AVAILABLE else object):
    """Interactive multi-function graphing studio."""

    def __init__(self, parent, app):
        if not TKINTER_AVAILABLE:
            return
        super().__init__(parent, style="TFrame")
        self.app = app
        self.plot_engine = PlotEngine()
        self.current_fig = None
        self.canvas_widget = None
        self._build_ui()

    def _build_ui(self):
        # Header
        header_frame = ttk.Frame(self, style="TFrame")
        header_frame.pack(fill="x", padx=24, pady=(20, 10))

        ttk.Label(header_frame, text="Graphing Laboratory", font=FONT_TITLE).pack(anchor="w")
        ttk.Label(
            header_frame,
            text="Plot single or multiple functions simultaneously with interactive domain scaling and export.",
            font=FONT_SUBHEADING,
            foreground=COLOR_TEXT_SECONDARY,
        ).pack(anchor="w", pady=(4, 0))

        # Main horizontal split: Controls on left, Canvas on right
        content = ttk.Frame(self, style="TFrame")
        content.pack(fill="both", expand=True, padx=24, pady=(0, 20))

        # Left Control Panel
        left_panel = tk.Frame(content, bg=COLOR_CARD, highlightbackground=COLOR_BG_SECONDARY, highlightthickness=1, width=320)
        left_panel.pack(side="left", fill="y", padx=(0, 16))
        left_panel.pack_propagate(False)

        tk.Label(left_panel, text="Function Definitions", font=FONT_SUBHEADING, fg=COLOR_ACCENT, bg=COLOR_CARD).pack(anchor="w", padx=14, pady=(14, 6))

        # Function inputs (Up to 3 functions)
        self.fn_entries = []
        default_fns = ["sin(x)", "cos(x)", ""]
        colors = ["#00D4FF", "#8B5CF6", "#10B981"]

        for i in range(3):
            fn_row = tk.Frame(left_panel, bg=COLOR_CARD)
            fn_row.pack(fill="x", padx=14, pady=4)
            tk.Label(fn_row, text=f"f{i+1}(x) =", fg=colors[i], bg=COLOR_CARD, font=FONT_BODY_BOLD).pack(side="left")
            entry = tk.Entry(fn_row, font=FONT_MONO, bg=COLOR_BG, fg=COLOR_TEXT_PRIMARY, insertbackground=COLOR_TEXT_PRIMARY, bd=0)
            entry.insert(0, default_fns[i])
            entry.pack(side="left", fill="x", expand=True, padx=(6, 0), ipady=4)
            self.fn_entries.append(entry)

        # Domain settings (x_min, x_max)
        tk.Label(left_panel, text="Domain Interval [x_min, x_max]", font=FONT_SUBHEADING, fg=COLOR_TEXT_PRIMARY, bg=COLOR_CARD).pack(anchor="w", padx=14, pady=(16, 6))
        
        domain_row = tk.Frame(left_panel, bg=COLOR_CARD)
        domain_row.pack(fill="x", padx=14, pady=4)

        tk.Label(domain_row, text="x_min:", fg=COLOR_TEXT_SECONDARY, bg=COLOR_CARD).pack(side="left")
        self.x_min_entry = tk.Entry(domain_row, width=6, font=FONT_MONO, bg=COLOR_BG, fg=COLOR_TEXT_PRIMARY, insertbackground=COLOR_TEXT_PRIMARY, bd=0)
        self.x_min_entry.insert(0, "-10")
        self.x_min_entry.pack(side="left", padx=(4, 12), ipady=3)

        tk.Label(domain_row, text="x_max:", fg=COLOR_TEXT_SECONDARY, bg=COLOR_CARD).pack(side="left")
        self.x_max_entry = tk.Entry(domain_row, width=6, font=FONT_MONO, bg=COLOR_BG, fg=COLOR_TEXT_PRIMARY, insertbackground=COLOR_TEXT_PRIMARY, bd=0)
        self.x_max_entry.insert(0, "10")
        self.x_max_entry.pack(side="left", padx=(4, 0), ipady=3)

        # Quick preset examples
        tk.Label(left_panel, text="Preset Functions", font=FONT_SUBHEADING, fg=COLOR_TEXT_PRIMARY, bg=COLOR_CARD).pack(anchor="w", padx=14, pady=(16, 6))
        presets = [
            ("Polynomial (x² & x³)", ["x**2", "x**3 - 3*x", ""]),
            ("Trigonometry (sin & cos)", ["sin(x)", "cos(x)", ""]),
            ("Wave Beats", ["sin(x) + sin(1.2*x)", "cos(0.8*x)", ""]),
            ("Exponential & Log", ["exp(x/3)", "log(abs(x) + 1)", ""]),
        ]
        for name, fns in presets:
            btn = tk.Button(
                left_panel,
                text=name,
                font=FONT_BODY,
                bg=COLOR_BG_SECONDARY,
                fg=COLOR_TEXT_SECONDARY,
                activebackground=COLOR_ACCENT,
                activeforeground="#000000",
                bd=0,
                anchor="w",
                padx=8,
                pady=4,
                command=lambda f=fns: self.load_preset(f),
            )
            btn.pack(fill="x", padx=14, pady=2)

        # Action Buttons
        btn_row = tk.Frame(left_panel, bg=COLOR_CARD)
        btn_row.pack(fill="x", padx=14, pady=(20, 6))

        tk.Button(btn_row, text="Plot Graph", font=FONT_BODY_BOLD, bg=COLOR_ACCENT, fg="#000000", bd=0, padx=14, pady=6, command=self.on_plot).pack(side="left", fill="x", expand=True, padx=(0, 4))
        tk.Button(btn_row, text="Clear", font=FONT_BODY, bg=COLOR_BG_SECONDARY, fg=COLOR_TEXT_PRIMARY, bd=0, padx=10, pady=6, command=self.on_clear).pack(side="right", padx=(4, 0))

        tk.Button(left_panel, text="💾 Save Graph (PNG)", font=FONT_BODY_BOLD, bg=COLOR_SECONDARY_ACCENT, fg="#FFFFFF", bd=0, pady=6, command=self.on_save_png).pack(fill="x", padx=14, pady=(6, 14))

        # Right Area: Canvas Container
        self.canvas_container = tk.Frame(content, bg=COLOR_CARD, highlightbackground=COLOR_BG_SECONDARY, highlightthickness=1)
        self.canvas_container.pack(side="right", fill="both", expand=True)

        # Initial Plot
        self.on_plot()

    def load_preset(self, fns):
        for idx, fn in enumerate(fns):
            self.fn_entries[idx].delete(0, tk.END)
            self.fn_entries[idx].insert(0, fn)
        self.on_plot()

    def on_plot(self):
        try:
            x_min = float(self.x_min_entry.get().strip())
            x_max = float(self.x_max_entry.get().strip())
        except ValueError:
            messagebox.showerror("Domain Error", "x_min and x_max must be valid real numbers.")
            return

        active_fns = [e.get().strip() for e in self.fn_entries if e.get().strip()]
        if not active_fns:
            messagebox.showwarning("Warning", "Please enter at least one mathematical function.")
            return

        success, fig, err = self.plot_engine.plot_functions(active_fns, x_min=x_min, x_max=x_max)
        if not success:
            messagebox.showerror("Plotting Error", err or "Failed to plot mathematical functions.")
            return

        self.current_fig = fig
        self._render_figure(fig)

        # Log to DB
        if self.app.db:
            self.app.db.log_activity("graphing", f"Plotted functions: {', '.join(active_fns)}")
        self.app.set_status(f"Plotted {len(active_fns)} function(s) successfully.")

    def _render_figure(self, fig):
        # Remove prior canvas widgets
        for widget in self.canvas_container.winfo_children():
            widget.destroy()

        if not CANVAS_TK_AVAILABLE:
            tk.Label(self.canvas_container, text="Matplotlib FigureCanvasTkAgg is not installed.", fg=COLOR_TEXT_SECONDARY, bg=COLOR_CARD).pack(expand=True)
            return

        self.canvas_widget = FigureCanvasTkAgg(fig, master=self.canvas_container)
        self.canvas_widget.draw()
        self.canvas_widget.get_tk_widget().pack(fill="both", expand=True)

    def on_clear(self):
        for e in self.fn_entries:
            e.delete(0, tk.END)
        for widget in self.canvas_container.winfo_children():
            widget.destroy()
        self.app.set_status("Cleared graphing canvas.")

    def on_save_png(self):
        if not self.current_fig:
            messagebox.showwarning("Export Warning", "No active plot to export.")
            return

        filepath = filedialog.asksaveasfilename(
            defaultextension=".png",
            filetypes=[("PNG Image", "*.png"), ("All Files", "*.*")],
            title="Save Mathematical Graph As",
        )
        if filepath:
            try:
                self.current_fig.savefig(filepath, dpi=300, facecolor=self.current_fig.get_facecolor(), bbox_inches="tight")
                messagebox.showinfo("Export Success", f"Graph exported successfully to:\n{filepath}")
                self.app.set_status(f"Graph saved to {filepath}")
            except Exception as e:
                messagebox.showerror("Export Error", f"Failed to save PNG: {str(e)}")
