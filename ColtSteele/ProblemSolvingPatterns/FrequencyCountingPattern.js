// Frequency Counters

// This pattern uses Objects or Sets to collect Values / Frequencies of values

// Using this pattern can often avoid the need for nested loops which leads to O(n^2) complexity

/**
 *
 * Question - Write a function called 'same' which accepts two arrays.
 * The function should return true if every value in the array has its corresponding value squared in the second array.
 * The frequency of values must be same.
 */

function same(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;

  for (let i = 0; i < arr1.length; i++) {
    let correctIndex = arr2.indexOf(arr1[i] ** 2);
    if (correctIndex == -1) return false;
    arr2.splice(correctIndex, 1);
  }
  return true;
}

console.log(same([1, 2, 1], [1, 1, 4]));
