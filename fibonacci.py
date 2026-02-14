def fibonacci(n: int) -> list[int]:
    """
    Calculate the Fibonacci sequence up to n terms.
    
    The Fibonacci sequence is a series of numbers where each number is the sum
    of the two preceding ones, usually starting with 0 and 1.
    
    Args:
        n (int): The number of terms to generate (must be >= 0)
    
    Returns:
        list[int]: A list containing the first n Fibonacci numbers
    
    Raises:
        ValueError: If n is negative
    
    Examples:
        >>> fibonacci(0)
        []
        >>> fibonacci(1)
        [0]
        >>> fibonacci(5)
        [0, 1, 1, 2, 3]
        >>> fibonacci(10)
        [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
    """
    if n < 0:
        raise ValueError("n must be non-negative")
    
    if n == 0:
        return []
    elif n == 1:
        return [0]
    
    # Initialize with first two terms
    sequence = [0, 1]
    
    # Generate remaining terms
    for i in range(2, n):
        next_term = sequence[i-1] + sequence[i-2]
        sequence.append(next_term)
    
    return sequence


def fibonacci_generator(n: int):
    """
    Generator version that yields Fibonacci numbers one by one.
    
    Args:
        n (int): The number of terms to generate (must be >= 0)
    
    Yields:
        int: The next Fibonacci number in the sequence
    
    Raises:
        ValueError: If n is negative
    """
    if n < 0:
        raise ValueError("n must be non-negative")
    
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b


if __name__ == "__main__":
    # Test the function
    test_cases = [0, 1, 5, 10]
    
    for n in test_cases:
        result = fibonacci(n)
        print(f"fibonacci({n}) = {result}")
    
    # Test the generator
    print("\nUsing generator:")
    for n in [5, 10]:
        print(f"fibonacci_generator({n}): {list(fibonacci_generator(n))}")
    
    # Test error case
    try:
        fibonacci(-1)
    except ValueError as e:
        print(f"\nError test passed: {e}")