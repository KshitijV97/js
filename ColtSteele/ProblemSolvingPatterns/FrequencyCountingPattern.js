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

/**
 * Anagram
 */

function validAnagram(s1, s2) {
	// Throw false if length is not equal
	if (s1.length !== s2.length) return false;

	const lookup = {};

	// Make a map of frequency count of letters in first string
	for (let i = 0; i < s1.length; i++) {
		let letter = s1[i];
		lookup[letter] ? (lookup[letter] += 1) : (lookup[letter] = 1);
	}

	for (let j = 0; j < s2.length; j++) {
		let letter = s2[i];
		if (lookup[letter]) {
			lookup[letter] -= 1;
		} else {
			return false;
		}
	}

	return true;
}

function validAnagram(str1, str2) {
	if (str1.length !== str2.length) return false;

	let valid1 = {};
	let valid2 = {};

	for (let i = 0; i < str1.length; i++) {
		valid1[str1[i]] = valid1[str1[i]] ? ++valid1[str1[i]] : 1;
		valid2[str2[i]] = valid2[str2[i]] ? ++valid2[str2[i]] : 1;
	}

	for (let key in valid1) {
		if (!valid2[key] || valid1[key] !== valid2[key]) {
			return false;
		}
	}
	return true;
}
