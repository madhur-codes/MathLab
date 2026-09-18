"""
MathLab Visualization Engine
Matplotlib figure generation for function graphing, statistics, and probability distributions.
Designed for embedded Tkinter Canvas and file export.
Developed by: Ramji (Visualization & Statistics)
"""

from typing import List, Dict, Any, Optional, Tuple
from utils.helpers import preprocess_expression

try:
    import numpy as np
    NUMPY_AVAILABLE = True
except ImportError:
    NUMPY_AVAILABLE = False

try:
    import matplotlib
    # Use non-interactive backend by default to avoid headful window popup during export
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    from matplotlib.figure import Figure
    MATPLOTLIB_AVAILABLE = True
except ImportError:
    MATPLOTLIB_AVAILABLE = False


class PlotEngine:
    """Creates publication-ready dark-themed mathematical figures."""

    THEME = {
        "bg_dark": "#111827",
        "card_bg": "#172033",
        "text_primary": "#F8FAFC",
        "text_secondary": "#94A3B8",
        "accent_cyan": "#00D4FF",
        "accent_purple": "#8B5CF6",
        "accent_emerald": "#10B981",
        "accent_amber": "#F59E0B",
        "accent_rose": "#F43F5E",
        "grid_color": "#1E293B",
    }

    PALETTE = ["#00D4FF", "#8B5CF6", "#10B981", "#F59E0B", "#F43F5E", "#38BDF8"]

    def __init__(self):
        pass

    def _create_styled_figure(self, figsize: Tuple[float, float] = (7.5, 4.5), dpi: int = 100) -> Tuple[Any, Any]:
        """Initialize figure and axis with MathLab dark palette styling."""
        if not MATPLOTLIB_AVAILABLE:
            raise RuntimeError("Matplotlib is required for plotting.")

        fig = Figure(figsize=figsize, dpi=dpi, facecolor=self.THEME["bg_dark"])
        ax = fig.add_subplot(111)
        ax.set_facecolor(self.THEME["card_bg"])

        # Spine and tick styling
        for spine in ax.spines.values():
            spine.set_color(self.THEME["grid_color"])
            spine.set_linewidth(1.2)

        ax.tick_params(colors=self.THEME["text_secondary"], which="both", labelsize=9)
        ax.grid(True, linestyle="--", alpha=0.4, color=self.THEME["grid_color"])
        return fig, ax

    def plot_functions(
        self,
        function_strings: List[str],
        x_min: float = -10.0,
        x_max: float = 10.0,
        num_points: int = 500,
        title: str = "Mathematical Function Plot",
    ) -> Tuple[bool, Any, Optional[str]]:
        """
        Plot one or more mathematical functions f(x) over [x_min, x_max].
        Returns (success, figure, error_message)
        """
        if not MATPLOTLIB_AVAILABLE or not NUMPY_AVAILABLE:
            return False, None, "Matplotlib and NumPy are required for graphing."

        if x_min >= x_max:
            return False, None, f"Invalid domain: x_min ({x_min}) must be strictly less than x_max ({x_max})."

        fig, ax = self._create_styled_figure()
        x_vals = np.linspace(x_min, x_max, num_points)

        safe_funcs = {
            "sin": np.sin,
            "cos": np.cos,
            "tan": np.tan,
            "arcsin": np.arcsin,
            "arccos": np.arccos,
            "arctan": np.arctan,
            "sinh": np.sinh,
            "cosh": np.cosh,
            "tanh": np.tanh,
            "sqrt": np.sqrt,
            "log": np.log,
            "log10": np.log10,
            "ln": np.log,
            "exp": np.exp,
            "abs": np.abs,
            "pi": np.pi,
            "e": np.e,
        }

        plotted_any = False
        errors = []

        for idx, fn_str in enumerate(function_strings):
            raw_fn = fn_str.strip()
            if not raw_fn:
                continue

            # Remove 'y =' or 'f(x) =' prefix if entered
            clean = raw_fn
            if "=" in clean:
                clean = clean.split("=", 1)[1].strip()

            prep = preprocess_expression(clean)
            color = self.PALETTE[idx % len(self.PALETTE)]

            try:
                # Vectorized evaluation
                y_vals = eval(prep, {"__builtins__": None, "x": x_vals}, safe_funcs)

                # Convert scalar result (like y = 5) to array
                if np.isscalar(y_vals):
                    y_vals = np.full_like(x_vals, float(y_vals))

                # Mask asymptotes or infinites
                y_vals = np.asarray(y_vals, dtype=float)
                y_vals[np.isinf(y_vals)] = np.nan
                # Mask abrupt tangent asymptotes
                if "tan" in clean:
                    diffs = np.abs(np.diff(y_vals))
                    mask = np.where(diffs > 50)[0]
                    for m in mask:
                        y_vals[m] = np.nan

                ax.plot(x_vals, y_vals, label=f"y = {clean}", color=color, linewidth=2.0)
                plotted_any = True
            except Exception as e:
                errors.append(f"Could not plot '{raw_fn}': {str(e)}")

        if not plotted_any:
            err_msg = "; ".join(errors) if errors else "No valid functions provided to plot."
            return False, None, err_msg

        ax.axhline(0, color=self.THEME["text_secondary"], linewidth=0.8, linestyle="-", alpha=0.5)
        ax.axvline(0, color=self.THEME["text_secondary"], linewidth=0.8, linestyle="-", alpha=0.5)

        ax.set_title(title, color=self.THEME["text_primary"], fontsize=12, fontweight="bold", pad=12)
        ax.set_xlabel("x (Domain)", color=self.THEME["text_secondary"], fontsize=10)
        ax.set_ylabel("f(x) (Range)", color=self.THEME["text_secondary"], fontsize=10)
        
        legend = ax.legend(facecolor=self.THEME["bg_dark"], edgecolor=self.THEME["grid_color"], fontsize=9)
        for text in legend.get_texts():
            text.set_color(self.THEME["text_primary"])

        fig.tight_layout()
        return True, fig, None

    def plot_statistics(self, data: List[float], chart_type: str = "histogram") -> Tuple[bool, Any, Optional[str]]:
        """
        Generate statistical figures: histogram, box, bar, or pie chart.
        """
        if not MATPLOTLIB_AVAILABLE or not NUMPY_AVAILABLE:
            return False, None, "Matplotlib and NumPy are required."

        if not data:
            return False, None, "Dataset cannot be empty."

        fig, ax = self._create_styled_figure()
        arr = np.array(data)

        if chart_type == "histogram":
            n_bins = max(5, min(20, int(np.sqrt(len(data)))))
            ax.hist(arr, bins=n_bins, color=self.THEME["accent_cyan"], edgecolor=self.THEME["bg_dark"], alpha=0.85)
            ax.axvline(np.mean(arr), color=self.THEME["accent_purple"], linestyle="--", linewidth=2, label=f"Mean: {np.mean(arr):.2f}")
            ax.axvline(np.median(arr), color=self.THEME["accent_emerald"], linestyle=":", linewidth=2, label=f"Median: {np.median(arr):.2f}")
            ax.set_title("Data Distribution Histogram", color=self.THEME["text_primary"], fontsize=12, fontweight="bold")
            ax.set_xlabel("Values", color=self.THEME["text_secondary"])
            ax.set_ylabel("Frequency", color=self.THEME["text_secondary"])
            legend = ax.legend(facecolor=self.THEME["bg_dark"], edgecolor=self.THEME["grid_color"])
            for t in legend.get_texts():
                t.set_color(self.THEME["text_primary"])

        elif chart_type == "box":
            box = ax.boxplot(arr, patch_artist=True, vert=False)
            for patch in box["boxes"]:
                patch.set_facecolor(self.THEME["accent_purple"])
                patch.set_alpha(0.8)
            for median in box["medians"]:
                median.set_color(self.THEME["accent_cyan"])
                median.set_linewidth(2)
            ax.set_title("Five-Number Summary Box Plot", color=self.THEME["text_primary"], fontsize=12, fontweight="bold")
            ax.set_xlabel("Observations", color=self.THEME["text_secondary"])

        elif chart_type == "bar":
            indices = np.arange(len(data))
            ax.bar(indices, data, color=self.THEME["accent_cyan"], alpha=0.85, edgecolor=self.THEME["bg_dark"])
            ax.set_title("Discrete Value Bar Chart", color=self.THEME["text_primary"], fontsize=12, fontweight="bold")
            ax.set_xlabel("Data Index", color=self.THEME["text_secondary"])
            ax.set_ylabel("Value", color=self.THEME["text_secondary"])

        elif chart_type == "pie":
            # For pie, bin or take unique values if categorical
            unique_vals, counts = np.unique(arr, return_counts=True)
            if len(unique_vals) > 8:
                # Group into 6 bins if continuous
                counts, bin_edges = np.histogram(arr, bins=6)
                labels = [f"{bin_edges[i]:.1f}-{bin_edges[i+1]:.1f}" for i in range(len(counts))]
            else:
                labels = [str(val) for val in unique_vals]

            fig.clf()
            fig.patch.set_facecolor(self.THEME["bg_dark"])
            ax = fig.add_subplot(111)
            ax.set_facecolor(self.THEME["card_bg"])
            wedges, texts, autotexts = ax.pie(
                counts,
                labels=labels,
                autopct="%1.1f%%",
                colors=self.PALETTE[:len(counts)],
                textprops=dict(color=self.THEME["text_primary"]),
            )
            for autotext in autotexts:
                autotext.set_color("#FFFFFF")
                autotext.set_fontweight("bold")
            ax.set_title("Proportional Distribution Pie Chart", color=self.THEME["text_primary"], fontsize=12, fontweight="bold")

        fig.tight_layout()
        return True, fig, None

    def plot_probability_simulation(self, experiment_type: str, data: Dict[str, Any]) -> Tuple[bool, Any, Optional[str]]:
        """
        Generate visualization for Coin Toss or Dice Roll experiments.
        """
        if not MATPLOTLIB_AVAILABLE:
            return False, None, "Matplotlib is required."

        fig, ax = self._create_styled_figure()

        if experiment_type == "coin":
            categories = ["Heads", "Tails"]
            counts = [data["heads_count"], data["tails_count"]]
            bars = ax.bar(categories, counts, color=[self.THEME["accent_cyan"], self.THEME["accent_purple"]], width=0.5, edgecolor=self.THEME["bg_dark"])
            
            # Theoretical horizontal reference line
            half = data["tosses"] / 2.0
            ax.axhline(half, color=self.THEME["accent_amber"], linestyle="--", linewidth=1.5, label=f"Theoretical (50% = {int(half)})")

            for bar in bars:
                height = bar.get_height()
                ax.annotate(
                    f"{height}\n({height/data['tosses']*100:.1f}%)",
                    xy=(bar.get_x() + bar.get_width() / 2, height),
                    xytext=(0, 4),
                    textcoords="offset points",
                    ha="center",
                    va="bottom",
                    color=self.THEME["text_primary"],
                    fontweight="bold",
                )

            ax.set_title(f"Coin Toss Experiment (N = {data['tosses']:,})", color=self.THEME["text_primary"], fontsize=12, fontweight="bold")
            ax.set_ylabel("Outcome Frequency", color=self.THEME["text_secondary"])
            legend = ax.legend(facecolor=self.THEME["bg_dark"], edgecolor=self.THEME["grid_color"])
            for t in legend.get_texts():
                t.set_color(self.THEME["text_primary"])

        elif experiment_type == "dice":
            counts_dict = data["counts"]
            faces = [str(f) for f in sorted(counts_dict.keys())]
            counts = [counts_dict[int(f)] for f in faces]
            bars = ax.bar(faces, counts, color=self.THEME["accent_purple"], alpha=0.9, width=0.6, edgecolor=self.THEME["bg_dark"])

            expected = data["rolls"] / 6.0
            ax.axhline(expected, color=self.THEME["accent_cyan"], linestyle="--", linewidth=1.5, label=f"Theoretical (16.7% = {expected:.1f})")

            for bar in bars:
                height = bar.get_height()
                ax.annotate(
                    f"{height}",
                    xy=(bar.get_x() + bar.get_width() / 2, height),
                    xytext=(0, 3),
                    textcoords="offset points",
                    ha="center",
                    va="bottom",
                    color=self.THEME["text_primary"],
                    fontsize=9,
                )

            ax.set_title(f"Fair Die Roll Distribution (N = {data['rolls']:,})", color=self.THEME["text_primary"], fontsize=12, fontweight="bold")
            ax.set_xlabel("Die Face Outcome", color=self.THEME["text_secondary"])
            ax.set_ylabel("Observed Frequency", color=self.THEME["text_secondary"])
            legend = ax.legend(facecolor=self.THEME["bg_dark"], edgecolor=self.THEME["grid_color"])
            for t in legend.get_texts():
                t.set_color(self.THEME["text_primary"])

        fig.tight_layout()
        return True, fig, None

    def plot_calculus_derivative(
        self,
        f_expr: str,
        f_prime_expr: str,
        x_min: float = -5.0,
        x_max: float = 5.0,
    ) -> Tuple[bool, Any, Optional[str]]:
        """
        Plot original function f(x) alongside its first derivative f'(x).
        """
        return self.plot_functions(
            [f_expr, f_prime_expr],
            x_min=x_min,
            x_max=x_max,
            title=f"Calculus: f(x) vs f'(x)",
        )
