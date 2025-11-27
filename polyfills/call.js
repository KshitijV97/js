let car = {
  color: "red",
  company: "ferrari",
};

function purchaseCar(currency, price) {
  console.log(
    `I have purchased ${this.color} = ${this.company} for ${currency} ${price}`
  );
}

purchaseCar.call(car, "Rs", "100");

Function.prototype.myCall = function (context = {}, ...args) {
  if (typeof this !== "function") {
    throw new Error("Not callable");
  }
  context.func = this; // Add the function user is trying to use to the context passed
  context.func(...args);
};

purchaseCar.myCall(car, "Rs", "100");
