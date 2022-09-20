const expensiveFunction = () => {
	console.log('Expensive funcion');
};

const throttle = (callback, limit) => {
	let flag = true;
	return function () {
		let context = this;
		let args = arguments;
		if (flag) {
			callback.apply(context, args);
			flag = false;
			setTimeout(() => {
				flag = true;
			}, limit);
		}
	};
};

const throttledFunction = throttle(expensiveFunction, 500);

window.addEventListener('resize', throttledFunction);
