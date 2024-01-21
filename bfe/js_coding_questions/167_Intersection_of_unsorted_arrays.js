/**
 * Given two arrays, find the intersection(items occur in both arrays)

    arrays are not sorted, and might have duplicates.
    you can modify the arrays
    you can return the items in any order, but without duplicates.

This is an easy problem, What is the time & space complexity of your approach?

 */


/**
 * @param {any[]} arr1
 * @param {any[]} arr2
 * @returns {any[]}
 */
function getIntersection(arr1, arr2) {
  const mySet = new Set(arr1);
  return Array.from(new Set(arr2.filter(e => mySet.has(e))))
}
