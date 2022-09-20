Array.prototype.ownReduce = function (callback, initialValue) {
	let accumulator = initialValue || undefined;
	for (let index = 0; index < this.length; index++) {
		if (accumulator !== undefined) {
			accumulator = callback.call(
				context,
				accumulator,
				this[index],
				index,
				this
			);
		} else {
			accumulator = this[index];
		}
	}
};

Array.prototype.myMap = function (callback) {
	let temp = [];
	for (let index = 0; index < this.length; index++) {
		temp.push(callback(this[index], index, this));
	}
	return temp;
};

Array.prototype.myFilter = function (callback) {
	let temp = [];
	for (let index = 0; index < this.length; index++) {
		if (callback(this[index], index, this)) temp.push(this[index]);
	}
	return temp;
};

Array.prototype.myReduce = function (callback, initialValue) {
	var accumulator = initialValue;
	for (let index = 0; index < array.length; index++) {
		accumulator = accumulator
			? callback(accumulator, this[index], index, this)
			: this[index];
	}
	return accumulator;
};

// Question 1 - Map vs forEach

const arr = [2, 5, 3, 4, 7];

// Returns a new array, Does not modify original array
// We can chain other methods after map
arr.map((el) => {
	return el * 2;
});

// Modifies the original array
arr.forEach((el) => el * 2);
