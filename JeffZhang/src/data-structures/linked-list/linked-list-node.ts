class LinkedListNode<T> {
  val: T;
  next: LinkedListNode<T> | null;
  prev: LinkedListNode<T> | null;

  constructor(val: T) {
    this.val = val;
    this.prev = null;
    this.next = null;
  }
}

export default LinkedListNode;
