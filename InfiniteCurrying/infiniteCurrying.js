function add(a) {
	return function (b) {
		return function () {
			a + b;
		};
	};
}

console.log(add(5)(2)());
