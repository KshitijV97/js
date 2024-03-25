// Create an array that is pre populated with 5 random numbers

let a1 = Array.from({ length: 5 }, (n) => Math.random());
console.log("a1", a1);

// Above We are taking an object that has length property 5 and are telling JS to build array using that object, That object does not have other properties
let a2 = new Array(5).fill(null).map((n) => Math.random());
console.log("a2", a2);