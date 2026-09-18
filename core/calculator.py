"""
MathLab Scientific Calculator Engine
Safe mathematical parser supporting arithmetic, trigonometry, logarithms, power, and constants.
Developed by: Shiva (Mathematical Computation)
"""

import math
from typing import Dict, Any, Tuple, Optional
from utils.validators import validate_expression
from utils.helpers import format_result, preprocess_expression

# Attempt SymPy import for symbolic precision
try:
    import sympy
    from sympy import sympify, pi as sympy_pi, E as sympy_E, factorial as sympy_factorial
    SYMPY_AVAILABLE = True
except ImportError:
    SYMPY_AVAILABLE = False


class ScientificCalculator:
    """Evaluates mathematical expressions safely without unrestricted eval()."""

    SAFE_MATH_ENV: Dict[str, Any] = {
        "sin": math.sin,
        "cos": math.cos,
        "tan": math.tan,
        "asin": math.asin,
        "acos": math.acos,
        "atan": math.atan,
        "sinh": math.sinh,
        "cosh": math.cosh,
        "tanh": math.tanh,
        "sqrt": math.sqrt,
        "log": math.log,
        "log10": math.log10,
        "ln": math.log,
        "exp": math.exp,
        "factorial": math.factorial,
        "abs": abs,
        "fabs": math.fabs,
        "pi": math.pi,
        "e": math.e,
        "pow": pow,
    }

    def __init__(self, db_manager: Optional[Any] = None):
        self.db = db_manager

    def evaluate(self, expression: str) -> Tuple[bool, str, Optional[float]]:
        """
        Safely evaluate a mathematical expression.
        Returns: (success: bool, formatted_result_or_error: str, numeric_val: Optional[float])
        """
        is_valid, err = validate_expression(expression)
        if not is_valid:
            return False, err or "Invalid input.", None

        prepared = preprocess_expression(expression)

        # 1. Try SymPy if available for exact and high-precision evaluation
        if SYMPY_AVAILABLE:
            try:
                # Custom locals dictionary mapping math functions
                local_dict = {
                    "sin": sympy.sin,
                    "cos": sympy.cos,
                    "tan": sympy.tan,
                    "asin": sympy.asin,
                    "acos": sympy.acos,
                    "atan": sympy.atan,
                    "sinh": sympy.sinh,
                    "cosh": sympy.cosh,
                    "tanh": sympy.tanh,
                    "sqrt": sympy.sqrt,
                    "log": sympy.log,
                    "log10": lambda x: sympy.log(x, 10),
                    "ln": sympy.log,
                    "exp": sympy.exp,
                    "factorial": sympy_factorial,
                    "abs": sympy.Abs,
                    "pi": sympy_pi,
                    "e": sympy_E,
                    "E": sympy_E,
                }
                parsed = sympify(prepared, locals=local_dict)
                exact_str = str(parsed)
                eval_val = float(parsed.evalf())

                # If the exact value is a clean integer or simple fraction, represent nicely
                if parsed.is_integer:
                    disp_str = str(int(eval_val))
                elif parsed.is_rational:
                    disp_str = f"{exact_str} ≈ {format_result(eval_val)}"
                else:
                    disp_str = format_result(eval_val)

                if self.db:
                    self.db.log_calculation("calculator", expression, disp_str)

                return True, disp_str, eval_val
            except Exception as sympy_err:
                # Fallback to safe standard math parser
                pass

        # 2. Fallback to restricted environment evaluation
        try:
            # Only allow mathematical builtins
            result = eval(prepared, {"__builtins__": None}, self.SAFE_MATH_ENV)
            disp_str = format_result(result)
            num_val = float(result) if isinstance(result, (int, float)) else None

            if self.db:
                self.db.log_calculation("calculator", expression, disp_str)

            return True, disp_str, num_val
        except ZeroDivisionError:
            return False, "Error: Division by zero is undefined.", None
        except ValueError as val_err:
            return False, f"Domain/Value Error: {str(val_err)}", None
        except OverflowError:
            return False, "Error: Numerical result exceeds mathematical bounds (Overflow).", None
        except Exception as e:
            return False, f"Syntax or evaluation error: {str(e)}", None
