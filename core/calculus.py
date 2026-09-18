"""
MathLab Calculus Laboratory Engine
Symbolic and numerical differentiation, definite/indefinite integration, and limits.
Developed by: Ramji (Mathematical Computation)
"""

from typing import Dict, Any, Optional
from utils.helpers import format_result, preprocess_expression

try:
    import sympy
    from sympy import symbols, diff, integrate, limit, sympify, oo, S
    SYMPY_AVAILABLE = True
except ImportError:
    SYMPY_AVAILABLE = False


class CalculusEngine:
    """Performs symbolic calculus operations using SymPy."""

    def __init__(self, db_manager: Optional[Any] = None):
        self.db = db_manager

    def differentiate(self, expression_str: str, variable: str = "x", order: int = 1) -> Dict[str, Any]:
        """
        Differentiate f(x) with respect to variable for n-th order derivative.
        """
        if not SYMPY_AVAILABLE:
            return {"success": False, "error": "SymPy is required for calculus operations."}

        try:
            var = symbols(variable)
            prepared = preprocess_expression(expression_str)
            f = sympify(prepared)
            f_prime = diff(f, var, order)

            # Simplify result
            f_prime_simp = sympy.simplify(f_prime)
            res_str = str(f_prime_simp)

            label = "f'(x)" if order == 1 else f"f^({order})({variable})"

            if self.db:
                self.db.log_calculation("calculus", f"d/d{variable} [{expression_str}]", res_str)

            return {
                "success": True,
                "expression": expression_str,
                "variable": variable,
                "order": order,
                "derivative": res_str,
                "latex": sympy.latex(f_prime_simp),
                "display": f"{label} = {res_str}",
            }
        except Exception as e:
            return {"success": False, "error": f"Differentiation failed: {str(e)}"}

    def integrate_indefinite(self, expression_str: str, variable: str = "x") -> Dict[str, Any]:
        """
        Compute indefinite integral ∫ f(x) dx + C.
        """
        if not SYMPY_AVAILABLE:
            return {"success": False, "error": "SymPy is required for calculus operations."}

        try:
            var = symbols(variable)
            prepared = preprocess_expression(expression_str)
            f = sympify(prepared)
            integral_val = integrate(f, var)
            res_str = f"{str(sympy.simplify(integral_val))} + C"

            if self.db:
                self.db.log_calculation("calculus", f"∫ ({expression_str}) d{variable}", res_str)

            return {
                "success": True,
                "expression": expression_str,
                "variable": variable,
                "integral": res_str,
                "latex": sympy.latex(integral_val) + " + C",
                "display": f"∫ f({variable}) d{variable} = {res_str}",
            }
        except Exception as e:
            return {"success": False, "error": f"Integration failed: {str(e)}"}

    def integrate_definite(self, expression_str: str, lower_limit: str, upper_limit: str, variable: str = "x") -> Dict[str, Any]:
        """
        Compute definite integral ∫_a^b f(x) dx.
        """
        if not SYMPY_AVAILABLE:
            return {"success": False, "error": "SymPy is required for calculus operations."}

        try:
            var = symbols(variable)
            prepared = preprocess_expression(expression_str)
            f = sympify(prepared)

            # Parse limits (supporting oo, -oo, pi, fractions)
            a = sympify(preprocess_expression(lower_limit))
            b = sympify(preprocess_expression(upper_limit))

            val = integrate(f, (var, a, b))
            exact_str = str(val)

            numeric_val = None
            if hasattr(val, "evalf") and val.is_number:
                numeric_val = float(val.evalf())
                disp = f"{exact_str} ≈ {format_result(numeric_val)}"
            else:
                disp = exact_str

            if self.db:
                self.db.log_calculation("calculus", f"∫[{lower_limit} to {upper_limit}] ({expression_str})", disp)

            return {
                "success": True,
                "expression": expression_str,
                "lower": lower_limit,
                "upper": upper_limit,
                "exact": exact_str,
                "numeric": numeric_val,
                "display": f"∫ = {disp}",
            }
        except Exception as e:
            return {"success": False, "error": f"Definite integration failed: {str(e)}"}

    def compute_limit(self, expression_str: str, target: str, direction: str = "+-", variable: str = "x") -> Dict[str, Any]:
        """
        Calculate limit of f(x) as x approaches target.
        Direction: '+-', '+', or '-'.
        """
        if not SYMPY_AVAILABLE:
            return {"success": False, "error": "SymPy is required for calculus operations."}

        try:
            var = symbols(variable)
            prepared = preprocess_expression(expression_str)
            f = sympify(prepared)
            target_pt = sympify(preprocess_expression(target))

            if direction == "+":
                lim_res = limit(f, var, target_pt, "+")
                dir_label = "from right (x → a⁺)"
            elif direction == "-":
                lim_res = limit(f, var, target_pt, "-")
                dir_label = "from left (x → a⁻)"
            else:
                lim_res = limit(f, var, target_pt)
                dir_label = "(two-sided)"

            res_str = str(lim_res)

            if self.db:
                self.db.log_calculation("calculus", f"lim({variable}->{target}) [{expression_str}]", res_str)

            return {
                "success": True,
                "expression": expression_str,
                "target": target,
                "direction": dir_label,
                "limit": res_str,
                "display": f"lim ({variable} → {target}) = {res_str}",
            }
        except Exception as e:
            return {"success": False, "error": f"Limit computation failed: {str(e)}"}
