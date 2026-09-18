"""
MathLab Equation Solver Engine
Solves linear, quadratic, simultaneous, and polynomial equations with step-by-step explanations.
Developed by: Ramji (Mathematical Computation)
"""

import re
import math
from typing import Dict, Any, List, Optional
from utils.helpers import format_result, preprocess_expression

try:
    import sympy
    from sympy import symbols, Eq, solve, sympify, solve_poly_system
    SYMPY_AVAILABLE = True
except ImportError:
    SYMPY_AVAILABLE = False


class EquationSolver:
    """Solves algebraic and polynomial equations with mathematical rigor."""

    def __init__(self, db_manager: Optional[Any] = None):
        self.db = db_manager

    def solve_linear(self, equation_str: str) -> Dict[str, Any]:
        """
        Solve a linear equation in one variable, e.g. '2x + 5 = 15' or '3*x - 4 = 2*x + 6'.
        """
        if "=" not in equation_str:
            return {"success": False, "error": "Equation must contain an equals sign '='."}

        lhs_str, rhs_str = equation_str.split("=", 1)
        lhs_prep = preprocess_expression(lhs_str)
        rhs_prep = preprocess_expression(rhs_str)

        if SYMPY_AVAILABLE:
            try:
                x = symbols("x")
                lhs = sympify(lhs_prep)
                rhs = sympify(rhs_prep)
                eq = Eq(lhs, rhs)
                solutions = solve(eq, x)

                if not solutions:
                    return {
                        "success": True,
                        "equation": equation_str,
                        "solution_text": "No solution exists (inconsistent equation).",
                        "steps": [
                            f"Original Equation: {equation_str}",
                            f"Simplified Form: {lhs - rhs} = 0",
                            "Result: Contradiction / No solution.",
                        ],
                    }

                sol_val = solutions[0]
                sol_str = str(sol_val)
                numeric_val = float(sol_val.evalf()) if hasattr(sol_val, "evalf") else None

                steps = [
                    f"Given Equation: {lhs_str.strip()} = {rhs_str.strip()}",
                    f"Rearrange terms to isolate x: ({lhs_prep}) - ({rhs_prep}) = 0",
                    f"Grouped expression: {sympy.simplify(lhs - rhs)} = 0",
                    f"Solution: x = {sol_str} (approx {format_result(numeric_val)})",
                ]

                if self.db:
                    self.db.log_calculation("equations", equation_str, f"x = {sol_str}")

                return {
                    "success": True,
                    "equation": equation_str,
                    "variable": "x",
                    "solution": sol_str,
                    "numeric_solution": numeric_val,
                    "steps": steps,
                }
            except Exception as e:
                return {"success": False, "error": f"Linear solver failed: {str(e)}"}

        return {"success": False, "error": "SymPy is required for symbolic equation solving."}

    def solve_quadratic(self, a: float, b: float, c: float) -> Dict[str, Any]:
        """
        Solve quadratic equation ax² + bx + c = 0 with full discriminant analysis.
        """
        if a == 0:
            if b == 0:
                return {"success": False, "error": "Degenerate equation: 'a' and 'b' cannot both be zero."}
            # Fallback to linear
            root = -c / b
            return {
                "success": True,
                "type": "Linear (a=0)",
                "discriminant": 0,
                "roots": [root],
                "roots_display": f"x = {format_result(root)}",
                "steps": [f"Since a = 0, equation is linear: {b}x + {c} = 0", f"x = -{c} / {b} = {format_result(root)}"],
            }

        discriminant = (b ** 2) - (4 * a * c)
        eq_repr = f"{a}x² {'+' if b >= 0 else '-'} {abs(b)}x {'+' if c >= 0 else '-'} {abs(c)} = 0"

        steps = [
            f"Quadratic Form: a = {a}, b = {b}, c = {c}",
            f"Discriminant Formula: Δ = b² - 4ac",
            f"Δ = ({b})² - 4*({a})*({c}) = {format_result(discriminant)}",
        ]

        if discriminant > 0:
            root_type = "Real and Distinct"
            sqrt_d = math.sqrt(discriminant)
            r1 = (-b + sqrt_d) / (2 * a)
            r2 = (-b - sqrt_d) / (2 * a)
            roots_display = f"x₁ = {format_result(r1)},  x₂ = {format_result(r2)}"
            steps.append(f"Since Δ > 0, there are two distinct real roots:")
            steps.append(f"x = (-({b}) ± √{format_result(discriminant)}) / (2*{a})")
            steps.append(f"x₁ = {format_result(r1)}, x₂ = {format_result(r2)}")
            roots = [r1, r2]
        elif discriminant == 0:
            root_type = "Real and Equal (Repeated Root)"
            r = -b / (2 * a)
            roots_display = f"x₁ = x₂ = {format_result(r)}"
            steps.append("Since Δ = 0, there is exactly one repeated real root:")
            steps.append(f"x = -b / (2a) = -({b}) / (2*{a}) = {format_result(r)}")
            roots = [r, r]
        else:
            root_type = "Complex Conjugates"
            real_part = -b / (2 * a)
            imag_part = math.sqrt(abs(discriminant)) / (2 * a)
            roots_display = (
                f"x₁ = {format_result(real_part)} + {format_result(abs(imag_part))}i,  "
                f"x₂ = {format_result(real_part)} - {format_result(abs(imag_part))}i"
            )
            steps.append("Since Δ < 0, there are two complex conjugate roots:")
            steps.append(f"Real Part = -b / (2a) = {format_result(real_part)}")
            steps.append(f"Imaginary Part = √|Δ| / (2a) = {format_result(abs(imag_part))}i")
            roots = [complex(real_part, imag_part), complex(real_part, -imag_part)]

        if self.db:
            self.db.log_calculation("equations", eq_repr, roots_display)

        return {
            "success": True,
            "equation": eq_repr,
            "a": a,
            "b": b,
            "c": c,
            "discriminant": discriminant,
            "root_type": root_type,
            "roots": roots,
            "roots_display": roots_display,
            "steps": steps,
        }

    def solve_simultaneous(self, eq1_str: str, eq2_str: str) -> Dict[str, Any]:
        """
        Solve a 2x2 system of simultaneous linear equations, e.g.:
        2x + y = 7
        x - y = 1
        """
        if "=" not in eq1_str or "=" not in eq2_str:
            return {"success": False, "error": "Both equations must contain an equals sign '='."}

        if not SYMPY_AVAILABLE:
            return {"success": False, "error": "SymPy is required for simultaneous equation solving."}

        try:
            x, y = symbols("x y")
            l1, r1 = eq1_str.split("=", 1)
            l2, r2 = eq2_str.split("=", 1)

            expr1 = Eq(sympify(preprocess_expression(l1)), sympify(preprocess_expression(r1)))
            expr2 = Eq(sympify(preprocess_expression(l2)), sympify(preprocess_expression(r2)))

            sol = solve((expr1, expr2), (x, y))

            if not sol:
                return {
                    "success": True,
                    "solution_text": "System has no solution (parallel / inconsistent lines).",
                    "steps": ["Equations analyzed: No point of intersection."],
                }

            # sol is typically a dict {x: val, y: val}
            if isinstance(sol, dict):
                x_val = sol[x]
                y_val = sol[y]
            elif isinstance(sol, list) and len(sol) > 0:
                x_val, y_val = sol[0]
            else:
                x_val, y_val = sol, sol

            x_num = float(x_val.evalf()) if hasattr(x_val, "evalf") else x_val
            y_num = float(y_val.evalf()) if hasattr(y_val, "evalf") else y_val

            result_str = f"x = {format_result(x_num)}, y = {format_result(y_num)}"
            steps = [
                f"Equation 1: {eq1_str.strip()}",
                f"Equation 2: {eq2_str.strip()}",
                "Applying Algebraic Elimination / Substitution method...",
                f"Isolated x = {str(x_val)} ≈ {format_result(x_num)}",
                f"Substituted into equation for y = {str(y_val)} ≈ {format_result(y_num)}",
                f"Point of Intersection: ({format_result(x_num)}, {format_result(y_num)})",
            ]

            if self.db:
                self.db.log_calculation("equations", f"{eq1_str} & {eq2_str}", result_str)

            return {
                "success": True,
                "x": x_num,
                "y": y_num,
                "x_symbolic": str(x_val),
                "y_symbolic": str(y_val),
                "result_display": result_str,
                "steps": steps,
            }
        except Exception as e:
            return {"success": False, "error": f"Failed to solve simultaneous system: {str(e)}"}

    def solve_polynomial(self, expression_str: str) -> Dict[str, Any]:
        """
        Solve any polynomial equation, e.g. 'x^3 - 6*x^2 + 11*x - 6 = 0'.
        """
        if not SYMPY_AVAILABLE:
            return {"success": False, "error": "SymPy is required for polynomial solving."}

        try:
            if "=" in expression_str:
                lhs_str, rhs_str = expression_str.split("=", 1)
                expr = sympify(preprocess_expression(lhs_str)) - sympify(preprocess_expression(rhs_str))
            else:
                expr = sympify(preprocess_expression(expression_str))

            x = symbols("x")
            roots = solve(expr, x)

            formatted_roots = []
            for r in roots:
                val = r.evalf()
                formatted_roots.append(str(r) if not val.is_number else f"{r} (≈ {format_result(complex(val))})")

            disp = ", ".join(str(r) for r in roots)

            if self.db:
                self.db.log_calculation("equations", expression_str, disp)

            return {
                "success": True,
                "expression": expression_str,
                "degree": sympy.degree(expr, x) if hasattr(expr, "as_poly") else "Unknown",
                "roots": [str(r) for r in roots],
                "formatted_roots": formatted_roots,
                "display": disp,
            }
        except Exception as e:
            return {"success": False, "error": f"Polynomial solver error: {str(e)}"}
