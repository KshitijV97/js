// Do method chaining

// Return the reference of the current object from the methods so that methods of the other object can use the object reference

class Payment {
	constructor(currency = "Rs", amount = 0) {
		this.currency = currency;
		this.amount = amount;
	}

	addAmount = function (val) {
		this.amount += val;
		return this;
	};

	addCurrency = function (currency) {
		this.currency = currency;
		return this;
	};

	pay = function () {
		console.log(`${this.currency} ${this.amount}`);
	};
}

const p = new Payment();

p.addAmount(10).addAmount(20).pay();
