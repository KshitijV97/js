class Stack {
	constructor() {
		this.items = [];
	}

	push(item) {
		this.items.push(item);
	}

	pop() {
		return this.items.pop();
	}

	peek() {
		return this.items[this.items.length - 1];
	}

	isEmpty() {
		return this.items.length === 0;
	}

	size() {
		return this.items.length;
	}

	print() {
		return this.items.toString();
	}
}

const s = new Stack();
console.log("Is stack empty", s.isEmpty());
s.push(1);
s.push(2);
s.push(3);
console.log("Stack is", s.print());
console.log("Stack size is", s.size());

s.pop();
console.log("Stack after popping", s.print());
s.push(99);
console.log("Stack is", s.print());
s.pop();
console.log("Stack is", s.print());