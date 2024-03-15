// ASI, object literals, square bracket syntax, hoisting
// what happens when you run this code? why?
// how would you fix it?

let a = {
  a: 123,
}[a].forEach(function (x) {
  console.log(x);
});

// reference error with a

// JS says this is valid syntax

// However it tries to find variable a and not 'a' and that is where the error comes
