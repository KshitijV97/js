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

function sumZeroTwoPointers(arr) {
	let left = 0;
	let right = arr.length - 1;
	while (left < right) {
		let sum = arr[left] + arr[right];
		if (sum === 0) {
			return [arr[left], arr[right]];
		} else if (sum > 0) {
			right--;
		} else {
			left++;
		}
	}
}

// Count unique values in sorted array using multiple pointers

function countUniqueValues(arr) {
	if (arr.length <= 1) return arr.length;
	let uniqueValueCount = 1;
	for (
		let leftPointer = 0, rightPointer = 1;
		rightPointer < arr.length;
		rightPointer++
	) {
		if (arr[leftPointer] !== arr[rightPointer]) {
			uniqueValueCount++;
			leftPointer = rightPointer;
		}
	}
	return uniqueValueCount;
}
