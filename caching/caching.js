function memoize(callback, context) {
	const cache = {};
	return function () {
		var key = JSON.stringify(arguments);
		if (!cache[key]) {
			cache[key] = callback.call(context || this, ...arguments);
		}
		return cache[key];
	};
}

const clumsyFunction = (num1, num2) => {
	for (let i = 1; i < 100000000; i++) {}
	return num1 * num2;
};

const memoizedFunction = memoize(clumsyFunction);

console.time('First call');
console.log(memoizedFunction(1234, 5678));
console.timeEnd('First call');

console.time('Second call');
console.log(memoizedFunction(1234, 5678));
console.timeEnd('Second call');
