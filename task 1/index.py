def calculate_sum(x, n):
    """
    Build an alternating list of x and -x of length n, then print the total sum.

    Parameters
    ----------
    x : int
        The value that alternates between positive and negative positions.
    n : int
        The number of terms to include in the alternating sequence.
    """
    pattern = []
    for i in range(n):
        # Even indices contribute +x, odd indices contribute -x.
        if i % 2 == 0:
            pattern.append(x)
        else:
            pattern.append(-x)

    # Summing the pattern gives the net result of the alternating series.
    print(sum(pattern))


# Example usage: expect 2 because the sequence is [2, -2, 2, -2, 2].
calculate_sum(2, 5)   # Output: 2
