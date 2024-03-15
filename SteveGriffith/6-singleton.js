/**
 * Create an example of a JavaScript Singleton.
 * After the first object is created, it will return additional
 * references to itself
 */

let obj = (function () {
  let objInstance; //private variable
  function create() {
    //private function to create methods and properties
    let _isRunning = false;

    let start = function () {
      _isRunning = true;
    };

    let stop = function () {
      _isRunning = false;
    };

    let currentState = function () {
      return _isRunning;
    };
    return {
      start,
      stop,
      currentState,
    };
  }
  return {
    objInstance: function () {
      if (!objInstance) {
        objInstance = create();
      }
      return objInstance;
    },
  };
})();

let obj1 = obj.objInstance();
let obj2 = obj.objInstance();
obj1.start();

console.log(obj2.currentState());
