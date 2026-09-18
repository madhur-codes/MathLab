"""
MathLab Dashboard View
Overview cards, live database statistics, quick action shortcuts, and recent activity log.
Developed by: Madhur (Team Head)
"""

try:
    import tkinter as tk
    from tkinter import ttk
    TKINTER_AVAILABLE = True
except ImportError:
    TKINTER_AVAILABLE = False

from gui.theme import (
    COLOR_BG, COLOR_BG_SECONDARY, COLOR_CARD, COLOR_ACCENT,
    COLOR_SECONDARY_ACCENT, COLOR_TEXT_PRIMARY, COLOR_TEXT_SECONDARY,
    FONT_TITLE, FONT_HEADING, FONT_SUBHEADING, FONT_STAT, FONT_BODY, FONT_BODY_BOLD
)


class DashboardView(ttk.Frame if TKINTER_AVAILABLE else object):
    """Main dashboard displaying system statistics and recent actions."""

    def __init__(self, parent, app):
        if not TKINTER_AVAILABLE:
            return
        super().__init__(parent, style="TFrame")
        self.app = app
        self.db = app.db
        self._build_ui()

    def _build_ui(self):
        # Header banner
        header_frame = ttk.Frame(self, style="TFrame")
        header_frame.pack(fill="x", padx=24, pady=(20, 16))

        title_lbl = ttk.Label(header_frame, text="Welcome to MathLab", font=FONT_TITLE, foreground=COLOR_TEXT_PRIMARY)
        title_lbl.pack(anchor="w")

        sub_lbl = ttk.Label(
            header_frame,
            text="Interactive Mathematical Computing & Visualization System — Integrated Laboratory",
            font=FONT_SUBHEADING,
            foreground=COLOR_TEXT_SECONDARY,
        )
        sub_lbl.pack(anchor="w", pady=(4, 0))

        # Metrics summary row (Cards)
        self.stats_frame = ttk.Frame(self, style="TFrame")
        self.stats_frame.pack(fill="x", padx=24, pady=10)
        self.refresh_stats()

        # Quick Actions Section
        action_header = ttk.Label(self, text="Quick Access Modules", font=FONT_HEADING, foreground=COLOR_ACCENT)
        action_header.pack(anchor="w", padx=24, pady=(20, 10))

        actions_grid = ttk.Frame(self, style="TFrame")
        actions_grid.pack(fill="x", padx=24, pady=5)

        modules = [
            ("∑ Scientific Calculator", "calculator"),
            ("ƒ Equation Solver", "equations"),
            ("📈 Function Grapher", "graphing"),
            ("▦ Matrix Laboratory", "matrices"),
            ("σ Statistics Engine", "statistics"),
            ("P Probability Lab", "probability"),
            ("∫ Calculus Studio", "calculus"),
            ("⇄ Unit Converter", "converter"),
        ]

        for idx, (label, nav_target) in enumerate(modules):
            btn = ttk.Button(
                actions_grid,
                text=label,
                style="TButton",
                command=lambda target=nav_target: self.app.navigate_to(target),
            )
            row = idx // 4
            col = idx % 4
            btn.grid(row=row, column=col, padx=6, pady=6, sticky="nsew")
            actions_grid.columnconfigure(col, weight=1)

        # Recent Activity Table
        recent_header = ttk.Label(self, text="Recent Activity History", font=FONT_HEADING, foreground=COLOR_TEXT_PRIMARY)
        recent_header.pack(anchor="w", padx=24, pady=(24, 8))

        table_frame = ttk.Frame(self, style="Card.TFrame")
        table_frame.pack(fill="both", expand=True, padx=24, pady=(0, 20))

        columns = ("module", "expression", "result", "time")
        self.tree = ttk.Treeview(table_frame, columns=columns, show="headings", height=7)
        self.tree.heading("module", text="Module")
        self.tree.heading("expression", text="Operation / Expression")
        self.tree.heading("result", text="Evaluated Result")
        self.tree.heading("time", text="Timestamp")

        self.tree.column("module", width=120, anchor="w")
        self.tree.column("expression", width=260, anchor="w")
        self.tree.column("result", width=220, anchor="w")
        self.tree.column("time", width=160, anchor="w")

        scrollbar = ttk.Scrollbar(table_frame, orient="vertical", command=self.tree.yview)
        self.tree.configure(yscrollcommand=scrollbar.set)

        self.tree.pack(side="left", fill="both", expand=True, padx=2, pady=2)
        scrollbar.pack(side="right", fill="y", pady=2)

        self.refresh_recent_activity()

    def refresh_stats(self):
        """Fetch fresh counts from SQLite and update dashboard metric cards."""
        for widget in self.stats_frame.winfo_children():
            widget.destroy()

        stats = self.db.get_dashboard_stats() if self.db else {
            "total_calculations": 0, "graphs_generated": 0, "matrices_processed": 0, "equations_solved": 0
        }

        cards = [
            ("Total Calculations", str(stats.get("total_calculations", 0)), COLOR_ACCENT),
            ("Graphs Generated", str(stats.get("graphs_generated", 0)), COLOR_SECONDARY_ACCENT),
            ("Matrices Processed", str(stats.get("matrices_processed", 0)), "#10B981"),
            ("Equations Solved", str(stats.get("equations_solved", 0)), "#F59E0B"),
        ]

        for idx, (label, val, color) in enumerate(cards):
            card = tk.Frame(self.stats_frame, bg=COLOR_CARD, highlightbackground=COLOR_BG_SECONDARY, highlightthickness=1)
            card.grid(row=0, column=idx, padx=6, pady=4, sticky="nsew")
            self.stats_frame.columnconfigure(idx, weight=1)

            val_lbl = tk.Label(card, text=val, font=FONT_STAT, fg=color, bg=COLOR_CARD)
            val_lbl.pack(anchor="w", padx=16, pady=(12, 0))

            lbl = tk.Label(card, text=label, font=FONT_BODY, fg=COLOR_TEXT_SECONDARY, bg=COLOR_CARD)
            lbl.pack(anchor="w", padx=16, pady=(0, 12))

    def refresh_recent_activity(self):
        """Populate recent database calculation records."""
        for row in self.tree.get_children():
            self.tree.delete(row)

        if not self.db:
            return

        records = self.db.get_recent_calculations(limit=12)
        for r in records:
            self.tree.insert("", "end", values=(
                r["module"].capitalize(),
                r["expression"],
                r["result"],
                r["created_at"],
            ))
