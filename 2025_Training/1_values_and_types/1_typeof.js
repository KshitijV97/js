“var a;
typeof a;                // "undefined"

a = "hello world";
typeof a;                // "string"

a = 42;
typeof a;                // "number"

a = true;
typeof a;                // "boolean"

a = null;
typeof a;                // "object" -- weird, bug

a = undefined;
typeof a;                // "undefined"

a = { b: "c" };
typeof a;                // "object”


/**
 * “Notice how the a variable holds every different type of value, and that despite appearances, 
 * 
 * typeof a is not asking for the "type of a", but rather for the "type of the value currently in a." 
 * 
 * Only values have types in JavaScript; variables are just simple containers for those values.”
 */

typeof null

/**
 * “This is a long-standing bug in JS, but one that is likely never going to be fixed. 
 * Too much code on the Web relies on the bug and thus fixing it would cause a lot more bugs!”
 */