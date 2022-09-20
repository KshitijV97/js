// What will be printed?

function abc() {
	console.log(a, b, c);

	// Cannot access a before initialization (Because it is in temporal dead zone)
	const a = 10;

	// Cannot access b before initialization (Because it is in temporal dead zone)
	let b = 20;

    // Undefined it printed if c is accessed before it is defined
	var c = 30;
}

abc();
