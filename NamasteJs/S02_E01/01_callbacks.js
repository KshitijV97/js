// Defer execution of a line by passing it as a callback function to setTimeout
// Below is an example of callback

console.log("a");

setTimeout(function () {
	console.log("b");
}, 5000);

console.log("c");
