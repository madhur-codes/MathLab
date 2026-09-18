"""
MathLab Statistics Engine
Computes comprehensive descriptive statistics, measures of central tendency, and dispersion.
Developed by: Shiva (Visualization & Statistics)
"""

import math
from collections import Counter
from typing import List, Dict, Any, Optional
from utils.helpers import format_result

try:
    import numpy as np
    NUMPY_AVAILABLE = True
except ImportError:
    NUMPY_AVAILABLE = False


class StatisticsEngine:
    """Calculates descriptive statistics with support for quartiles, mode, and dispersion metrics."""

    def __init__(self, db_manager: Optional[Any] = None):
        self.db = db_manager

    def analyze(self, data: List[float]) -> Dict[str, Any]:
        """
        Compute descriptive statistics for a list of numerical values.
        """
        if not data:
            return {"success": False, "error": "Data series is empty. Please provide numerical observations."}

        n = len(data)
        sorted_data = sorted(data)

        # Basic summaries
        total_sum = sum(data)
        mean_val = total_sum / n
        min_val = sorted_data[0]
        max_val = sorted_data[-1]
        data_range = max_val - min_val

        # Median
        if n % 2 == 1:
            median_val = sorted_data[n // 2]
        else:
            median_val = (sorted_data[n // 2 - 1] + sorted_data[n // 2]) / 2.0

        # Mode calculation
        counts = Counter(data)
        max_count = max(counts.values())
        if max_count == 1 and n > 1:
            mode_display = "No unique mode (all values appear once)"
            modes = []
        else:
            modes = [k for k, v in counts.items() if v == max_count]
            mode_display = ", ".join(format_result(m) for m in sorted(modes))

        # Variance & Standard Deviation (Sample vs Population)
        if n > 1:
            variance_sample = sum((x - mean_val) ** 2 for x in data) / (n - 1)
            std_dev_sample = math.sqrt(variance_sample)
        else:
            variance_sample = 0.0
            std_dev_sample = 0.0

        variance_pop = sum((x - mean_val) ** 2 for x in data) / n
        std_dev_pop = math.sqrt(variance_pop)

        # Quartiles & Percentiles
        if NUMPY_AVAILABLE:
            np_arr = np.array(data)
            q1 = float(np.percentile(np_arr, 25))
            q2 = float(np.percentile(np_arr, 50))
            q3 = float(np.percentile(np_arr, 75))
            p10 = float(np.percentile(np_arr, 10))
            p90 = float(np.percentile(np_arr, 90))
        else:
            # Fallback quartile calculation
            q2 = median_val
            mid = n // 2
            lower_half = sorted_data[:mid]
            upper_half = sorted_data[mid + 1:] if n % 2 != 0 else sorted_data[mid:]
            q1 = lower_half[len(lower_half) // 2] if lower_half else median_val
            q3 = upper_half[len(upper_half) // 2] if upper_half else median_val
            p10 = sorted_data[int(0.10 * (n - 1))]
            p90 = sorted_data[int(0.90 * (n - 1))]

        iqr = q3 - q1

        # Summary dictionary
        summary = {
            "Count (N)": str(n),
            "Sum": format_result(total_sum),
            "Mean (μ)": format_result(mean_val),
            "Median": format_result(median_val),
            "Mode": mode_display,
            "Minimum": format_result(min_val),
            "Maximum": format_result(max_val),
            "Range": format_result(data_range),
            "Sample Variance (s²)": format_result(variance_sample),
            "Sample Std Dev (s)": format_result(std_dev_sample),
            "Pop. Variance (σ²)": format_result(variance_pop),
            "Pop. Std Dev (σ)": format_result(std_dev_pop),
            "Q1 (25th Percentile)": format_result(q1),
            "Q2 (50th Percentile)": format_result(q2),
            "Q3 (75th Percentile)": format_result(q3),
            "Interquartile Range (IQR)": format_result(iqr),
            "10th Percentile": format_result(p10),
            "90th Percentile": format_result(p90),
        }

        if self.db:
            desc = f"N={n}, Mean={format_result(mean_val)}, StdDev={format_result(std_dev_sample)}"
            self.db.log_calculation("statistics", f"Dataset of {n} items", desc)

        return {
            "success": True,
            "raw_data": data,
            "sorted_data": sorted_data,
            "metrics": summary,
            "values": {
                "n": n,
                "mean": mean_val,
                "median": median_val,
                "std_sample": std_dev_sample,
                "std_pop": std_dev_pop,
                "min": min_val,
                "max": max_val,
                "q1": q1,
                "q2": q2,
                "q3": q3,
                "iqr": iqr,
            },
        }
