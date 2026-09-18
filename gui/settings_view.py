"""
MathLab Settings & About View
System configuration, database maintenance (clear history, reset counters), and team information.
Developed by: Madhur (Team Head)
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
    FONT_TITLE, FONT_HEADING, FONT_SUBHEADING, FONT_BODY, FONT_BODY_BOLD, FONT_MONO
)


class SettingsView(ttk.Frame if TKINTER_AVAILABLE else object):
    """Settings, maintenance, and project identity view."""

    def __init__(self, parent, app):
        if not TKINTER_AVAILABLE:
            return
        super().__init__(parent, style="TFrame")
        self.app = app
        self.db = app.db
        self._build_ui()

    def _build_ui(self):
        header_frame = ttk.Frame(self, style="TFrame")
        header_frame.pack(fill="x", padx=24, pady=(20, 10))

        ttk.Label(header_frame, text="Settings & About MathLab", font=FONT_TITLE).pack(anchor="w")
        ttk.Label(
            header_frame,
            text="Application diagnostics, database administration, and project attribution.",
            font=FONT_SUBHEADING,
            foreground=COLOR_TEXT_SECONDARY,
        ).pack(anchor="w", pady=(4, 0))

        content = ttk.Frame(self, style="TFrame")
        content.pack(fill="both", expand=True, padx=24, pady=(0, 20))

        # Left Column: About & Team
        left_col = tk.Frame(content, bg=COLOR_BG)
        left_col.pack(side="left", fill="both", expand=True, padx=(0, 14))

        about_card = tk.Frame(left_col, bg=COLOR_CARD, highlightbackground=COLOR_BG_SECONDARY, highlightthickness=1)
        about_card.pack(fill="x", pady=(0, 14))

        tk.Label(about_card, text="MathLab", font=FONT_TITLE, fg=COLOR_ACCENT, bg=COLOR_CARD).pack(anchor="w", padx=20, pady=(16, 2))
        tk.Label(about_card, text="Interactive Mathematical Computing & Visualization System", font=FONT_SUBHEADING, fg=COLOR_TEXT_PRIMARY, bg=COLOR_CARD).pack(anchor="w", padx=20)
        tk.Label(about_card, text="Version: 1.0.0  •  Built with Python 3, Tkinter, SymPy, NumPy & Matplotlib", font=FONT_BODY, fg=COLOR_TEXT_SECONDARY, bg=COLOR_CARD).pack(anchor="w", padx=20, pady=(4, 16))

        # Team Responsibilities Card
        team_card = tk.Frame(left_col, bg=COLOR_CARD, highlightbackground=COLOR_BG_SECONDARY, highlightthickness=1)
        team_card.pack(fill="both", expand=True)

        tk.Label(team_card, text="Engineering Team", font=FONT_HEADING, fg=COLOR_TEXT_PRIMARY, bg=COLOR_CARD).pack(anchor="w", padx=20, pady=(16, 12))

        members = [
            ("Madhur — Team Head", "Overall project architecture, GUI & dashboard, main integration, navigation, SQLite database, testing, and final presentation."),
            ("Ramji — Computation Specialist", "Mathematical computation engine, scientific calculator, equation solver, matrix algebra, calculus module, SymPy symbolic integration, formula validation."),
            ("Shiva — Visualization Specialist", "Graphing and visualization, statistics module, probability laboratory, Matplotlib integration, simulation functionality."),
        ]

        for name, role in members:
            m_box = tk.Frame(team_card, bg=COLOR_BG_SECONDARY, padx=14, pady=10)
            m_box.pack(fill="x", padx=20, pady=4)
            tk.Label(m_box, text=name, font=FONT_BODY_BOLD, fg=COLOR_ACCENT, bg=COLOR_BG_SECONDARY).pack(anchor="w")
            tk.Label(m_box, text=role, font=FONT_BODY, fg=COLOR_TEXT_SECONDARY, bg=COLOR_BG_SECONDARY, wraplength=420, justify="left").pack(anchor="w", pady=(2, 0))

        # Right Column: Database Maintenance & Diagnostics
        right_col = tk.Frame(content, bg=COLOR_CARD, highlightbackground=COLOR_BG_SECONDARY, highlightthickness=1, width=320)
        right_col.pack(side="right", fill="both", padx=(14, 0))
        right_col.pack_propagate(False)

        tk.Label(right_col, text="Database Administration", font=FONT_HEADING, fg=COLOR_TEXT_PRIMARY, bg=COLOR_CARD).pack(anchor="w", padx=16, pady=(16, 8))

        db_path = self.db.db_path if self.db else "N/A"
        tk.Label(right_col, text=f"Storage Engine: SQLite 3\nLocation: {db_path}", font=FONT_MONO, fg=COLOR_TEXT_SECONDARY, bg=COLOR_CARD, justify="left", wraplength=280).pack(anchor="w", padx=16, pady=(0, 12))

        tk.Button(right_col, text="🗑 Clear Calculation History", font=FONT_BODY_BOLD, bg=COLOR_BG_SECONDARY, fg="#F87171", bd=0, padx=12, pady=6, anchor="w", command=self.on_clear_history).pack(fill="x", padx=16, pady=4)
        tk.Button(right_col, text="↺ Reset Module Statistics", font=FONT_BODY_BOLD, bg=COLOR_BG_SECONDARY, fg="#FBBF24", bd=0, padx=12, pady=6, anchor="w", command=self.on_reset_stats).pack(fill="x", padx=16, pady=4)

        tk.Label(right_col, text="Color Palette Architecture", font=FONT_SUBHEADING, fg=COLOR_TEXT_PRIMARY, bg=COLOR_CARD).pack(anchor="w", padx=16, pady=(20, 8))

        colors = [
            ("Background", "#0B1020"),
            ("Secondary BG", "#111827"),
            ("Card Surface", "#172033"),
            ("Cyan Accent", "#00D4FF"),
            ("Purple Accent", "#8B5CF6"),
        ]
        for cname, chex in colors:
            crow = tk.Frame(right_col, bg=COLOR_CARD)
            crow.pack(fill="x", padx=16, pady=3)
            tk.Frame(crow, bg=chex, width=20, height=14).pack(side="left")
            tk.Label(crow, text=f"{cname} ({chex})", font=FONT_MONO, fg=COLOR_TEXT_SECONDARY, bg=COLOR_CARD).pack(side="left", padx=8)

    def on_clear_history(self):
        if messagebox.askyesno("Confirm", "Are you sure you want to delete all stored calculation logs?"):
            if self.db:
                self.db.clear_history()
            messagebox.showinfo("Success", "Calculation history cleared.")
            self.app.set_status("History database cleared.")

    def on_reset_stats(self):
        if messagebox.askyesno("Confirm", "Reset all module usage counters to 0?"):
            if self.db:
                self.db.reset_statistics()
            messagebox.showinfo("Success", "Module statistics reset.")
            self.app.set_status("Module counters reset.")
