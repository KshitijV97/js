const p = new Promise(function (resolve, reject) {
	resolve("Promise is resolved");
});

async function getData() {
	return p;
}
