// Every method in JS should have access to your bind method

// To achieve above we have to attach our method in Function prototype

// The function which we attach to Function.prototype will return a function (Thats how bind works)

// We want to call the appropriate function when the function returned by us is called

// Now how will you get the function which you want to call? The caller will call as hisFunciton.myBind(), Here this inside myBind referes to hisFunction

// We have to handle arguments sent to newFunc = func.myBind(THESE_ARGS)

// We also have to handle arguments sent while claling newFunc(THESE_ARGS)

// Expected API is as below

let nameObj = {
	firstName: "Kshitij",
	lastName: "Vengurlekar",
};

let printName = function (city, country) {
	console.log(
		this.firstName + " " + this.lastName + " " + city + " " + country
	);
};

Function.prototype.myBind = function (...args) {
	const neededFunction = this;
	const context = args[0];
	return function (...calledArgs) {
		const argsToPass = args.slice(1);
		return neededFunction.apply(context, [...argsToPass, calledArgs]);
	};
};

let printFullName = printName.myBind(nameObj, "pune");

printFullName("india");
