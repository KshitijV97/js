/** Implement
 * const result = calc.add(2).multiply(3).subtract(4).add(5);
console.log(result.total);

 */

const calc = {
	total: 0,
	add(n) {
		this.total += n;
		return this;
	},
	multiply(n) {
		this.total *= n;
		return this;
	},
	subtract(n) {
		this.total -= n;
		return this;
	},
};

const result = calc.add(2).multiply(3).subtract(4).add(5);
console.log(result.total);
