let car = {
  color: "red",
  company: "ferrari",
};

function purchaseCar(currency, price) {
  console.log(
    `I have purchased ${this.color} = ${this.company} for ${currency} ${price}`
  );
}

const boundedFunction = purchaseCar.bind(car, "Rs", "300");

console.log("Calling original bind");
boundedFunction();

Function.prototype.myBind = function (context = {}, ...args) {
  if (typeof this !== "function") {
    throw new Error("Not callable");
  }

  context.func = this;
  return function () {
    context.func(...args);
  };
};

console.log("Calling polyfill bind");
boundedFunctionPoly = purchaseCar.myBind(car);
boundedFunction("Rs", "300");
