let numbers = [];

for (let i = 0; i < 10; i++) {
	for (let j = 0; j < 10; j++) {
		let currentNumber = i.toString() + j.toString();
		numbers.push(currentNumber);
	}
}

console.log(numbers);
