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
}

export default LinkedList;
