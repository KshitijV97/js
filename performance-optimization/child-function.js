function Parent() {
	const [count, setCount] = useState(0);
	const handleClick = () => setCount(count + 1);

	const Child = () => {
		return <button onClick={handleClick}>+</button>;
	};

	return (
		<div>
			<Child />
		</div>
	);
}

// Above, Every time the parent is re rendered, It will also re define the child component

// Move the child component out of parent and pass the required function as a prop

const Child = ({ handleClick }) => {
	return <button onClick={handleClick}>+</button>;
};

function Parent() {
	const [count, setCount] = useState(0);
	const handleClick = () => setCount(count + 1);

	return (
		<div>
			<Child handleClick={handleClick} />
		</div>
	);
}
