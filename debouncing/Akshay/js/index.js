let counter = 0;
const getData = () => {
	console.log('Fetching data', counter++);
};

const debounce = function (callback, delay) {
	let timer;
	return function () {
		let context = this;
		let args = arguments;
		clearTimeout(timer);
		timer = setTimeout(() => {
			callback.apply(context, args);
		}, delay);
	};
};

function debounce(callback, delay) {
	let timer;
	return function () {
		clearTimeout(timer);
		timer = setTimeout(callback(arguments), delay);
	};
}

const debouncedGetData = debounce(getData, 300);
