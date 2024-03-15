//determine if the function received the number of params it expected

let f = function (a, b) {
  if ((arguments.length = f.length)) return true;
  return false;
};

f(1);
f(1, 2);
f(1, 2, 3);
