function sum(a) {
	return function (b) {
		return a + b;
	};
}

console.log(sum(5)(6));

const some = (a) => (b) => a + b;
console.log(some(5)(6));
