// Here are three ways to ship a package

class Fedex {
	constructor() {
		this.calculate = (p) => 2.5;
	}
}

class UPS {
	constructor() {
		this.calculate = (p) => 1.5;
	}
}
class IndiaPost {
	constructor() {
		this.calculate = (p) => 3.5;
	}
}

class Shipping {
	constructor() {
		this.company = ""; // Initial value is string, But we are going to store reference here
		this.setStrategy = (company) => {
			this.company = company;
		};
		this.calculate = (p) => {
			return this.company.calculate(p);
		};
	}
}

const fedex = new Fedex();
const ups = new UPS();
const indiaPost = new IndiaPost();
const package = {
	from: "Pune",
	to: "Mumbai",
	weight: 2,
};

const shipping = new Shipping();
shipping.setStrategy(fedex);
console.log(
	"If you ship with fedex, Shipping rate is " + shipping.calculate(package)
);

shipping.setStrategy(indiaPost);
console.log(
	"If you ship with India post, Shipping rate is " + shipping.calculate(package)
);
