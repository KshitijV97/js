export const defaultEquals = <T>(a: T, b: T): boolean => {
	return a === b;
};

export interface EqualsFunction<T> {
	(a: T, b: T): boolean;
}
