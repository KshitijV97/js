// Multiple pointers

/**
 * Creating pointers or values that correspond to an index or position and move towards the beginning, end or middle based on a certain condition
 */

/** Very efficient for solving problems with minimum space complexity */

function sumZero(arr) {
	for (let i = 0; i < arr.length; i++) {
		for (let j = 0; j < arr.length; j++) {
			if (arr[i] + arr[j] === 0) {
				return [arr[i], arr[j]];
			}
		}
	}
}
