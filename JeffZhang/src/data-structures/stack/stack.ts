import { EqualsFunction } from "../../utils/utils.js";
import LinkedList from "../linked-list/linked-list.js";

class Stack<T> implements Iterable<T> {
	private list: LinkedList<T>;

	constructor() {
		this.list = new LinkedList();
	}

	size(): number {
		return this.list.size();
	}

	isEmpty(): boolean {
		return this.list.isEmpty();
	}

	clear(): void {
		return this.list.clear();
	}

	push(element: T): boolean {
		return this.list.addBack(element);
	}

	pop(): boolean {
		return this.list.removeBack();
	}

	peek(): T {
		return this.list.peekBack();
	}

	contains(element: T, equalsFunction?: EqualsFunction<T>): boolean {
		return this.list.contains(
			element,
			equalsFunction ? equalsFunction : undefined
		);
	}

	[Symbol.iterator](): Iterator<T, any, undefined> {
		return this.list[Symbol.iterator]();
	}
}

export default Stack;
