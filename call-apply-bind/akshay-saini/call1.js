let name = {
	firstName: "Kshitij",
	lastName: "Vengurlekar",
};

let printFullName = function (state) {
	console.log(this.firstName + " " + this.lastName);
};

let name1 = {
	firstName: "abc",
	lastName: "xyz",
};

// name1 object is borrowing the function of name object
printFullName.call(name, "pune");
printFullName.call(name1, "pqr");