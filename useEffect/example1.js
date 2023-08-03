// When something can be calculated from the existing props or state, don’t put it in state

/**
 * 
 * Instead, calculate it during rendering. 
 * 1. This makes your code faster (you avoid the extra “cascading” updates)
 * 2. simpler (you remove some code)
 * 3. cand less error-prone (you avoid bugs caused by different state variables getting out of sync with each other). 
 */

// Case 1 - Not good
	// 🔴 Avoid: redundant state and unnecessary Effect
function Form() {
	const [firstName, setFirstName] = useState("Taylor");
	const [lastName, setLastName] = useState("Swift");


	const [fullName, setFullName] = useState("");
	useEffect(() => {
		setFullName(firstName + " " + lastName);
	}, [firstName, lastName]);
}

// Case 2 - Better
	// ✅ Good: calculated during rendering
function Form() {
	const [firstName, setFirstName] = useState("Taylor");
	const [lastName, setLastName] = useState("Swift");

	const fullName = firstName + " " + lastName;
	// ...
}
