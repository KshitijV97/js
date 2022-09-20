// Output based question on event loop

console.log('a');
setTimeout(() => console.log('setTimeout'), 0);
Promise.resolve(() => console.log('Promise')).then((res) => res());
console.log('z');
