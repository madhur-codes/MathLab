"""
MathLab Matrix Laboratory View
Matrix algebra workspace: addition, multiplication, inverse, determinant, and spectral decomposition.
Developed by: Ramji (Computation) & Shiva (Visualization)
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
    FONT_TITLE, FONT_SUBHEADING, FONT_BODY, FONT_BODY_BOLD, FONT_MONO
)
from core.matrices import MatrixEngine
from utils.validators import validate_matrix_text


class MatrixView(ttk.Frame if TKINTER_AVAILABLE else object):
    """Interactive matrix linear algebra workspace."""

    def __init__(self, parent, app):
        if not TKINTER_AVAILABLE:
            return
        super().__init__(parent, style="TFrame")
        self.app = app
        self.engine = MatrixEngine(db_manager=app.db)
        self._build_ui()

    def _build_ui(self):
        header_frame = ttk.Frame(self, style="TFrame")
        header_frame.pack(fill="x", padx=24, pady=(20, 10))

        ttk.Label(header_frame, text="Matrix Laboratory", font=FONT_TITLE).pack(anchor="w")
        ttk.Label(
            header_frame,
            text="Perform fundamental and advanced linear algebra operations with real-time dimension validation.",
            font=FONT_SUBHEADING,
            foreground=COLOR_TEXT_SECONDARY,
        ).pack(anchor="w", pady=(4, 0))

        # Main layout: Left matrices inputs, Center operations buttons, Right results
        content = ttk.Frame(self, style="TFrame")
        content.pack(fill="both", expand=True, padx=24, pady=(0, 20))

        # Matrices Input Area (A and B)
        input_container = tk.Frame(content, bg=COLOR_BG)
        input_container.pack(side="left", fill="both", expand=True, padx=(0, 12))

        # Matrix A Card
        card_a = tk.Frame(input_container, bg=COLOR_CARD, highlightbackground=COLOR_BG_SECONDARY, highlightthickness=1)
        card_a.pack(fill="both", expand=True, pady=(0, 8))

        tk.Label(card_a, text="Matrix A (Rows separated by newlines, cols by spaces):", font=FONT_SUBHEADING, fg=COLOR_ACCENT, bg=COLOR_CARD).pack(anchor="w", padx=12, pady=(10, 4))
        self.txt_a = tk.Text(card_a, height=5, font=FONT_MONO, bg=COLOR_BG, fg=COLOR_TEXT_PRIMARY, insertbackground=COLOR_TEXT_PRIMARY, bd=0, padx=8, pady=8)
        self.txt_a.insert("1.0", "1  2\n3  4")
        self.txt_a.pack(fill="both", expand=True, padx=12, pady=(0, 10))

        # Matrix B Card
        card_b = tk.Frame(input_container, bg=COLOR_CARD, highlightbackground=COLOR_BG_SECONDARY, highlightthickness=1)
        card_b.pack(fill="both", expand=True, pady=(8, 0))

        tk.Label(card_b, text="Matrix B (Used for A+B, A-B, A×B):", font=FONT_SUBHEADING, fg=COLOR_SECONDARY_ACCENT, bg=COLOR_CARD).pack(anchor="w", padx=12, pady=(10, 4))
        self.txt_b = tk.Text(card_b, height=5, font=FONT_MONO, bg=COLOR_BG, fg=COLOR_TEXT_PRIMARY, insertbackground=COLOR_TEXT_PRIMARY, bd=0, padx=8, pady=8)
        self.txt_b.insert("1.0", "5  6\n7  8")
        self.txt_b.pack(fill="both", expand=True, padx=12, pady=(0, 10))

        # Operations Panel
        ops_panel = tk.Frame(content, bg=COLOR_CARD, highlightbackground=COLOR_BG_SECONDARY, highlightthickness=1, width=220)
        ops_panel.pack(side="left", fill="y", padx=6)
        ops_panel.pack_propagate(False)

        tk.Label(ops_panel, text="Binary Operations", font=FONT_SUBHEADING, fg=COLOR_ACCENT, bg=COLOR_CARD).pack(anchor="w", padx=12, pady=(12, 6))

        tk.Button(ops_panel, text="A + B (Addition)", font=FONT_BODY, bg=COLOR_BG_SECONDARY, fg=COLOR_TEXT_PRIMARY, bd=0, padx=8, pady=4, anchor="w", command=self.on_add).pack(fill="x", padx=12, pady=2)
        tk.Button(ops_panel, text="A - B (Subtraction)", font=FONT_BODY, bg=COLOR_BG_SECONDARY, fg=COLOR_TEXT_PRIMARY, bd=0, padx=8, pady=4, anchor="w", command=self.on_subtract).pack(fill="x", padx=12, pady=2)
        tk.Button(ops_panel, text="A × B (Multiplication)", font=FONT_BODY, bg=COLOR_BG_SECONDARY, fg=COLOR_TEXT_PRIMARY, bd=0, padx=8, pady=4, anchor="w", command=self.on_multiply).pack(fill="x", padx=12, pady=2)

        # Scalar multiplication
        scalar_row = tk.Frame(ops_panel, bg=COLOR_CARD)
        scalar_row.pack(fill="x", padx=12, pady=(6, 2))
        tk.Label(scalar_row, text="k =", fg=COLOR_TEXT_SECONDARY, bg=COLOR_CARD).pack(side="left")
        self.scalar_entry = tk.Entry(scalar_row, width=5, font=FONT_MONO, bg=COLOR_BG, fg=COLOR_TEXT_PRIMARY, bd=0)
        self.scalar_entry.insert(0, "2")
        self.scalar_entry.pack(side="left", padx=4)
        tk.Button(scalar_row, text="k × A", font=FONT_BODY, bg=COLOR_BG_SECONDARY, fg=COLOR_TEXT_PRIMARY, bd=0, padx=6, pady=2, command=self.on_scalar).pack(side="left", fill="x", expand=True)

        tk.Label(ops_panel, text="Unary (Matrix A)", font=FONT_SUBHEADING, fg=COLOR_SECONDARY_ACCENT, bg=COLOR_CARD).pack(anchor="w", padx=12, pady=(14, 6))

        unary_ops = [
            ("Transpose (Aᵀ)", self.on_transpose),
            ("Determinant det(A)", self.on_determinant),
            ("Inverse (A⁻¹)", self.on_inverse),
            ("Rank rank(A)", self.on_rank),
            ("Trace tr(A)", self.on_trace),
            ("Eigenvalues & Vectors", self.on_eigen),
        ]
        for name, cmd in unary_ops:
            tk.Button(ops_panel, text=name, font=FONT_BODY, bg=COLOR_BG_SECONDARY, fg=COLOR_TEXT_PRIMARY, bd=0, padx=8, pady=4, anchor="w", command=cmd).pack(fill="x", padx=12, pady=2)

        # Output Card
        res_card = tk.Frame(content, bg=COLOR_CARD, highlightbackground=COLOR_BG_SECONDARY, highlightthickness=1)
        res_card.pack(side="right", fill="both", expand=True, padx=(12, 0))

        tk.Label(res_card, text="Computed Matrix Output", font=FONT_SUBHEADING, fg=COLOR_TEXT_PRIMARY, bg=COLOR_CARD).pack(anchor="w", padx=14, pady=(12, 6))

        self.res_text = tk.Text(res_card, font=FONT_MONO, bg=COLOR_BG_SECONDARY, fg=COLOR_TEXT_PRIMARY, bd=0, padx=12, pady=12)
        self.res_text.pack(fill="both", expand=True, padx=14, pady=(0, 14))

    def _get_matrix(self, txt_widget, name: str):
        content = txt_widget.get("1.0", tk.END).strip()
        valid, err, mat = validate_matrix_text(content)
        if not valid:
            messagebox.showerror("Matrix Format Error", f"Error in Matrix {name}:\n{err}")
            return None
        return mat

    def _display_matrix(self, title: str, mat):
        self.res_text.delete("1.0", tk.END)
        self.res_text.insert(tk.END, f"=== {title.upper()} ===\n\n")
        if isinstance(mat, list) and isinstance(mat[0], list):
            for row in mat:
                formatted_row = [f"{val:8.4f}".rstrip("0").rstrip(".") if isinstance(val, (int, float)) else str(val) for val in row]
                self.res_text.insert(tk.END, "  [ " + "  ".join(formatted_row) + " ]\n")
            self.res_text.insert(tk.END, f"\nDimensions: {len(mat)} × {len(mat[0])}\n")
        else:
            self.res_text.insert(tk.END, f"{mat}\n")

    def on_add(self):
        a = self._get_matrix(self.txt_a, "A")
        b = self._get_matrix(self.txt_b, "B")
        if a is None or b is None:
            return
        res = self.engine.add(a, b)
        if res["success"]:
            self._display_matrix("Matrix Addition (A + B)", res["result"])
            self.app.set_status("Calculated A + B")
        else:
            messagebox.showerror("Matrix Error", res["error"])

    def on_subtract(self):
        a = self._get_matrix(self.txt_a, "A")
        b = self._get_matrix(self.txt_b, "B")
        if a is None or b is None:
            return
        res = self.engine.subtract(a, b)
        if res["success"]:
            self._display_matrix("Matrix Subtraction (A - B)", res["result"])
            self.app.set_status("Calculated A - B")
        else:
            messagebox.showerror("Matrix Error", res["error"])

    def on_multiply(self):
        a = self._get_matrix(self.txt_a, "A")
        b = self._get_matrix(self.txt_b, "B")
        if a is None or b is None:
            return
        res = self.engine.multiply(a, b)
        if res["success"]:
            self._display_matrix("Matrix Product (A × B)", res["result"])
            self.app.set_status("Calculated A × B")
        else:
            messagebox.showerror("Matrix Error", res["error"])

    def on_scalar(self):
        a = self._get_matrix(self.txt_a, "A")
        if a is None:
            return
        try:
            k = float(self.scalar_entry.get().strip())
        except ValueError:
            messagebox.showerror("Scalar Error", "Scalar 'k' must be a valid number.")
            return
        res = self.engine.scalar_multiply(a, k)
        if res["success"]:
            self._display_matrix(f"Scalar Multiplication ({k} × A)", res["result"])
            self.app.set_status(f"Multiplied matrix by {k}")
        else:
            messagebox.showerror("Matrix Error", res["error"])

    def on_transpose(self):
        a = self._get_matrix(self.txt_a, "A")
        if a is None:
            return
        res = self.engine.transpose(a)
        if res["success"]:
            self._display_matrix("Transpose (Aᵀ)", res["result"])
            self.app.set_status("Computed transpose Aᵀ")

    def on_determinant(self):
        a = self._get_matrix(self.txt_a, "A")
        if a is None:
            return
        res = self.engine.determinant(a)
        if res["success"]:
            self._display_matrix("Determinant det(A)", f"det(A) = {res['display']}")
            self.app.set_status(f"Computed det(A) = {res['display']}")
        else:
            messagebox.showerror("Matrix Error", res["error"])

    def on_inverse(self):
        a = self._get_matrix(self.txt_a, "A")
        if a is None:
            return
        res = self.engine.inverse(a)
        if res["success"]:
            self._display_matrix(f"Inverse (A⁻¹) [det={res['determinant']:.4f}]", res["result"])
            self.app.set_status("Inverted matrix A")
        else:
            messagebox.showerror("Matrix Error", res["error"])

    def on_rank(self):
        a = self._get_matrix(self.txt_a, "A")
        if a is None:
            return
        res = self.engine.rank(a)
        if res["success"]:
            self._display_matrix("Matrix Rank", f"rank(A) = {res['rank']}")
            self.app.set_status(f"rank(A) = {res['rank']}")

    def on_trace(self):
        a = self._get_matrix(self.txt_a, "A")
        if a is None:
            return
        res = self.engine.trace(a)
        if res["success"]:
            self._display_matrix("Matrix Trace", f"tr(A) = {res['display']}")
            self.app.set_status(f"tr(A) = {res['display']}")
        else:
            messagebox.showerror("Matrix Error", res["error"])

    def on_eigen(self):
        a = self._get_matrix(self.txt_a, "A")
        if a is None:
            return
        res = self.engine.eigen(a)
        if res["success"]:
            self.res_text.delete("1.0", tk.END)
            self.res_text.insert(tk.END, "=== EIGENVALUES & EIGENVECTORS ===\n\n")
            self.res_text.insert(tk.END, f"Eigenvalues (λ):\n")
            for i, val in enumerate(res["eigenvalues"], 1):
                self.res_text.insert(tk.END, f"  λ_{i} = {val}\n")
            self.res_text.insert(tk.END, f"\nEigenvectors Matrix (Columns):\n")
            for row in res["eigenvectors"]:
                self.res_text.insert(tk.END, f"  [ " + "  ".join(f"{v:8.4f}" for v in row) + " ]\n")
            self.app.set_status("Computed eigenvalues & eigenvectors")
        else:
            messagebox.showerror("Matrix Error", res["error"])
