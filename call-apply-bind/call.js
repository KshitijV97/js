// Below is basic example of call()
const person = {
	fullName: function () {
		return this.firstname + ' ' + this.lastname;
	},
};

const person1 = {
	firstname: 'john',
	lastname: 'doe',
};

const person2 = {
	firstname: 'mary',
	lastname: 'doe',
};

console.log(person.fullName.call(person1));
console.log(person.fullName.call(person2));

const numbers = [1, 2, 3, 4, 5];
console.log(Math.max.apply(null, numbers));
