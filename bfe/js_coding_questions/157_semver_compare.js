/**
 * Please implement a function to compare 2 semver strings.

compare('12.1.0', '12.0.9')
// 1, meaning first one is greater

compare('12.1.0', '12.1.2')
// -1, meaning latter one is greater

compare('5.0.1', '5.0.1')
// 0, meaning they are equal.
 */

function parse(semverString) {
	return semverString.split(".").map(Number);
}

/**
 * @param {string} v1
 * @param {string} v2
 * @returns 0 | 1 | -1
 */
function compare(v1, v2) {
	const [major1, minor1, patch1] = parse(v1);
	const [major2, minor2, patch2] = parse(v2);
	if (major1 !== major2) {
		return major1 > major2 ? 1 : -1;
	}

	if (minor1 !== minor2) {
		return minor1 > minor2 ? 1 : -1;
	}

	return patch1 > patch2 ? 1 : patch1 < patch2 ? -1 : 0;
}

