const p = new Promise(function (resolve, reject) {
  setTimeout(() => {
    resolve("Promise is resolved");
  }, 5000);
});

async function getData() {
  p.then((res) => console.log(res));
  console.log("Namaste kshitij");
}

// async and await combo are used to handle promises
async function handlePromise() {
  const val = await p; // Execution will get paused here
  console.log(val);
}

handlePromise();

// await can only be used inside async function
getData();
