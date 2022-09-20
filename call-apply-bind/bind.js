const obj = { name: 'John' };

let greeting = function (a, b) {
	return `${a} ${this.name} ${b}`;
};
console.log('Directly calling greeting()', greeting());

let bound = greeting.bind(obj);
console.log('Binding using in built bind', bound('Hello', 'How are you'));

Function.prototype.myBind = function (...args) {
	let context = this;
	let newContext = args[0];
	let params = args.slice(1);
	return function (...args2) {
		return context.apply(newContext, [...params, ...args2]);
	};
};

let myBound = greeting.myBind(obj);
console.log('Using custom myBind()', myBound('Kshitij', 'Vengurlekar'));
