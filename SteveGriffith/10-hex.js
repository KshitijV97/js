// Generate Random Hex Colour Values

function getRandomNumber(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

const hex = [
	"0",
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"A",
	"B",
	"C",
	"D",
	"E",
	"F",
];

// Generate Random Hex Colour Values

function getRandomHexString() {
	return new Array(6)
		.fill(null)
		.map((n) => hex[getRandomNumber(0, 15)])
		.join("");
}

function colour() {
	return "#" + getRandomHexString();
}

console.log(colour());
