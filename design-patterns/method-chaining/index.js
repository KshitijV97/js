const CALC = function () {
	this.total = 0;

	this.add = function (val) {
		this.total += val;
		return this;
	};

	this.subtract = function (val) {
		this.total -= val;
		return this;
	};

	this.multiply = function (val) {
		this.total *= val;
		return this;
	};

	this.divide = function (val) {
		this.total *= val;
		return this;
	};

	this.value = function () {
		return this.total;
	};
};

const calculator = new CALC();
console.log(calculator.add(10).subtract(2).divide(2).multiply(5));
console.log(calculator.total);
console.log(calculator.value());
