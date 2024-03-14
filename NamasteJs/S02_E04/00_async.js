// Async function will always return a Promise

// Either we explicitly return a promise
// If we return a value instead of a promise, The function will wrap the value inside a promise and then return it

// Below function returns value
async function getData() {
  return "Namaste";
}

const dataPromise = getData();
console.log(dataPromise); // This will print the promise
dataPromise.then((res) => console.log(res)); // This will print the resolved value

const p = new Promise((resolve, reject) => {
  resolve("Promise resolved value");
});

// Below function returns promise
async function getDataP() {
  return p;
}

const dPromise = getDataP();
console.log("dPromise", dPromise);
dPromise.then((res) => console.log(res));
