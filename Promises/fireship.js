// When we add async keyword to function, JS takes the return value of function and automatically resolves it as a promise
// It also sets a context to use the await keyword
// async function's execution can be paused using the await keyword

const whatWillPrint = async () => {
	const a = await getValue();
	console.log('Hello');
	return a;
};

const makeSmoothie = async () => {
	const a = await getFruit('pineapple');
	const b = await getFruit('strawberry');
	return [a, b];
};

const makeSmoothieEfficiently = async () => {
	const a = getFruit('pineapple');
	const b = getFruit('strawberry');
	return await Promise.all([a, b]);
};
// We need to await one thing after the other only if the second value is dependent on the first value

const fruits = ['peach', 'pineapple', 'strawberry'];

const smoothie = fruits.map(async (fruit) => {
	const juice = await getFruit(fruit);
	console.log(juice);
	return juice;
});

const workingSmoothie = fruits.map((f) => getFruit(f));
const workingFruitLoop = async () => {
	for await (const emoji of workingSmoothie) {
		console.log(emoji);
	}
};

const fruitLoop = async () => {
	for (const f of fruits) {
		const juice = await getFruit(f);
		console.log(emoji);
	}
};
