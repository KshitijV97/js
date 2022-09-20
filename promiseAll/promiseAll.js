function showText(text, time) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(text);
		}, time);
	});
}

Promise.all([showText('hello', 1), Promise.resolve('hi')]).then((val) =>
	console.log(val)
);

function myPromiseAll(promises) {
	let finalResult = [];
	return new Promise((resolve, reject) => {
		promises.forEach((promise, index) => {
			promise.then((res) => {
				finalResult.push(res);
				if (index === promises.length - 1) {
					resolve(finalResult);
				}
			});
		});
	});
}
