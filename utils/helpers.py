"""
MathLab Helper Functions
Formatting, mathematical text preprocessing, and display conversions.
Developed by: Madhur, Shiva & Ramji
"""

import math
from typing import Any, Optional


def format_result(val: Any, precision: int = 6) -> str:
    """Format mathematical result for presentation, rounding floats cleanly."""
    if val is None:
        return "None"

    if isinstance(val, (int, bool)):
        return str(val)

    if isinstance(val, float):
        if math.isnan(val):
            return "NaN (Undefined)"
        if math.isinf(val):
            return "+Infinity" if val > 0 else "-Infinity"
        # If it's an integer value, return without trailing .0
        if val.is_integer():
            return str(int(val))
        formatted = f"{val:.{precision}f}".rstrip("0").rstrip(".")
        return formatted

    # Handle complex numbers
    if isinstance(val, complex):
        real_part = format_result(val.real, precision)
        imag_part = format_result(abs(val.imag), precision)
        sign = "+" if val.imag >= 0 else "-"
        return f"{real_part} {sign} {imag_part}i"

    return str(val)


def safe_float_convert(val: Any) -> Optional[float]:
    """Safely convert any compatible value to float or return None."""
    try:
        return float(val)
    except (ValueError, TypeError):
        return None


def preprocess_expression(expr: str) -> str:
    """
    Standardize mathematical notation for SymPy / mathematical parser:
    - Replace ^ with **
    - Replace ln( with log(
    - Replace π with pi
    - Handle implicit multiplication like 2x -> 2*x, 5( -> 5*(
    - Support factorial symbol like 5! -> factorial(5)
    """
    import re

    cleaned = expr.replace("^", "**").replace("×", "*").replace("÷", "/")
    cleaned = cleaned.replace("π", "pi")

    # Replace 5! with factorial(5) or (x+1)! with factorial(x+1)
    # Simple regex for number followed by !
    cleaned = re.sub(r"(\b\d+\b)!", r"factorial(\1)", cleaned)
    cleaned = re.sub(r"\(([^()]+)\)!", r"factorial(\1)", cleaned)

    # Convert log10(x) to (log(x)/log(10)) or log(x, 10)
    # Convert ln(x) to log(x)
    cleaned = re.sub(r"\bln\b", "log", cleaned)

    # Implicit multiplication: digit followed by variable or open paren
    cleaned = re.sub(r"(\d+)([a-zA-Z(])", r"\1*\2", cleaned)
    # Closing paren followed by opening paren or digit or variable
    cleaned = re.sub(r"\)([a-zA-Z0-9(])", r")*\1", cleaned)

    return cleaned
