"""
MathLab Main Application Shell
Orchestrates sidebar navigation, view switching, header status, and database lifecycle.
Developed by: Madhur (Team Head)
"""

try:
    import tkinter as tk
    from tkinter import ttk, messagebox
    TKINTER_AVAILABLE = True
except ImportError:
    TKINTER_AVAILABLE = False

from gui.theme import (
    apply_theme, COLOR_BG, COLOR_BG_SECONDARY, COLOR_CARD,
    COLOR_ACCENT, COLOR_TEXT_PRIMARY, COLOR_TEXT_SECONDARY,
    FONT_HEADING, FONT_SUBHEADING, FONT_BODY_BOLD, FONT_BODY, FONT_MONO
)
from database.db_manager import DatabaseManager
from gui.dashboard import DashboardView
from gui.calculator_view import CalculatorView
from gui.equations_view import EquationsView
from gui.graphing_view import GraphingView
from gui.matrix_view import MatrixView
from gui.statistics_view import StatisticsView
from gui.probability_view import ProbabilityView
from gui.calculus_view import CalculusView
from gui.converter_view import UnitConverterView
from gui.settings_view import SettingsView


class MathLabApp:
    """Primary application orchestrator for Tkinter desktop window."""

    def __init__(self, root):
        if not TKINTER_AVAILABLE:
            raise RuntimeError("Tkinter is required to run the desktop GUI.")

        self.root = root
        self.root.title("MathLab — Interactive Mathematical Computing & Visualization System")
        self.root.geometry("1200x780")
        self.root.minsize(1050, 680)

        # Initialize SQLite database
        self.db = DatabaseManager()

        # Configure Theme
        self.style = ttk.Style()
        apply_theme(self.root, self.style)

        self.views = {}
        self.current_view_key = None
        self.nav_buttons = {}

        self._build_shell()
        self.navigate_to("dashboard")

    def _build_shell(self):
        # 1. Top Header Bar
        self.header = tk.Frame(self.root, bg=COLOR_BG_SECONDARY, height=54, highlightbackground="#1E293B", highlightthickness=1)
        self.header.pack(fill="x", side="top")
        self.header.pack_propagate(False)

        # App Brand Title
        brand_frame = tk.Frame(self.header, bg=COLOR_BG_SECONDARY)
        brand_frame.pack(side="left", padx=20, pady=10)

        brand_logo = tk.Label(brand_frame, text="MathLab", font=FONT_HEADING, fg=COLOR_ACCENT, bg=COLOR_BG_SECONDARY)
        brand_logo.pack(side="left")

        brand_sub = tk.Label(brand_frame, text=" |  Computing & Visualization", font=FONT_BODY, fg=COLOR_TEXT_SECONDARY, bg=COLOR_BG_SECONDARY)
        brand_sub.pack(side="left")

        # Top Right: System Status indicator
        status_frame = tk.Frame(self.header, bg=COLOR_BG_SECONDARY)
        status_frame.pack(side="right", padx=20, pady=12)

        self.status_dot = tk.Label(status_frame, text="●", fg="#10B981", bg=COLOR_BG_SECONDARY, font=("Segoe UI", 12))
        self.status_dot.pack(side="left", padx=(0, 6))

        self.header_status = tk.Label(status_frame, text="System Ready", font=FONT_BODY_BOLD, fg=COLOR_TEXT_PRIMARY, bg=COLOR_BG_SECONDARY)
        self.header_status.pack(side="left")

        # 2. Bottom Status Bar
        self.statusbar = tk.Frame(self.root, bg=COLOR_BG_SECONDARY, height=26, highlightbackground="#1E293B", highlightthickness=1)
        self.statusbar.pack(fill="x", side="bottom")
        self.statusbar.pack_propagate(False)

        self.status_label = tk.Label(self.statusbar, text="Ready. Database initialized at mathlab.db", font=FONT_MONO, fg=COLOR_TEXT_SECONDARY, bg=COLOR_BG_SECONDARY, anchor="w", padx=12)
        self.status_label.pack(side="left", fill="x", expand=True)

        author_label = tk.Label(self.statusbar, text="Madhur • Ramji • Shiva", font=FONT_BODY, fg=COLOR_TEXT_SECONDARY, bg=COLOR_BG_SECONDARY, padx=12)
        author_label.pack(side="right")

        # 3. Main Body Split: Left Sidebar + Right Viewport
        self.body = tk.Frame(self.root, bg=COLOR_BG)
        self.body.pack(fill="both", expand=True)

        self._build_sidebar()

        # Viewport Area
        self.viewport = tk.Frame(self.body, bg=COLOR_BG)
        self.viewport.pack(side="right", fill="both", expand=True)

    def _build_sidebar(self):
        self.sidebar = tk.Frame(self.body, bg=COLOR_BG_SECONDARY, width=220, highlightbackground="#1E293B", highlightthickness=1)
        self.sidebar.pack(side="left", fill="y")
        self.sidebar.pack_propagate(False)

        nav_header = tk.Label(self.sidebar, text="NAVIGATION", font=("Segoe UI", 9, "bold"), fg="#64748B", bg=COLOR_BG_SECONDARY, padx=20, pady=12, anchor="w")
        nav_header.pack(fill="x")

        nav_items = [
            ("dashboard", "◈  Dashboard"),
            ("calculator", "∑  Calculator"),
            ("equations", "ƒ  Equations"),
            ("graphing", "📈 Graphing"),
            ("matrices", "▦  Matrices"),
            ("statistics", "σ  Statistics"),
            ("probability", "P  Probability"),
            ("calculus", "∫  Calculus"),
            ("converter", "⇄  Converter"),
            ("settings", "⚙  Settings"),
        ]

        for key, label in nav_items:
            btn = tk.Button(
                self.sidebar,
                text=label,
                font=FONT_BODY_BOLD,
                bg=COLOR_BG_SECONDARY,
                fg=COLOR_TEXT_SECONDARY,
                activebackground=COLOR_CARD,
                activeforeground=COLOR_ACCENT,
                bd=0,
                anchor="w",
                padx=20,
                pady=10,
                command=lambda k=key: self.navigate_to(k),
            )
            btn.pack(fill="x", pady=1)
            self.nav_buttons[key] = btn

    def navigate_to(self, view_key: str):
        """Switch current active module inside viewport."""
        # Unhighlight previous button
        if self.current_view_key and self.current_view_key in self.nav_buttons:
            self.nav_buttons[self.current_view_key].configure(bg=COLOR_BG_SECONDARY, fg=COLOR_TEXT_SECONDARY)

        # Highlight newly selected button
        if view_key in self.nav_buttons:
            self.nav_buttons[view_key].configure(bg=COLOR_CARD, fg=COLOR_ACCENT)

        # Hide currently visible view
        if self.current_view_key and self.current_view_key in self.views:
            self.views[self.current_view_key].pack_forget()

        # Instantiate view if not already cached
        if view_key not in self.views:
            view_classes = {
                "dashboard": DashboardView,
                "calculator": CalculatorView,
                "equations": EquationsView,
                "graphing": GraphingView,
                "matrices": MatrixView,
                "statistics": StatisticsView,
                "probability": ProbabilityView,
                "calculus": CalculusView,
                "converter": UnitConverterView,
                "settings": SettingsView,
            }
            cls = view_classes.get(view_key)
            if cls:
                self.views[view_key] = cls(self.viewport, self)

        # Display view
        if view_key in self.views:
            self.views[view_key].pack(fill="both", expand=True)
            self.current_view_key = view_key

            # If dashboard is activated, refresh its dynamic statistics
            if view_key == "dashboard":
                self.views["dashboard"].refresh_stats()
                self.views["dashboard"].refresh_recent_activity()

        self.set_status(f"Active module: {view_key.capitalize()}")

    def set_status(self, message: str):
        """Update bottom status bar message."""
        self.status_label.configure(text=message)
