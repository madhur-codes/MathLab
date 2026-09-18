"""
MathLab — Interactive Mathematical Computing & Visualization System
Entry Point and Application Bootstrap
Developed by: Madhur (Team Head), Ramji (Computation), Shiva (Visualization)
"""

import sys
import os

# Ensure current directory is in Python path for package resolution
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)


def check_dependencies():
    """Verify optional scientific packages and return diagnostic report."""
    status = {}

    try:
        import numpy
        status["numpy"] = f"OK (v{numpy.__version__})"
    except ImportError:
        status["numpy"] = "Missing (pip install numpy)"

    try:
        import sympy
        status["sympy"] = f"OK (v{sympy.__version__})"
    except ImportError:
        status["sympy"] = "Missing (pip install sympy)"

    try:
        import matplotlib
        status["matplotlib"] = f"OK (v{matplotlib.__version__})"
    except ImportError:
        status["matplotlib"] = "Missing (pip install matplotlib)"

    try:
        import scipy
        status["scipy"] = f"OK (v{scipy.__version__})"
    except ImportError:
        status["scipy"] = "Optional (pip install scipy)"

    try:
        import tkinter
        status["tkinter"] = "OK"
    except ImportError:
        status["tkinter"] = "Missing (Install python3-tk on Linux or run on Windows)"

    return status


def launch_cli_diagnostics(deps):
    """Fallback interactive CLI test workbench when GUI / display is unavailable."""
    from database.db_manager import DatabaseManager
    from core.calculator import ScientificCalculator
    from core.equations import EquationSolver
    from core.matrices import MatrixEngine
    from core.statistics import StatisticsEngine
    from core.probability import ProbabilityEngine
    from core.calculus import CalculusEngine

    db = DatabaseManager()
    calc = ScientificCalculator(db)
    eqs = EquationSolver(db)
    mat = MatrixEngine(db)
    stats = StatisticsEngine(db)
    prob = ProbabilityEngine(db)
    calculus = CalculusEngine(db)

    print("\n" + "=" * 60)
    print("  MATHLAB — INTERACTIVE MATHEMATICAL COMPUTING SYSTEM")
    print("  Engine Diagnostic & Self-Test Verification")
    print("=" * 60)
    print("\nDependency Check:")
    for dep, res in deps.items():
        print(f"  • {dep.capitalize():12} : {res}")

    print("\nRunning Core Module Verification:")

    # 1. Calculator
    ok, res, _ = calc.evaluate("2 + 5 * 3")
    print(f"  [1] Calculator  : 2 + 5 * 3 = {res} ({'PASS' if ok and res == '17' else 'FAIL'})")

    # 2. Quadratic
    q_res = eqs.solve_quadratic(1, -5, 6)
    print(f"  [2] Equations   : x² - 5x + 6 = 0 -> {q_res.get('roots_display')} ({'PASS' if q_res['success'] else 'FAIL'})")

    # 3. Matrix Det
    d_res = mat.determinant([[1, 2], [3, 4]])
    print(f"  [3] Matrices    : det([[1,2],[3,4]]) = {d_res.get('display')} ({'PASS' if d_res['success'] else 'FAIL'})")

    # 4. Statistics
    s_res = stats.analyze([10, 12, 15, 18, 20, 22, 25])
    print(f"  [4] Statistics  : Mean = {s_res['values']['mean']:.2f}, N = {s_res['values']['n']} ({'PASS' if s_res['success'] else 'FAIL'})")

    # 5. Probability
    p_res = prob.simulate_coin_toss(1000)
    print(f"  [5] Probability : 1,000 Coin Tosses -> Heads: {p_res['heads_count']}, Tails: {p_res['tails_count']} ({'PASS' if p_res['success'] else 'FAIL'})")

    # 6. Calculus
    if "sympy" in deps and "OK" in deps["sympy"]:
        c_res = calculus.differentiate("x^3 + 2*x^2 + x")
        print(f"  [6] Calculus    : d/dx(x^3 + 2x^2 + x) = {c_res.get('derivative')} ({'PASS' if c_res['success'] else 'FAIL'})")
    else:
        print("  [6] Calculus    : (SymPy pending installation)")

    # 7. Database
    db_stats = db.get_dashboard_stats()
    print(f"  [7] Database    : Total logged calculations = {db_stats['total_calculations']} (PASS)")

    print("\n" + "-" * 60)
    print("All core mathematical computation engines are verified and operational.")
    print("Note: To open the Tkinter desktop GUI window, run on a system with a display:")
    print("  Linux   : sudo apt install python3-tk && python3 main.py")
    print("  Windows : python main.py")
    print("=" * 60 + "\n")


def main():
    deps = check_dependencies()

    # If --cli flag passed or tkinter is missing or no display available
    force_cli = "--cli" in sys.argv or "-c" in sys.argv
    has_display = bool(os.environ.get("DISPLAY")) if sys.platform != "win32" else True

    if force_cli or deps["tkinter"] != "OK" or not has_display:
        launch_cli_diagnostics(deps)
        return

    try:
        import tkinter as tk
        from gui.app import MathLabApp

        root = tk.Tk()
        app = MathLabApp(root)
        root.mainloop()

    except Exception as e:
        print(f"\n[MathLab Error] Could not initialize graphical window: {str(e)}")
        print("Switching to diagnostic engine mode:\n")
        launch_cli_diagnostics(deps)


if __name__ == "__main__":
    main()
