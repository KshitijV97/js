function binarySearch(arr, val) {
	let i = 0;
	let j = arr.length - 1;
	while (i <= j) {
		let mid = i + Math.floor((j - i) / 2);

		if (val === arr[mid]) return mid;
		if (val < arr[mid]) {
			j = mid - 1;
		}
		if (val > arr[mid]) {
			i = mid + 1;
		}
	}
	return -1;
}
