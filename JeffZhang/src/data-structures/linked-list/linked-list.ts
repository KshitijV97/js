import { EqualsFunction, defaultEquals } from "../../utils/utils.js";
import LinkedListNode from "./linked-list-node.js";

interface List<T> {
	head: LinkedListNode<T>;
	tail: LinkedListNode<T>;
	size: number;
}

// TODO - Add implements Iterable<T>
class LinkedList<T> {
	private list: List<T> | undefined;

	constructor() {
		this.list = undefined;
	}

	size(): number {
		if (this.list) return this.list.size;
		return 0;
	}

	isEmpty(): boolean {
		return !this.list;
	}

	addFront(val: T): boolean {
		const newNode = new LinkedListNode<T>(val);
		if (this.list) {
			this.list.head.prev = newNode;
			newNode.next = this.list.head;
			this.list.head = newNode;
			this.list.size += 1;
		} else {
			this.list = {
				head: newNode,
				tail: newNode,
				size: 1,
			};
		}
		return true;
	}

	addBack(val: T): boolean {
		let newNode = new LinkedListNode<T>(val);
		if (this.list) {
			this.list.tail.next = newNode;
			newNode.prev = this.list.tail;
			this.list.tail = newNode;
			this.list.size += 1;
		} else {
			this.list = {
				head: newNode,
				tail: newNode,
				size: 1,
			};
		}
		return true;
	}

	addAt(i: number, val: T): boolean {
		if (i < 0 || i > this.list.size || !this.list) return false;

		if (i == 0) {
			this.addFront(val);
			return true;
		}

		if (i == this.list.size) {
			this.addBack(val);
			return true;
		}

		let newNode = new LinkedListNode<T>(val);

		let curr = this.list.head;
		for (let j = 0; j < i - 1; j++) {
			curr = curr.next;
		}

		newNode.prev = curr;
		newNode.next = curr.next;

		curr.next = newNode;
		curr.next.prev = newNode;

		this.list.size += 1;

		return true;
	}

	peekFront(): T | null {
		if (!this.list) return null;
		return this.list.head.val;
	}

	peekBack(): T | null {
		if (!this.list) return null;
		return this.list.tail.val;
	}

	get(i: number): T | null {
		if (!this.list || i < 0 || i > this.list.size) return null;

		let curr: LinkedListNode<T> = this.list.head;

		for (let j = 0; j < i; j++) {
			curr = curr.next;
		}

		return curr.val;
	}

	indexOf(value: T, equalsFunction?: EqualsFunction<T>): number {
		if (!this.list) return -1;

		const equalsF = equalsFunction || defaultEquals;
		let i = 0;
		let curr = this.list.head;
		while (!equalsF(curr.val, value)) {
			if (!curr.next) return -1;
			curr = curr.next;
			i += 1;
		}
		return i;
	}

	contains(value: T, equalsFunction?: EqualsFunction<T>): boolean {
		const index = this.indexOf(
			value,
			equalsFunction ? equalsFunction : undefined
		);
		return index !== -1;
	}

	removeFront(): boolean {
		if (!this.list) return false;

		if (this.list.head.next) {
			// Remove old head
			this.list.head.next.prev = null;

			// Update the head
			this.list.head = this.list.head.next;

			// Reduce size of list
			this.list.size -= 1;
		} else {
			// Delete entire list
			this.list = undefined;
		}
		return true;
	}

	removeBack(): boolean {
		if (!this.list) return false;

		if (this.list.tail.prev) {
			// Remove old tail
			this.list.tail.prev.next = null;

			// Update the tail
			this.list.tail = this.list.tail.prev;

			// Reduce size of list
			this.list.size -= 1;
		} else {
			// Delete entire list
			this.list = undefined;
		}
		return true;
	}

	remove(val: T): boolean {
		let index = this.indexOf(val);
		if (index === -1) return false;
		return this.removeAt(index);
	}

	removeAt(index: number): boolean {
		// Underflow or Overflow
		if (!this.list || index < 0 || index > this.list.size) {
			return false;
		}

		// If delete at start or end
		if (index === 0) return this.removeFront();
		if (index === this.list.size - 1) return this.removeBack();

		// Traverse to node to be deleted
		let j = 0;
		let curr = this.list.head;
		while (j < index) {
			curr = curr.next;
			j += 1;
		}

		// Save current value if you want to return
		const val = curr.val;

		// Rearrange the pointers
		curr.next.prev = curr.prev;
		curr.prev.next = curr.next;

		// Reduce size of list
		this.list.size -= 1;

		return true;
	}

	clear(): void {
		this.list = undefined;
	}

	/** Append values to the linked list from an array */
	fromArray(A: T[]): LinkedList<T> {
		for (const a of A) {
			this.addBack(a);
		}
		return this;
	}

	*[Symbol.iterator](): Iterator<T> {
		if (!this.list) return;
		let curr: LinkedListNode<T> | null;

		for (curr = this.list.head; curr != null; curr = curr.next) {
			yield curr.val;
		}
	}
}

export default LinkedList;
