
const cart = ["shoes", "shirt", "pant"];

createOrder(cart); // orderId

proceedToPayment(orderId);

// Both above instructions are asynchronous

const promise = createOrder(cart);

// First an empty promise object will be returned
// Once createOrder returns response, proper data will be returned

promise.then(attach_callback);

promise.then(function (order_id) {
	proceedToPayment(order_id);
});

// Passing vs Attaching function

// We pass callback in case of callback, We attach function in case of promise

// Promise object is immutable

// No one can mutate promise object, You can pass it around wherever you want

// Container or placeholder for a future value

// Promise is an object that represents eventual completion or failure of an asynchronous operation

