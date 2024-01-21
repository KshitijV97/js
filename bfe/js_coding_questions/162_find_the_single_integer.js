/**
 * 
 * Given an array of integers, all integers appear twice except one integer, could you quickly target it ?

  const arr = [10, 2, 2 , 1, 0, 0, 10]
  findSingle(arr) // 1

What is time & space cost of your approach ? Could you do better ?
 * 
 */

// The XOR operation has the property that XOR-ing a number with itself results in 0. So, if you XOR all the numbers in the array, the result will be the number that appears only once.


/**
 * @param {number[]} arr
 * @returns number
 */
function findSingle(arr) {
  let res =0;
  for(num of arr){
    res = res ^ num
  }
  return res
}
