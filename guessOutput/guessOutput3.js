const shape = {
	radius: 10,
	diameter() {
		return this.radius * 2;
	},
	perimeter: (radius) => 2 * Math.PI * radius,
};

console.log(shape.diameter());
console.log(shape.perimeter(shape.radius));
