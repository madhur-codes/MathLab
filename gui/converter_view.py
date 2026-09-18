"""
MathLab Unit Converter View
Interactive scientific conversion across Length, Mass, Temperature, Area, Volume, Time, and Speed.
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
    FONT_TITLE, FONT_SUBHEADING, FONT_BODY, FONT_BODY_BOLD, FONT_MONO_LARGE
)
from utils.helpers import format_result


class UnitConverterView(ttk.Frame if TKINTER_AVAILABLE else object):
    """Scientific Unit Conversion Module."""

    CATEGORIES = {
        "Length": {
            "Meter (m)": 1.0,
            "Kilometer (km)": 1000.0,
            "Centimeter (cm)": 0.01,
            "Millimeter (mm)": 0.001,
            "Micrometer (μm)": 1e-6,
            "Mile (mi)": 1609.344,
            "Yard (yd)": 0.9144,
            "Foot (ft)": 0.3048,
            "Inch (in)": 0.0254,
            "Nautical Mile (nmi)": 1852.0,
        },
        "Mass": {
            "Kilogram (kg)": 1.0,
            "Gram (g)": 0.001,
            "Milligram (mg)": 1e-6,
            "Metric Ton (t)": 1000.0,
            "Pound (lb)": 0.45359237,
            "Ounce (oz)": 0.028349523,
            "Carat (ct)": 0.0002,
        },
        "Temperature": {
            "Celsius (°C)": "C",
            "Fahrenheit (°F)": "F",
            "Kelvin (K)": "K",
        },
        "Area": {
            "Square Meter (m²)": 1.0,
            "Square Kilometer (km²)": 1e6,
            "Hectare (ha)": 10000.0,
            "Acre (ac)": 4046.8564,
            "Square Foot (ft²)": 0.092903,
            "Square Inch (in²)": 0.00064516,
        },
        "Volume": {
            "Liter (L)": 1.0,
            "Milliliter (mL)": 0.001,
            "Cubic Meter (m³)": 1000.0,
            "Gallon (US gal)": 3.78541,
            "Fluid Ounce (fl oz)": 0.0295735,
            "Cup": 0.236588,
        },
        "Time": {
            "Second (s)": 1.0,
            "Millisecond (ms)": 0.001,
            "Minute (min)": 60.0,
            "Hour (hr)": 3600.0,
            "Day (d)": 86400.0,
            "Week (wk)": 604800.0,
            "Year (yr)": 31536000.0,
        },
        "Speed": {
            "Meters per second (m/s)": 1.0,
            "Kilometers per hour (km/h)": 0.277778,
            "Miles per hour (mph)": 0.44704,
            "Knot (kn)": 0.514444,
            "Speed of Light (c)": 299792458.0,
        },
    }

    def __init__(self, parent, app):
        if not TKINTER_AVAILABLE:
            return
        super().__init__(parent, style="TFrame")
        self.app = app
        self.current_category = tk.StringVar(value="Length")
        self.input_value = tk.StringVar(value="1")
        self.from_unit = tk.StringVar()
        self.to_unit = tk.StringVar()
        self.converted_display = tk.StringVar(value="0")
        self._build_ui()

    def _build_ui(self):
        header_frame = ttk.Frame(self, style="TFrame")
        header_frame.pack(fill="x", padx=24, pady=(20, 10))

        ttk.Label(header_frame, text="Unit Conversion System", font=FONT_TITLE).pack(anchor="w")
        ttk.Label(
            header_frame,
            text="High-precision physical and scientific dimension conversions.",
            font=FONT_SUBHEADING,
            foreground=COLOR_TEXT_SECONDARY,
        ).pack(anchor="w", pady=(4, 0))

        card = tk.Frame(self, bg=COLOR_CARD, highlightbackground=COLOR_BG_SECONDARY, highlightthickness=1)
        card.pack(fill="both", expand=True, padx=24, pady=(10, 24))

        # Category buttons row
        cat_bar = tk.Frame(card, bg=COLOR_CARD)
        cat_bar.pack(fill="x", padx=20, pady=(20, 16))

        for cat in self.CATEGORIES.keys():
            btn = tk.Radiobutton(
                cat_bar,
                text=cat,
                variable=self.current_category,
                value=cat,
                indicatoron=False,
                bg=COLOR_BG_SECONDARY,
                fg=COLOR_TEXT_PRIMARY,
                selectcolor=COLOR_ACCENT,
                activebackground=COLOR_BG_SECONDARY,
                bd=0,
                padx=12,
                pady=6,
                font=FONT_BODY_BOLD,
                command=self.on_category_change,
            )
            btn.pack(side="left", padx=4)

        # Converter Grid
        conv_grid = tk.Frame(card, bg=COLOR_CARD)
        conv_grid.pack(fill="x", padx=24, pady=16)

        # From unit block
        from_block = tk.Frame(conv_grid, bg=COLOR_BG_SECONDARY, padx=16, pady=16)
        from_block.pack(side="left", fill="both", expand=True, padx=(0, 12))

        tk.Label(from_block, text="Source Value & Unit", font=FONT_SUBHEADING, fg=COLOR_ACCENT, bg=COLOR_BG_SECONDARY).pack(anchor="w", pady=(0, 8))
        self.val_entry = tk.Entry(from_block, textvariable=self.input_value, font=FONT_MONO_LARGE, bg=COLOR_CARD, fg=COLOR_TEXT_PRIMARY, bd=0)
        self.val_entry.pack(fill="x", pady=(0, 10), ipady=6)
        self.val_entry.bind("<KeyRelease>", lambda e: self.convert())

        self.from_combo = ttk.Combobox(from_block, textvariable=self.from_unit, state="readonly", font=FONT_BODY)
        self.from_combo.pack(fill="x")
        self.from_combo.bind("<<ComboboxSelected>>", lambda e: self.convert())

        # Swap button in center
        swap_btn = tk.Button(conv_grid, text="⇄\nSwap", font=FONT_BODY_BOLD, bg=COLOR_BG_SECONDARY, fg=COLOR_ACCENT, bd=0, padx=8, pady=8, command=self.on_swap)
        swap_btn.pack(side="left", padx=4)

        # To unit block
        to_block = tk.Frame(conv_grid, bg=COLOR_BG_SECONDARY, padx=16, pady=16)
        to_block.pack(side="right", fill="both", expand=True, padx=(12, 0))

        tk.Label(to_block, text="Converted Output", font=FONT_SUBHEADING, fg=COLOR_SECONDARY_ACCENT, bg=COLOR_BG_SECONDARY).pack(anchor="w", pady=(0, 8))
        self.res_lbl = tk.Label(to_block, textvariable=self.converted_display, font=FONT_MONO_LARGE, fg=COLOR_ACCENT, bg=COLOR_CARD, anchor="w", padx=10, pady=8)
        self.res_lbl.pack(fill="x", pady=(0, 10))

        self.to_combo = ttk.Combobox(to_block, textvariable=self.to_unit, state="readonly", font=FONT_BODY)
        self.to_combo.pack(fill="x")
        self.to_combo.bind("<<ComboboxSelected>>", lambda e: self.convert())

        self.on_category_change()

    def on_category_change(self):
        cat = self.current_category.get()
        units = list(self.CATEGORIES[cat].keys())
        self.from_combo["values"] = units
        self.to_combo["values"] = units
        self.from_combo.current(0)
        self.to_combo.current(1 if len(units) > 1 else 0)
        self.convert()

    def on_swap(self):
        cur_f = self.from_unit.get()
        cur_t = self.to_unit.get()
        self.from_unit.set(cur_t)
        self.to_unit.set(cur_f)
        self.convert()

    def convert(self):
        try:
            val_str = self.input_value.get().strip()
            if not val_str:
                self.converted_display.set("0")
                return
            val = float(val_str)
        except ValueError:
            self.converted_display.set("Invalid Number")
            return

        cat = self.current_category.get()
        f_u = self.from_unit.get()
        t_u = self.to_unit.get()

        if not f_u or not t_u:
            return

        if cat == "Temperature":
            res = self._convert_temp(val, self.CATEGORIES[cat][f_u], self.CATEGORIES[cat][t_u])
        else:
            base_val = val * self.CATEGORIES[cat][f_u]
            res = base_val / self.CATEGORIES[cat][t_u]

        disp = format_result(res, precision=6)
        self.converted_display.set(disp)

    def _convert_temp(self, val: float, from_scale: str, to_scale: str) -> float:
        # Convert to Celsius first
        if from_scale == "C":
            c = val
        elif from_scale == "F":
            c = (val - 32.0) * 5.0 / 9.0
        else:  # K
            c = val - 273.15

        # Convert Celsius to target scale
        if to_scale == "C":
            return c
        elif to_scale == "F":
            return (c * 9.0 / 5.0) + 32.0
        else:  # K
            return c + 273.15
