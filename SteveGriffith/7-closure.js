// Solve the problem occuring in second closure

function f1(a) {
	let b = 2;
	setTimeout(function () {
		console.log(a, b);
	}, 1000);
}

function f2() {
	for (var i = 0; i < 3; i++) {
		setTimeout(function () {
			console.log(i);
		}, 1000 * i);
	}
}

// Solution 1 - Dont use var, Use let
function f3() {
	for (let i = 0; i < 3; i++) {
		setTimeout(function () {
			console.log(i);
		}, 1000 * i);
	}
}

// Solution 2 -
function f4() {
	for (var i = 0; i < 3; i++) {
		setTimeout(
			function (x) {
				console.log(x);
			}.bind(this, i),
			1000 * i
		);
	}
}

f4();
