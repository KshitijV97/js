// Sliding window pattern

/**
 * This pattern involves creating a window which can either be an array or number from one position to another
 */

/** Depending on certain conditions, the window either increases or closes (and a new window is created) */

/** Very useful for keeping track of a subset or data in an array / string */

// Write a function called maxSubarraySum which accepts an array of integers and a number called n. The function should calculate the maximum sum of n consecutive elements of the array

function maxSubarraySum(arr, num) {
	if (num > arr.length) return null;
	var max = -Infinity;
	for (let i = 0; i < arr.length - num + 1; i++) {
		let temp = 0;
		for (let j = 0; j < num; j++) {
			temp = temp + arr[i + j];
		}
		if (temp > max) {
			max = temp;
		}
	}
	return max;
}
