const addCounter = () => {
	let counter = 0;
	counter++;
	return counter;
};

console.log(addCounter());
console.log(addCounter());
console.log(addCounter());

// You will get 1, 1, 1 every time
// One option we have is to move the let counter out of function and make it global variable
// But we don't want to do that
// We can achieve this with a closure

const closureAddCounter = () => {
	let counter = 0;
	return () => ++counter;
};

const incrementCounterUsingClosure = closureAddCounter() 
console.log(incrementCounterUsingClosure());
console.log(incrementCounterUsingClosure());
console.log(incrementCounterUsingClosure());
