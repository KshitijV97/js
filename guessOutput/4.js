let x = "outer value";

(function () {
	// Start TDZ for x.
	console.log(x);
	let x = "inner value"; // Declaration ends TDZ for x.
})();
