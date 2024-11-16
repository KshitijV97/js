const Event = function () {
  this.handlers = [];

  this.subscribe = function (f) {
    this.handlers.push(f);
  };

  this.unsubscribe = function (f) {
    this.handlers = this.handlers.filter((func) => func !== f);
  };

  this.fire = function (args, context) {
    const scope = context || window;
    this.handlers.forEach((f) => f.call(scope, args));
  };
};
