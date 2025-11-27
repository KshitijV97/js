Array.prototype.myMap = function (callback) {
  let result = [];
  for (let index = 0; index < this.length; index++) {
    result.push(callback(this[index]), index, this);
  }
  return result;
};

const res = [1, 2, 3].myMap((i) => i * 2);
console.log(res);
