// Traditional bind function
let myName = {
	firstname: 'Kshitij',
	lastname: 'Vengurlekar',
};

let printName = function () {
	console.log(this.firstname + ' ' + this.lastname);
};

printName();
let printMyName = printName.bind(myName);
printMyName();

// Own implementation

Function.prototype.myBind = function (...args) {
	let context = this;
	params = args.slice(1);
	return function () {
		context.apply(args[0], [...params]);
	};
};
