"""
MathLab Input Validators
Validates user input before mathematical parsing to safeguard application stability.
Developed by: Madhur & Shiva
"""

import re
from typing import List, Tuple, Optional


def validate_expression(expr: str) -> Tuple[bool, Optional[str]]:
    """
    Check if a mathematical expression string is non-empty and contains safe characters.
    Disallows dangerous Python constructs (exec, eval, import, __, system calls).
    """
    if not expr or not expr.strip():
        return False, "Input expression cannot be empty."

    cleaned = expr.strip()

    # Block malicious keywords or dunder attributes
    banned = ["import", "exec", "eval", "__", "os.", "sys.", "open", "subprocess", "compile"]
    for word in banned:
        if word in cleaned.lower():
            return False, f"Invalid token or disallowed expression syntax: '{word}'"

    # Parenthesis matching check
    stack = 0
    for char in cleaned:
        if char == "(":
            stack += 1
        elif char == ")":
            stack -= 1
            if stack < 0:
                return False, "Unmatched closing parenthesis ')' detected."
    if stack != 0:
        return False, "Unmatched opening parenthesis '(' detected."

    return True, None


def validate_matrix_text(text: str) -> Tuple[bool, Optional[str], List[List[float]]]:
    """
    Parse a multiline matrix input string.
    Rows separated by newlines or semicolons, numbers separated by spaces or commas.
    Example:
    1 2
    3 4
    Returns (is_valid, error_message, matrix_data)
    """
    if not text or not text.strip():
        return False, "Matrix input cannot be empty.", []

    rows_raw = [r.strip() for r in re.split(r"[\n;]+", text.strip()) if r.strip()]
    if not rows_raw:
        return False, "No valid rows detected in matrix input.", []

    matrix: List[List[float]] = []
    expected_cols = -1

    for row_idx, row_str in enumerate(rows_raw):
        # Tokens separated by whitespace or comma
        tokens = [t.strip() for t in re.split(r"[\s,]+", row_str) if t.strip()]
        if not tokens:
            continue

        row_vals: List[float] = []
        for col_idx, tok in enumerate(tokens):
            # Support simple fractions like 1/2 or decimals
            try:
                if "/" in tok:
                    parts = tok.split("/")
                    val = float(parts[0]) / float(parts[1])
                else:
                    val = float(tok)
                row_vals.append(val)
            except Exception:
                return False, f"Invalid number '{tok}' at row {row_idx + 1}, column {col_idx + 1}.", []

        if expected_cols == -1:
            expected_cols = len(row_vals)
        elif len(row_vals) != expected_cols:
            return False, (
                f"Row {row_idx + 1} has {len(row_vals)} elements, but previous rows had {expected_cols}. "
                "All rows must have the same number of columns."
            ), []

        matrix.append(row_vals)

    if not matrix:
        return False, "Matrix contains no valid numbers.", []

    return True, None, matrix


def validate_number_list(text: str) -> Tuple[bool, Optional[str], List[float]]:
    """
    Parse comma, space, or newline separated list of numbers for statistics.
    Example: 10, 12, 15, 18, 20
    """
    if not text or not text.strip():
        return False, "Data input is empty. Please enter numerical values.", []

    tokens = [t.strip() for t in re.split(r"[\s,;]+", text.strip()) if t.strip()]
    if not tokens:
        return False, "No numerical values found in input.", []

    numbers: List[float] = []
    for tok in tokens:
        try:
            numbers.append(float(tok))
        except ValueError:
            return False, f"Invalid numerical value: '{tok}'", []

    return True, None, numbers
