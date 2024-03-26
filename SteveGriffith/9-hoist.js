//var hoisting vs let hoisting
//WHAT will be the output from this code and why?

function f() {
	console.log("var", area);
	console.log("let", name);
	let name = "Bert";
	var area = "Geology";
}
// f();

function f1() {
	if (area !== undefined) console.log("var", area);

	try {
		console.log("let", name);
	} catch (error) {
		console.log(error.name);
		console.log(error.message);
	}

	let name = "Bert";
	var area = "Geology";
}
f1();
