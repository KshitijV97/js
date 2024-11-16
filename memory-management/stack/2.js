function anotherFunction(value) {
  let v = value;
  console.log(v);
  v *= 50;
  console.log(v);
}

function main() {
  const numVal = 1;
  const aFlag = true;
  anotherFunction(numVal); // New stack frame created here
}

main();

