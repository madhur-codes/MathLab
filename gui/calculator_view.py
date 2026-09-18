"""
MathLab Scientific Calculator View
Interactive keypad and expression entry with scientific functions and history log.
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
    FONT_MONO_LARGE, FONT_MONO
)
from core.calculator import ScientificCalculator


class CalculatorView(ttk.Frame if TKINTER_AVAILABLE else object):
    """Scientific calculator GUI interface."""

    def __init__(self, parent, app):
        if not TKINTER_AVAILABLE:
            return
        super().__init__(parent, style="TFrame")
        self.app = app
        self.engine = ScientificCalculator(db_manager=app.db)
        self.current_expr = tk.StringVar(value="")
        self.result_display = tk.StringVar(value="0")
        self._build_ui()

    def _build_ui(self):
        main_container = ttk.Frame(self, style="TFrame")
        main_container.pack(fill="both", expand=True, padx=24, pady=20)

        # Left Column: Keypad & Display
        left_col = ttk.Frame(main_container, style="TFrame")
        left_col.pack(side="left", fill="both", expand=True, padx=(0, 16))

        # Header
        ttk.Label(left_col, text="Scientific Calculator", font=FONT_TITLE).pack(anchor="w", pady=(0, 4))
        ttk.Label(left_col, text="High-precision symbolic and numerical arithmetic parser", font=FONT_SUBHEADING, foreground=COLOR_TEXT_SECONDARY).pack(anchor="w", pady=(0, 12))

        # Display Card
        disp_card = tk.Frame(left_col, bg=COLOR_CARD, highlightbackground=COLOR_BG_SECONDARY, highlightthickness=1)
        disp_card.pack(fill="x", pady=(0, 14))

        # Expression Entry Field
        self.entry = tk.Entry(
            disp_card,
            textvariable=self.current_expr,
            font=FONT_MONO,
            bg=COLOR_CARD,
            fg=COLOR_TEXT_SECONDARY,
            insertbackground=COLOR_TEXT_PRIMARY,
            bd=0,
            justify="right",
        )
        self.entry.pack(fill="x", padx=16, pady=(12, 4))
        self.entry.bind("<Return>", lambda e: self.on_calculate())

        # Evaluated Result Large Display
        res_lbl = tk.Label(
            disp_card,
            textvariable=self.result_display,
            font=FONT_MONO_LARGE,
            bg=COLOR_CARD,
            fg=COLOR_ACCENT,
            anchor="e",
        )
        res_lbl.pack(fill="x", padx=16, pady=(0, 12))

        # Action Buttons (Copy Result, Clear, Backspace)
        top_ctrls = ttk.Frame(left_col, style="TFrame")
        top_ctrls.pack(fill="x", pady=(0, 10))

        ttk.Button(top_ctrls, text="Clear (C)", style="TButton", command=self.on_clear).pack(side="left", padx=(0, 6))
        ttk.Button(top_ctrls, text="⌫ Backspace", style="TButton", command=self.on_backspace).pack(side="left", padx=6)
        ttk.Button(top_ctrls, text="📋 Copy Result", style="TButton", command=self.on_copy_result).pack(side="right")

        # Keypad Layout (6 rows x 6 columns)
        keypad_frame = ttk.Frame(left_col, style="TFrame")
        keypad_frame.pack(fill="both", expand=True)

        buttons = [
            ("sin", "sin("), ("cos", "cos("), ("tan", "tan("), ("π", "pi"), ("e", "e"), ("^", "^"),
            ("asin", "asin("), ("acos", "acos("), ("atan", "atan("), ("(", "("), (")", ")"), ("÷", "/"),
            ("sinh", "sinh("), ("cosh", "cosh("), ("tanh", "tanh("), ("7", "7"), ("8", "8"), ("9", "9"),
            ("ln", "ln("), ("log10", "log10("), ("sqrt", "sqrt("), ("4", "4"), ("5", "5"), ("6", "6"),
            ("!", "!"), ("abs", "abs("), ("%", "%"), ("1", "1"), ("2", "2"), ("3", "3"),
            ("exp", "exp("), ("pow", "^"), ("0", "0"), (".", "."), ("+", "+"), ("-", "-"),
        ]

        for i, (label, val) in enumerate(buttons):
            r = i // 6
            c = i % 6
            # Distinguish digits vs operations
            is_digit = label in "0123456789."
            style_name = "TButton" if not is_digit else "TButton"

            btn = tk.Button(
                keypad_frame,
                text=label,
                font=FONT_BODY_BOLD if is_digit else FONT_BODY,
                bg=COLOR_CARD_HOVER if is_digit else COLOR_CARD,
                fg=COLOR_TEXT_PRIMARY,
                activebackground=COLOR_ACCENT,
                activeforeground="#000000",
                bd=0,
                padx=8,
                pady=10,
                command=lambda v=val: self.insert_token(v),
            )
            btn.grid(row=r, column=c, padx=3, pady=3, sticky="nsew")
            keypad_frame.columnconfigure(c, weight=1)
            keypad_frame.rowconfigure(r, weight=1)

        # Big Calculate button spanning width
        calc_btn = tk.Button(
            left_col,
            text="Calculate ( = )",
            font=FONT_HEADING,
            bg=COLOR_ACCENT,
            fg="#000000",
            activebackground=COLOR_SECONDARY_ACCENT,
            activeforeground="#FFFFFF",
            bd=0,
            pady=10,
            command=self.on_calculate,
        )
        calc_btn.pack(fill="x", pady=(12, 0))

        # Right Column: Calculation History
        right_col = ttk.Frame(main_container, style="Card.TFrame", width=260)
        right_col.pack(side="right", fill="both", padx=(16, 0))
        right_col.pack_propagate(False)

        hist_header = tk.Label(right_col, text="Calculation History", font=FONT_SUBHEADING, bg=COLOR_CARD, fg=COLOR_ACCENT)
        hist_header.pack(anchor="w", padx=12, pady=(12, 6))

        self.hist_listbox = tk.Listbox(
            right_col,
            bg=COLOR_CARD,
            fg=COLOR_TEXT_PRIMARY,
            selectbackground=COLOR_SECONDARY_ACCENT,
            bd=0,
            font=FONT_MONO,
            highlightthickness=0,
        )
        self.hist_listbox.pack(fill="both", expand=True, padx=8, pady=(0, 8))
        self.hist_listbox.bind("<Double-Button-1>", self.on_history_double_click)

        self.refresh_history()

    def insert_token(self, token: str):
        self.current_expr.set(self.current_expr.get() + token)
        self.entry.icursor(tk.END)

    def on_clear(self):
        self.current_expr.set("")
        self.result_display.set("0")

    def on_backspace(self):
        cur = self.current_expr.get()
        if cur:
            self.current_expr.set(cur[:-1])

    def on_calculate(self):
        expr = self.current_expr.get().strip()
        if not expr:
            return

        success, result, _ = self.engine.evaluate(expr)
        if success:
            self.result_display.set(result)
            self.refresh_history()
            self.app.set_status(f"Calculated: {expr} = {result}")
        else:
            self.result_display.set("Error")
            messagebox.showerror("Calculation Error", result)
            self.app.set_status(f"Calculation Error: {result}")

    def on_copy_result(self):
        res = self.result_display.get()
        if res and res != "Error":
            self.clipboard_clear()
            self.clipboard_append(res)
            self.app.set_status(f"Copied '{res}' to clipboard.")

    def on_history_double_click(self, event):
        sel = self.hist_listbox.curselection()
        if sel:
            item = self.hist_listbox.get(sel[0])
            if "=" in item:
                expr_part = item.split("=")[0].strip()
                self.current_expr.set(expr_part)

    def refresh_history(self):
        if not self.app.db:
            return
        self.hist_listbox.delete(0, tk.END)
        calcs = self.app.db.get_recent_calculations(limit=25)
        for c in calcs:
            if c["module"] == "calculator":
                self.hist_listbox.insert(tk.END, f"{c['expression']} = {c['result']}")
