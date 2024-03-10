const cart = ["shoes", "pants", "kurta"];

const promise = createOrder(cart);

promise
	.then(function (orderId) {
		console.log(orderId);
		return orderId;
	})
	.catch(function (err) {
		console.error(err);
	})
	.then(function (orderId) {
		return proceedToPayment(orderId);
	})
	.then(function (paymentInfo) {
		console.log(paymentInfo);
	})
	.catch((err) => console.error(err));

// Above is the consumer part

// The promise constructor takes a function as argument

// The function is automatically passed 'resolve' and 'reject' by JS

function createOrder() {
	const pr = new Promise(function (resolve, reject) {
		// Logic to create order

		// Validate Cart
		if (!validateCart(cart)) {
			const err = new Error("Invalid cart");
			reject(err);
		}

		// Call DB to create order
		const orderId = "12345";
		if (orderId) {
			setTimeout(() => resolve(orderId), 2000);
		}
	});

	return pr;
}

function validateCart(cart) {
	return true;
}

function proceedToPayment(orderId) {
	return new Promise(function (resolve, reject) {
		resolve("Payment successful");
	});
}
