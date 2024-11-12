/**
 * Finds the first pair of numbers in the array that sum up to the target value.
 * @param {number[]} arr - The array of numbers.
 * @param {number} target - The target sum.
 * @returns {number[] | null} - The first pair of numbers that add up to the target sum, or null if no pair is found.
 * @throws {Error | TypeError} - Throws an error if input validation fails.
 */
function getFirstPairWithSum(arr, target) {
  if (!Array.isArray(arr)) {
    throw new TypeError(`Expected an array for 'arr', got ${typeof arr}`);
  }

  if (arr.length === 0) {
    throw new Error(
      `Expected an array with at least one element for 'arr', got 0 elements.`
    );
  }

  if (!arr.every((element) => typeof element === "number")) {
    throw new Error(
      "Expected an array with all elements being numbers for 'arr', got a mix of numbers and non-numbers."
    );
  }

  if (typeof target !== "number") {
    throw new TypeError(
      `Expected a number for 'target', got ${typeof target}.`
    );
  }

  const seenNumbers = new Set();

  for (const num of arr) {
    const complement = target - num;
    if (seenNumbers.has(complement)) {
      return [complement, num];
    }
    seenNumbers.add(num);
  }

  return null;
}

const M = [2, 5, 8, 14, 0];
const N = 10;

try {
  const pairWithSum = getFirstPairWithSum(M, N);
  console.log(pairWithSum);
} catch (error) {
  console.log("Error:", error.message);
}
