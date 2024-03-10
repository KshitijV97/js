let num = [19, 5, 3, 7, 11];

function indexOf(i, arr) {
	for (let j = 0; j < arr.length; j++) {
		if (arr[j] == i) return j;
	}
	return -1;
}

// console.log(indexOf(7, num));

let a = "[[]]";

function balanced(str) {
	let count = 0;
	for (let j = 0; j < str.length; j++) {
		if (str[j] === "[") {
			count++;
		} else {
			count--;
		}
		if (count < 0) return -1;
		console.log(str[j]);
	}
}

balanced(a);
