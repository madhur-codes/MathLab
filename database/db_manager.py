"""
MathLab Database Manager
Handles SQLite persistent storage for calculation history, user activity, and module statistics.
Developed by: Madhur (Team Head)
"""

import os
import sqlite3
from datetime import datetime
from typing import List, Dict, Any, Optional


class DatabaseManager:
    """Manages SQLite database operations with parameterized queries and auto-initialization."""

    def __init__(self, db_path: Optional[str] = None):
        if db_path is None:
            # Default to mathlab.db in root project directory
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            self.db_path = os.path.join(base_dir, "mathlab.db")
        else:
            self.db_path = db_path
        
        self.init_db()

    def _get_connection(self) -> sqlite3.Connection:
        """Create and return a database connection with row factory."""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def init_db(self) -> None:
        """Initialize required tables and initial module counters if not present."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            
            # Calculations table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS calculations (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    module TEXT NOT NULL,
                    expression TEXT NOT NULL,
                    result TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)

            # Activity log table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS activity (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    module TEXT NOT NULL,
                    description TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)

            # Module statistics table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS statistics (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    module TEXT UNIQUE NOT NULL,
                    operation_count INTEGER DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)

            # Seed default module statistics if empty
            modules = [
                "calculator", "equations", "graphing", "matrices",
                "statistics", "probability", "calculus", "converter"
            ]
            for mod in modules:
                cursor.execute("""
                    INSERT OR IGNORE INTO statistics (module, operation_count)
                    VALUES (?, 0)
                """, (mod,))

            conn.commit()

    def log_calculation(self, module: str, expression: str, result: str) -> int:
        """Log a mathematical calculation and increment module counter."""
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO calculations (module, expression, result, created_at)
                VALUES (?, ?, ?, ?)
            """, (module, expression, result, now_str))
            calc_id = cursor.lastrowid

            # Also log to activity
            short_expr = expression[:40] + ("..." if len(expression) > 40 else "")
            desc = f"Computed '{short_expr}' -> {result[:30]}"
            cursor.execute("""
                INSERT INTO activity (module, description, created_at)
                VALUES (?, ?, ?)
            """, (module, desc, now_str))

            # Increment counter
            cursor.execute("""
                INSERT INTO statistics (module, operation_count, created_at)
                VALUES (?, 1, ?)
                ON CONFLICT(module) DO UPDATE SET operation_count = operation_count + 1
            """, (module, now_str))

            conn.commit()
            return calc_id or 0

    def log_activity(self, module: str, description: str) -> int:
        """Log a general module activity."""
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO activity (module, description, created_at)
                VALUES (?, ?, ?)
            """, (module, description, now_str))
            
            # Increment counter
            cursor.execute("""
                INSERT INTO statistics (module, operation_count, created_at)
                VALUES (?, 1, ?)
                ON CONFLICT(module) DO UPDATE SET operation_count = operation_count + 1
            """, (module, now_str))
            
            conn.commit()
            return cursor.lastrowid or 0

    def increment_module_stat(self, module: str) -> None:
        """Explicitly increment an operation count for a module."""
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO statistics (module, operation_count, created_at)
                VALUES (?, 1, ?)
                ON CONFLICT(module) DO UPDATE SET operation_count = operation_count + 1
            """, (module, now_str))
            conn.commit()

    def get_recent_calculations(self, limit: int = 15) -> List[Dict[str, Any]]:
        """Retrieve recent calculations."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT id, module, expression, result, created_at
                FROM calculations
                ORDER BY id DESC
                LIMIT ?
            """, (limit,))
            rows = cursor.fetchall()
            return [dict(row) for row in rows]

    def get_recent_activities(self, limit: int = 15) -> List[Dict[str, Any]]:
        """Retrieve recent system activities."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT id, module, description, created_at
                FROM activity
                ORDER BY id DESC
                LIMIT ?
            """, (limit,))
            rows = cursor.fetchall()
            return [dict(row) for row in rows]

    def get_dashboard_stats(self) -> Dict[str, int]:
        """
        Return high-level summary metrics:
        - total_calculations
        - graphs_generated
        - matrices_processed
        - equations_solved
        - calculus_operations
        - statistics_analyzed
        """
        with self._get_connection() as conn:
            cursor = conn.cursor()
            
            # Total calculations count
            cursor.execute("SELECT COUNT(*) AS count FROM calculations")
            total_calc = cursor.fetchone()["count"]

            # Query module operation counts from statistics table
            cursor.execute("SELECT module, operation_count FROM statistics")
            mod_counts = {row["module"]: row["operation_count"] for row in cursor.fetchall()}

            return {
                "total_calculations": total_calc,
                "graphs_generated": mod_counts.get("graphing", 0),
                "matrices_processed": mod_counts.get("matrices", 0),
                "equations_solved": mod_counts.get("equations", 0),
                "calculus_operations": mod_counts.get("calculus", 0),
                "statistics_analyzed": mod_counts.get("statistics", 0),
                "probability_simulations": mod_counts.get("probability", 0),
            }

    def clear_history(self) -> None:
        """Clear calculation history and activity logs."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM calculations")
            cursor.execute("DELETE FROM activity")
            conn.commit()

    def reset_statistics(self) -> None:
        """Reset all module operation counts to zero."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("UPDATE statistics SET operation_count = 0")
            conn.commit()
