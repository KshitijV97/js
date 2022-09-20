// f(a, b, c) -> f(a)(b)(c)

let multiply = function (x, y) {
	console.log(x * y);
};

let multiplyByTwo = multiply.bind(this, 2);

multiplyByTwo(2);

let multiplyClosure = function (x) {
	return function (y) {
		console.log(x * y);
	};
};

let mulBytwo = multiplyClosure(2);
mulBytwo(3);

