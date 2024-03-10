// Async function will always return a Promise

// Either we explicitly return a promise
// If we return a value instead of a promise, The function will wrap the value inside a promise and then return it

async function getData() {
	return "Namaste";
}

const dataPromise = getData();
console.log(dataPromise); // This will print the promise
dataPromise.then((res) => console.log(res)); // This will print the resolved value
