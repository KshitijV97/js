function counter() {
	var count = 0;
	return function incrementCounter() {
		count++;
		console.log('Counter is ', counter);
	};
}

var firstCounter = counter();
