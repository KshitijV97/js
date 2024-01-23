const cart = ["shoes", "shirt", "pant"];

// First we create order
api.createOrder(cart);

// When a order is created, then only we proceed to payment
api.proceedToPayment();

// How do we achieve the above

api.createOrder(cart, function () {
	api.proceedToPayment();
});

// Above we wrapped our line to proceed to payment in a callback function and sent that callback function as an argument to the function after whose execution we want to call proceedToPayment

// Now it is responsibility of createOrder to call proceedToPayment when required

// Next we want to show order summary

api.createOrder(cart, function () {
	api.proceedToPayment(function () {
		api.showOrderSummary();
	});
});

// Now we want to update wallet

api.createOrder(cart, function () {
	api.proceedToPayment(function () {
		api.showOrderSummary(function () {
			api.updateWallet();
		});
	});
});

// Now we have callback hell

// aka Pyramid of doom
