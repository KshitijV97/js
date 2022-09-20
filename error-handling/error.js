// Pyramid of doom is avoided by writing async await styled code

async function heaven() {
	const a = await step1();
	const b = await step2(a);
	const c = await step3(c);
	return a + b + c;
}

async function towerOfTerror() {
	let a;
	let b;
	let c;

	try {
		a = await step1();
	} catch (error) {
		handle(error);
	}

	try {
		b = await step1();
	} catch (error) {
		handle(error);
	}

	try {
		c = await step1();
	} catch (error) {
		handle(error);
	}

	return a + b + c;
}

// Easy way out from tower of terror
// await step1().catch();

async function awesome() {
	try {
		const data = await promise;
		return [data, null];
	} catch (err) {
		console.error(error);
		return [null, error];
	}
}

// const [data, error] = await awesome()
