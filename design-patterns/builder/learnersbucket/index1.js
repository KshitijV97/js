// Below is an example without having to define a class

const p = {
	currency: "Rs",
	amount: 0,
	addAmount: function (val) {
		this.amount += val;
		return this;
	},
	addCurrency: function (currency) {
		this.currency = currency;
		return this;
	},
	pay: function () {
		console.log(`${this.currency} ${this.amount}`);
	},
};

p1.addAmount(100).addAmount(200).addAmount(200).pay();

p1.addAmount(200).addCurrency("$").pay();
