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
}

export default LinkedList;
