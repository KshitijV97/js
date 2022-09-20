// This is the original array
var original = [true, true, undefined, false, null];
console.log('Original array is :', original);

// Copying using slice method (Shallow copy)
var copy1 = original.slice(0);
console.log('Shallow copy1 of the original array using slice method', copy1);

// Copying using spread operator (Shallow copy)
var copy2 = [...original];
console.log('Shallow copy2 of the original array using slice method', copy2);

// Whenever we have an Object inside an Object, We need to do deep copying

var deepArray = [['myDeepArray']];
var shallowCopy = deepArray.slice(0);

shallowCopy[0].push('myElement');

console.log('deepArray after updating shallowCopy is ', shallowCopy);
// As you can see the deepArray also got updated

// In shallow copy, You are copying pointers

var deepCopy = JSON.parse(JSON.stringify(deepArray));
