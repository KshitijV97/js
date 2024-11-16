function main() {
  const numbers1 = [10, 20, 30];
  const numbers2 = [10, 20, 30];
  console.log(numbers1 === numbers2);
  console.log(Object.is(numbers1, numbers2));
  
}
