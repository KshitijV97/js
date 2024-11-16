// Implement the event class such that

// first observer
const observer1 = function (item) {
	console.log("fired", item);
};

// second observer
const observer2 = function (item) {
	console.log("moved", item);
};


const event = new MyEvent();

// Subscribe the first observer to the event
event.subscribe(observer1);
event.fire("This is event 1");

// Unsubscribe first observer
event.unsubscribe(observer1);
event.fire("This is event 2");

event.subscribe(observer1);
event.subscribe(observer2);
event.fire("This is event 3")