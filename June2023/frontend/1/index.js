// Solution link - https://youtu.be/ElHeF2zY570

function correspondingNode(treeA, treeB, target) {
  const stackA = [treeA];
  const stackB = [treeB];

  while (stackA.length) {
    const currentA = stackA.pop();
    const currentB = stackB.pop();

    if (currentA == target) {
      return currentB;
    }

    stackA.push(...currentA.children);
    stackB.push(...currentB.children);
  }
}

const treeA = document.getElementById("tree1");
const treeB = document.getElementById("tree2");
const target = document.getElementById("target");

console.log(correspondingNode(treeA, treeB, target));
