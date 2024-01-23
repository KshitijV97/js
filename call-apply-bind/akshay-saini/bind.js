// The bind method is similar to the call method

// Instead of calling the method like call(), apply(), The bind() method binds the method with the object and returns the copy of the method

let n = {
	firstName: "Kshitij",
	lastName: "Vengurlekar",
};

let printFullName = function (state) {
	console.log(this.firstName + " " + this.lastName);
};

let printMyName = printFullName.bind(n, "pune");

printMyName();