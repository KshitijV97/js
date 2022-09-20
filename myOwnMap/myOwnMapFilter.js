const array = [1, 2, 3, 4, 5];
const result = array.map((element) => element * 2);

console.log('Original array is :', array);
console.log('Using .map function to multiply every number by 2 :', result);

const myMap = (array, func) => {
	let newArray = [];
	for (let i = 0; i < array.length; i++) {
		let updatedElement = func(array[i]);
		newArray.push(updatedElement);
	}
	return newArray;
};

console.log(
	'Using own map function',
	myMap([5, 4, 3, 2, 1], (e) => e * 2)
);

const myFilter = (array, func) => {
	let filteredValues = [];
	for (let i = 0; i < array.length; i++) {
		if (func(array[i])) {
			filteredValues.push(array[i]);
		}
	}
	return filteredValues;
};

const naturalNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const evenNumbers = naturalNumbers.filter((number) => number % 2 == 0);
console.log('Natural numbers are', naturalNumbers);
console.log('Even numbers numbers are', evenNumbers);
console.log(
	'Even numbers by own filter function are',
	myFilter(evenNumbers, (number) => number % 2 == 0)
);
