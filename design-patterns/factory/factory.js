function Developer(name) {
	this.name = name;
	this.type = "Developer";
}

function Tester(name) {
	this.name = name;
	this.type = "Tester";
}

function EmployeeFactory() {
	this.create = (name, type) => {
		switch (type) {
			case 1:
				return new Developer(name);
				break;
			case 2:
				return new Tester(name);
				break;
		}
	};
}

function say() {
	console.log("Hi, I am " + this.name + ". And I am a " + this.type);
}

const employeeFactory = new EmployeeFactory();
const employees = [];
employees.push(employeeFactory.create("Kshitij", 1));
employees.push(employeeFactory.create("Vengurlekar", 2));

employees.forEach((employee) => say.call(employee));
