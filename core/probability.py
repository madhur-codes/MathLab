"""
MathLab Probability Laboratory Engine
Simulations for coin tosses, dice rolls, combinatorics, and empirical vs theoretical probability.
Developed by: Ramji (Visualization & Probability)
"""

import random
import math
from typing import Dict, Any, Optional
from utils.helpers import format_result


class ProbabilityEngine:
    """Handles statistical probability experiments, simulations, and combinatorics."""

    def __init__(self, db_manager: Optional[Any] = None):
        self.db = db_manager

    def simulate_coin_toss(self, num_tosses: int) -> Dict[str, Any]:
        """
        Simulate N independent fair coin tosses.
        Returns counts, experimental probabilities, and comparison with theoretical (0.5).
        """
        if num_tosses <= 0:
            return {"success": False, "error": "Number of tosses must be a positive integer."}
        if num_tosses > 1_000_000:
            return {"success": False, "error": "Toss count cannot exceed 1,000,000 for UI performance."}

        heads = 0
        tails = 0

        for _ in range(num_tosses):
            if random.random() < 0.5:
                heads += 1
            else:
                tails += 1

        p_heads_exp = heads / num_tosses
        p_tails_exp = tails / num_tosses
        p_theo = 0.5

        res = {
            "success": True,
            "tosses": num_tosses,
            "heads_count": heads,
            "tails_count": tails,
            "heads_prob_exp": p_heads_exp,
            "tails_prob_exp": p_tails_exp,
            "theoretical_prob": p_theo,
            "heads_diff": abs(p_heads_exp - p_theo),
            "tails_diff": abs(p_tails_exp - p_theo),
            "summary_text": (
                f"{num_tosses} Tosses: Heads = {heads} ({p_heads_exp*100:.2f}%), "
                f"Tails = {tails} ({p_tails_exp*100:.2f}%). Theoretical = 50.00%."
            ),
        }

        if self.db:
            self.db.log_calculation("probability", f"Coin Toss (N={num_tosses})", res["summary_text"])

        return res

    def simulate_dice_roll(self, num_rolls: int) -> Dict[str, Any]:
        """
        Simulate rolling a fair 6-sided die N times.
        Returns frequencies for outcomes 1..6, experimental probabilities, and theoretical (1/6 ≈ 0.1667).
        """
        if num_rolls <= 0:
            return {"success": False, "error": "Number of rolls must be a positive integer."}
        if num_rolls > 1_000_000:
            return {"success": False, "error": "Roll count cannot exceed 1,000,000 for UI performance."}

        counts = {i: 0 for i in range(1, 7)}
        for _ in range(num_rolls):
            face = random.randint(1, 6)
            counts[face] += 1

        p_theo = 1.0 / 6.0
        frequencies = {}
        for face, count in counts.items():
            exp_p = count / num_rolls
            frequencies[face] = {
                "count": count,
                "prob_exp": exp_p,
                "prob_theo": p_theo,
                "percentage": exp_p * 100.0,
            }

        res = {
            "success": True,
            "rolls": num_rolls,
            "frequencies": frequencies,
            "counts": counts,
            "theoretical_prob": p_theo,
            "summary": f"{num_rolls} rolls completed across faces 1 through 6.",
        }

        if self.db:
            self.db.log_calculation("probability", f"Dice Roll (N={num_rolls})", f"Faces 1-6 simulated across {num_rolls} rolls")

        return res

    def calculate_classical_probability(self, favorable: int, total: int) -> Dict[str, Any]:
        """
        Calculate classical probability P(A) = favorable / total.
        Also computes complement P(A') and odds.
        """
        if total <= 0:
            return {"success": False, "error": "Total sample space outcomes must be greater than zero."}
        if favorable < 0:
            return {"success": False, "error": "Favorable outcomes cannot be negative."}
        if favorable > total:
            return {"success": False, "error": "Favorable outcomes cannot exceed total outcomes."}

        prob = favorable / total
        complement = 1.0 - prob
        unfavorable = total - favorable

        # Odds in favor: favorable : unfavorable
        gcd = math.gcd(favorable, unfavorable) if unfavorable > 0 else 1
        odds_favor = f"{favorable // gcd}:{unfavorable // gcd}" if unfavorable > 0 else "Undefined (Certain)"

        res = {
            "success": True,
            "favorable": favorable,
            "total": total,
            "probability": prob,
            "probability_percent": prob * 100.0,
            "complement": complement,
            "odds_in_favor": odds_favor,
            "display": f"P(A) = {favorable}/{total} = {format_result(prob)} ({prob*100:.2f}%)",
        }

        if self.db:
            self.db.log_calculation("probability", f"P({favorable}/{total})", res["display"])

        return res

    def combinatorics(self, n: int, r: int) -> Dict[str, Any]:
        """
        Compute Permutations P(n, r) and Combinations C(n, r).
        """
        if n < 0 or r < 0:
            return {"success": False, "error": "Values of n and r must be non-negative integers."}
        if r > n:
            return {"success": False, "error": "Subset size 'r' cannot be larger than total items 'n'."}

        try:
            n_perm_r = math.perm(n, r)
            n_comb_r = math.comb(n, r)
            fact_n = math.factorial(n)
            fact_r = math.factorial(r)

            return {
                "success": True,
                "n": n,
                "r": r,
                "permutations": n_perm_r,
                "combinations": n_comb_r,
                "factorial_n": fact_n,
                "factorial_r": fact_r,
                "display": f"P({n}, {r}) = {n_perm_r},  C({n}, {r}) = {n_comb_r}",
            }
        except OverflowError:
            return {"success": False, "error": "Numerical overflow: result exceeds system memory limits."}
        except Exception as e:
            return {"success": False, "error": str(e)}
