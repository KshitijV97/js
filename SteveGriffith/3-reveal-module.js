// Revealing module pattern

// Turn object literal into a module that only exposes render method

let myModule = {
  data: [],
  render: () => {},
  add: () => {},
  remove: () => {},
};

myModule.data;
myModule.render();

let myConcealedModule = (function () {
  let _data = [];
  let _render = () => {};
  let _add = () => {};
  let _remove = () => {};
  return {
    render: _render,
  };
})();
