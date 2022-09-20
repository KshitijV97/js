/**
 * Functional programming works with Pure functions
 * And they are tiny small composable functions
 *
 * How to link together those small functions
 *
 * Pipe and compose functions are higher order functions
 *
 * higher order function takes function as a argument and returns another function
 */

// How does a compose function work?
// Let us take a small function

const add2 = (x) => x + 2;
const sub1 = (x) => x - 2;
const mul5 = (x) => x * 5;

// The above is NOT a compose function
const result = mul5(sub1(add2(4)));

// The above line executes right to left
console.log('Logging result', result);

// Lodash has its own built in compose and pipe functions

const compose =
	(...fns) =>
	(val) =>
		fns.reduceRight((prev, fn) => fn(prev), val);

const pipe =
	(...fns) =>
	(val) =>
		fns.reduce((prev, fn) => fn(prev), val);

const compResult = compose(mul5, sub1, add2)();
