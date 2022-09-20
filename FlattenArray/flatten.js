const flatten = (arr) => {
	let flattenedArray = [];
	for (let element of arr) {
		if (Array.isArray(element)) {
			flattenedArray = flattenedArray.concat(flatten(element));
		} else {
			flattenedArray.push(element);
		}
	}
	return flattenedArray;
};

console.log(flatten([[[[[0]], [1]], [[[2], [3]]], [[4], [5]]]]));

const customFlat = (arr, depth = 1) => {
	let result = [];
	arr.forEach((el) => {
		if (Array.isArray(el)) {
			result.push(...customFlat(el, depth - 1));
		} else {
			result.push(el);
		}
	});
	return result;
};
