#!/usr/bin/env python3
"""
CargoCraft Fleet - Min/Max number of crafts from total propulsion units.

Problem summary
---------------
Two craft types:
- Type A: 4 propulsion units
- Type B: 6 propulsion units

Given total propulsion units n, find:
- minimum number of crafts, and
- maximum number of crafts,
such that 4*a + 6*b = n for nonnegative integers a, b.
If impossible, print -1.

Key observations
----------------
- gcd(4, 6) = 2, so n must be even. Also, the smallest achievable even total is 4.
  Therefore, feasibility condition: n is even AND n >= 4.

- Divide the equation by 2: 2*a + 3*b = m where m = n/2.
  We’re counting crafts k = a + b.

  • To MINIMIZE k, prefer 3s (Type B): k_min = ceil(m / 3).
    (All m >= 2 are representable by 2s and 3s; only m = 1 is not, but that
     corresponds to n = 2 which we already rule out.)

  • To MAXIMIZE k, prefer 2s (Type A): k_max = floor(m / 2).

Algorithm
---------
For each n:
1) If n < 4 or n is odd -> print -1.
2) Else:
   m = n // 2
   min_crafts = (m + 2) // 3   # ceil division
   max_crafts = m // 2         # floor division
   print(min_crafts, max_crafts)

Complexity
----------
O(1) per test case, O(t) overall.

"""

import sys
from typing import Tuple, List

def min_max_crafts(n: int) -> Tuple[int, int]:
    """
    Compute the minimum and maximum number of crafts that sum to n propulsion units
    using only Type A (4 units) and Type B (6 units).

    Parameters
    ----------
    n : int
        Total propulsion units (1 ≤ n ≤ 1e18).

    Returns
    -------
    (min_crafts, max_crafts) : Tuple[int, int]
        A pair with the minimum and maximum possible counts.
        If impossible, returns (-1, -1).
    """
    # Feasibility: must be even and at least 4.
    if n < 4 or (n % 2 == 1):
        return (-1, -1)

    m = n // 2
    # Minimum crafts: use as many 6s as possible -> ceil(m/3)
    min_crafts = (m + 2) // 3  # integer ceiling trick
    # Maximum crafts: use as many 4s as possible -> floor(m/2)
    max_crafts = m // 2

    return (min_crafts, max_crafts)


def solve() -> None:
    """
    Read input, process all test cases, and print results.
    """
    data = sys.stdin.read().strip().split()
    t = int(data[0])
    out_lines: List[str] = []
    idx = 1
    for _ in range(t):
        n = int(data[idx]); idx += 1
        mn, mx = min_max_crafts(n)
        if mn == -1:
            out_lines.append("-1")
        else:
            out_lines.append(f"{mn} {mx}")
    sys.stdout.write("\n".join(out_lines))


if __name__ == "__main__":
    solve()
