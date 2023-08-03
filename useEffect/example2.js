// Incorrect use of useEffect
// Here useEffect is being used for Caching expensive calculations

// 🔴 Avoid: redundant state and unnecessary Effect
function TodoList({ todos, filter }) {
	const [newTodo, setNewTodo] = useState("");

	const [visibleTodos, setVisibleTodos] = useState([]);
	useEffect(() => {
		setVisibleTodos(getFilteredTodos(todos, filter));
	}, [todos, filter]);

	// ...
}

// ✅ This is fine if getFilteredTodos() is not slow.
function TodoList({ todos, filter }) {
	const [newTodo, setNewTodo] = useState("");

	const visibleTodos = getFilteredTodos(todos, filter);
	// ...
}

import { useMemo, useState } from "react";

function TodoList({ todos, filter }) {
	const [newTodo, setNewTodo] = useState("");
	// ✅ Does not re-run getFilteredTodos() unless todos or filter change
	const visibleTodos = useMemo(
		() => getFilteredTodos(todos, filter),
		[todos, filter]
	);
	// ...
}

/**
 * Perform the interaction you’re measuring (for example, typing into the input). You will then see logs like filter array: 0.15ms in your console. If the overall logged time adds up to a significant amount (say, 1ms or more), it might make sense to memoize that calculation. As an experiment, you can then wrap the calculation in useMemo to verify whether the total logged time has decreased for that interaction or not:

 */
