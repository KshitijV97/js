let name = {
	firstName: "Kshitij",
	lastName: "Vengurlekar",
	printFullName: function () {
		console.log(this.firstName + " " + this.lastName);
	},
};

name.printFullName();

let name1 = {
	firstName: "abc",
	lastName: "xyz",
};

// name1 object is borrowing the function of name object
name.printFullName.call(name1);
