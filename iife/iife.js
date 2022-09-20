// (function (a, b) {
// 	return a + b;
// })(1, 2);

// ((a, b) => a + b)(4, 5);

// Remove the function name
// Wrap the function in parenthesis

// This function can never be called again

// Any variables from the expression cannot be accessed from outside the closure

// With ES6 we can accomplish same thing as IIFE by using let and const

var name = 'Joe';
(function (a, b) {
	var name = 'Bob';
	console.log(name);
})();
console.log(name);

// To do the same using ES6 you can simply create a block using curly braces

let myName = 'Kshitij';
{
	let myName = 'Vengurlekar';
	console.log(myName);
}
console.log(myName);
