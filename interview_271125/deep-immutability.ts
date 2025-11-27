/**
 * How would you implement deep immutability in TypeScript for a complex object?
 * 
 * You’d usually tackle this in two layers:

Type-level deep immutability (compiler only)

(Optionally) Runtime deep freezing to enforce it at runtime



 */

/**
 * Type-level: DeepReadonly<T>

Start with a recursive mapped type that:

Keeps primitives as-is

Leaves functions as-is

Recursively wraps:

Objects

Arrays

Maps
 */

// Utility type for primitives
type Primitive = string | number | boolean | bigint | symbol | undefined | null;

// Deep readonly
type DeepReadonly<T> =
  // Primitives stay as-is
  T extends Primitive ? T :

  // Functions stay as-is
  T extends (...args: any[]) => any ? T :

  // Arrays and tuples
  T extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepReadonly<U>> :

  // Maps
  T extends Map<infer K, infer V>
    ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>> :

  // Sets
  T extends Set<infer U>
    ? ReadonlySet<DeepReadonly<U>> :

  // Objects
  T extends object
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> } :

  // Fallback
  T;

// Example of above

interface Address {
  city: string;
  pin: number;
}

interface Order {
  id: string;
  items: { name: string; qty: number }[];
}

interface User {
  id: string;
  profile: {
    name: string;
    phones: string[];
    address: Address;
  };
  tags: Set<string>;
  orders: Map<string, Order>;
  log: (...args: string[]) => void;
}

type ImmutableUser = DeepReadonly<User>;

const user: ImmutableUser = /* ... fetched from API ... */ {} as any;

// ❌ All of these will now be compile-time errors:

user.id = "new"; // Error – readonly
user.profile.name = "New Name"; // Error – deep readonly
user.profile.address.city = "Pune"; // Error – deep readonly
user.profile.phones.push("12345"); // Error – no push on readonly array

// @ts-expect-error
user.tags.add("vip"); // Error – readonly set

// ✅ This is still allowed (function is unchanged):
user.log("something happened");

/**
 * Runtime: deepFreeze + DeepReadonly<T>

TypeScript types don’t exist at runtime, so if you also want to enforce immutability in JS land, you can combine:

The DeepReadonly<T> type

A deepFreeze function that uses Object.freeze recursively
 */

function deepFreeze<T>(obj: T): DeepReadonly<T> {
  if (obj === null || typeof obj !== "object") return obj as DeepReadonly<T>;

  // Freeze maps
  if (obj instanceof Map) {
    obj.forEach((value, key) => {
      deepFreeze(key);
      deepFreeze(value);
    });
    return Object.freeze(obj) as DeepReadonly<T>;
  }

  // Freeze sets
  if (obj instanceof Set) {
    obj.forEach((value) => {
      deepFreeze(value);
    });
    return Object.freeze(obj) as DeepReadonly<T>;
  }

  // Freeze arrays & plain objects
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    const value = (obj as any)[prop];
    if (value && (typeof value === "object" || typeof value === "function")) {
      deepFreeze(value);
    }
  });

  return Object.freeze(obj) as DeepReadonly<T>;
}

// Usage

const mutableUser: User = getUserFromBackend();

const immutableUser = deepFreeze(mutableUser);
// immutableUser is now:
//   - Deeply frozen at runtime
//   - DeepReadonly<User> at compile time

// All mutation attempts → runtime error in strict mode + TS error:
immutableUser.profile.address.city = "Mumbai"; // TS error, and runtime throw in strict mode


