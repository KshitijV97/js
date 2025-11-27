let car = {
  color: "red",
  company: "ferrari",
};

function purchaseCar(currency, price) {
  console.log(
    `I have purchased ${this.color} = ${this.company} for ${currency} ${price}`
  );
}

Function.prototype.myApply = function (context = {}, args = []) {
  if (typeof this !== "function") {
    throw new Error();
  }

  context.func = this;
  context.func(...args);
};

purchaseCar.myApply(car, ["Rs", "200"]);
