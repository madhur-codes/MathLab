"""
MathLab Matrix Laboratory Engine
Comprehensive linear algebra operations: addition, multiplication, inverse, determinant, eigenvalues.
Supports NumPy acceleration with pure Python fallback for dependency resilience.
Developed by: Shiva (Mathematical Computation) & Ramji (Visualization)
"""

from typing import List, Dict, Any, Optional, Tuple
from utils.helpers import format_result

try:
    import numpy as np
    NUMPY_AVAILABLE = True
except ImportError:
    NUMPY_AVAILABLE = False


class MatrixEngine:
    """Performs linear algebra operations with mathematical verification and error handling."""

    def __init__(self, db_manager: Optional[Any] = None):
        self.db = db_manager

    def add(self, a: List[List[float]], b: List[List[float]]) -> Dict[str, Any]:
        """Add two matrices A + B."""
        if len(a) != len(b) or len(a[0]) != len(b[0]):
            return {
                "success": False,
                "error": f"Dimension mismatch: Matrix A is {len(a)}x{len(a[0])}, while Matrix B is {len(b)}x{len(b[0])}. Addition requires identical dimensions.",
            }

        if NUMPY_AVAILABLE:
            res = (np.array(a, dtype=float) + np.array(b, dtype=float)).tolist()
        else:
            res = [[a[i][j] + b[i][j] for j in range(len(a[0]))] for i in range(len(a))]

        if self.db:
            self.db.log_calculation("matrices", f"Addition {len(a)}x{len(a[0])}", "Success")
        return {"success": True, "result": res, "rows": len(res), "cols": len(res[0])}

    def subtract(self, a: List[List[float]], b: List[List[float]]) -> Dict[str, Any]:
        """Subtract two matrices A - B."""
        if len(a) != len(b) or len(a[0]) != len(b[0]):
            return {
                "success": False,
                "error": f"Dimension mismatch: Matrix A is {len(a)}x{len(a[0])}, Matrix B is {len(b)}x{len(b[0])}.",
            }

        if NUMPY_AVAILABLE:
            res = (np.array(a, dtype=float) - np.array(b, dtype=float)).tolist()
        else:
            res = [[a[i][j] - b[i][j] for j in range(len(a[0]))] for i in range(len(a))]

        if self.db:
            self.db.log_calculation("matrices", f"Subtraction {len(a)}x{len(a[0])}", "Success")
        return {"success": True, "result": res, "rows": len(res), "cols": len(res[0])}

    def multiply(self, a: List[List[float]], b: List[List[float]]) -> Dict[str, Any]:
        """Matrix multiplication A × B."""
        rows_a, cols_a = len(a), len(a[0])
        rows_b, cols_b = len(b), len(b[0])
        if cols_a != rows_b:
            return {
                "success": False,
                "error": f"Incompatible matrix product: Matrix A has {cols_a} columns, but Matrix B has {rows_b} rows. Inner dimensions must match (A: m×k, B: k×n).",
            }

        if NUMPY_AVAILABLE:
            res = np.matmul(np.array(a, dtype=float), np.array(b, dtype=float)).tolist()
        else:
            res = [[sum(a[i][k] * b[k][j] for k in range(cols_a)) for j in range(cols_b)] for i in range(rows_a)]

        if self.db:
            self.db.log_calculation("matrices", f"Multiplication ({rows_a}x{cols_a}) * ({rows_b}x{cols_b})", "Success")
        return {"success": True, "result": res, "rows": len(res), "cols": len(res[0])}

    def scalar_multiply(self, a: List[List[float]], scalar: float) -> Dict[str, Any]:
        """Multiply matrix A by scalar k."""
        if NUMPY_AVAILABLE:
            res = (np.array(a, dtype=float) * scalar).tolist()
        else:
            res = [[val * scalar for val in row] for row in a]

        if self.db:
            self.db.log_calculation("matrices", f"Scalar Mult ({scalar}) * Matrix", "Success")
        return {"success": True, "result": res, "rows": len(res), "cols": len(res[0])}

    def transpose(self, a: List[List[float]]) -> Dict[str, Any]:
        """Matrix transpose A^T."""
        res = [[a[j][i] for j in range(len(a))] for i in range(len(a[0]))]
        return {"success": True, "result": res, "rows": len(res), "cols": len(res[0])}

    def _pure_det(self, mat: List[List[float]]) -> float:
        """Recursive cofactor expansion for arbitrary square matrix."""
        n = len(mat)
        if n == 1:
            return mat[0][0]
        if n == 2:
            return mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0]
        det = 0.0
        for col in range(n):
            sub = [row[:col] + row[col+1:] for row in mat[1:]]
            sign = 1 if col % 2 == 0 else -1
            det += sign * mat[0][col] * self._pure_det(sub)
        return det

    def determinant(self, a: List[List[float]]) -> Dict[str, Any]:
        """Calculate determinant det(A). Requires square matrix."""
        rows, cols = len(a), len(a[0])
        if rows != cols:
            return {
                "success": False,
                "error": f"Determinant is only defined for square matrices. Given matrix is {rows}x{cols}.",
            }

        if NUMPY_AVAILABLE:
            det_val = float(np.linalg.det(np.array(a, dtype=float)))
        else:
            det_val = float(self._pure_det(a))

        if abs(det_val) < 1e-12:
            det_val = 0.0

        if self.db:
            self.db.log_calculation("matrices", f"det({rows}x{cols})", format_result(det_val))
        return {"success": True, "determinant": det_val, "display": format_result(det_val)}

    def inverse(self, a: List[List[float]]) -> Dict[str, Any]:
        """Calculate matrix inverse A^(-1). Requires non-singular square matrix."""
        rows, cols = len(a), len(a[0])
        if rows != cols:
            return {
                "success": False,
                "error": f"Matrix inverse is only defined for square matrices (n×n). Given matrix is {rows}x{cols}.",
            }

        det_res = self.determinant(a)
        if not det_res["success"]:
            return det_res

        det_val = det_res["determinant"]
        if abs(det_val) < 1e-12:
            return {
                "success": False,
                "error": "Matrix is singular (determinant = 0). The inverse does not exist.",
            }

        if NUMPY_AVAILABLE:
            try:
                res = np.linalg.inv(np.array(a, dtype=float)).tolist()
            except Exception as e:
                return {"success": False, "error": str(e)}
        else:
            # 2x2 formula or Gauss-Jordan
            if rows == 2:
                res = [
                    [a[1][1] / det_val, -a[0][1] / det_val],
                    [-a[1][0] / det_val, a[0][0] / det_val],
                ]
            else:
                # Gauss-Jordan inversion
                n = rows
                augmented = [a[i][:] + [1.0 if i == j else 0.0 for j in range(n)] for i in range(n)]
                for i in range(n):
                    # Pivot
                    max_row = max(range(i, n), key=lambda r: abs(augmented[r][i]))
                    augmented[i], augmented[max_row] = augmented[max_row], augmented[i]
                    pivot = augmented[i][i]
                    if abs(pivot) < 1e-12:
                        return {"success": False, "error": "Matrix is singular; cannot invert."}
                    for j in range(2 * n):
                        augmented[i][j] /= pivot
                    for r in range(n):
                        if r != i:
                            factor = augmented[r][i]
                            for j in range(2 * n):
                                augmented[r][j] -= factor * augmented[i][j]
                res = [row[n:] for row in augmented]

        if self.db:
            self.db.log_calculation("matrices", f"inv({rows}x{cols})", "Inverted")

        return {
            "success": True,
            "result": res,
            "determinant": det_val,
            "rows": rows,
            "cols": cols,
        }

    def rank(self, a: List[List[float]]) -> Dict[str, Any]:
        """Calculate matrix rank."""
        if NUMPY_AVAILABLE:
            r = int(np.linalg.matrix_rank(np.array(a, dtype=float)))
            return {"success": True, "rank": r}
        # Fallback rank via Gaussian elimination
        matrix = [row[:] for row in a]
        rows, cols = len(matrix), len(matrix[0])
        r = 0
        for col in range(cols):
            pivot_row = None
            for row in range(r, rows):
                if abs(matrix[row][col]) > 1e-12:
                    pivot_row = row
                    break
            if pivot_row is None:
                continue
            matrix[r], matrix[pivot_row] = matrix[pivot_row], matrix[r]
            for row in range(r + 1, rows):
                factor = matrix[row][col] / matrix[r][col]
                for c in range(col, cols):
                    matrix[row][c] -= factor * matrix[r][c]
            r += 1
            if r == rows:
                break
        return {"success": True, "rank": r}

    def trace(self, a: List[List[float]]) -> Dict[str, Any]:
        """Calculate trace tr(A) = sum of diagonal elements."""
        rows, cols = len(a), len(a[0])
        if rows != cols:
            return {"success": False, "error": "Trace is only defined for square matrices."}
        tr = sum(a[i][i] for i in range(rows))
        return {"success": True, "trace": tr, "display": format_result(tr)}

    def eigen(self, a: List[List[float]]) -> Dict[str, Any]:
        """Compute eigenvalues and eigenvectors for square matrix."""
        rows, cols = len(a), len(a[0])
        if rows != cols:
            return {"success": False, "error": "Eigenvalues/eigenvectors are only defined for square matrices."}
        if not NUMPY_AVAILABLE:
            return {"success": False, "error": "NumPy is required for eigenvalue & eigenvector spectral decomposition."}

        try:
            arr_a = np.array(a, dtype=float)
            eigenvalues, eigenvectors = np.linalg.eig(arr_a)

            formatted_vals = []
            for ev in eigenvalues:
                if np.iscomplex(ev):
                    formatted_vals.append(format_result(complex(ev)))
                else:
                    formatted_vals.append(format_result(float(ev.real)))

            vectors_list = eigenvectors.tolist()
            return {
                "success": True,
                "eigenvalues": formatted_vals,
                "eigenvectors": vectors_list,
            }
        except Exception as e:
            return {"success": False, "error": f"Eigen computation failed: {str(e)}"}
