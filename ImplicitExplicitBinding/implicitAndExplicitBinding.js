var obj1 = {
	name: 'Kshitij',
	display: function () {
		console.log(this.name);
	},
};

var obj2 = {
	name: 'Not kshitij',
};

// This will print 'Kshitij'
obj1.display();

//This will print 'Not Kshitij;
obj1.display.call(obj2);

// Now we changed function to arrow function
var obj3 = {
	name: 'Kshitij',
	display: () => {
		console.log(this.name);
	},
};

// This will print 'undefined'
obj3.display.call(obj2);
