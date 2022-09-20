const myObject = { a: { b: { c: 1 } }, d: 1 };

const deflate = (obj) => {
	const res = [];
	return Object.keys(obj).forEach((key) => {
		return typeof obj[key] === 'object' && obj[key]
			? deflate(obj[key])
			: typeof obj[key] === 'function'
			? res.push(obj[key]())
			: res.push(obj[key]);
	});
};

const flattenJson = (obj = {}, result = {}, extraKey = '') => {
	for (let key in obj) {
		if (typeof obj[key] !== 'object') {
			result[extraKey + key] = obj[key];
		} else {
			flattenJson(obj[key], result, `${extraKey}${key}`);
		}
	}
	return result;
};

console.log(deflate(myObject));
console.log(flattenJson(myObject));
