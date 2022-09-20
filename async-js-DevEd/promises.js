console.log('Start');

function loginUser(email, password) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			console.log('User is now logged in');
			resolve({ userEmail: email });
		}, 3000);
	});
}

function getUserVideos(email, callback) {
	return new Promise((resolve, reject) => {
		setTimeout(() => resolve(['a', 'b', 'c']), 3000);
	});
}

function getVideoDetails(video, callback) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve('titleFirst');
		}, 3000);
	});
}

loginUser('kshitij@gmail.com', 123)
	.then((user) => getUserVideos(user.email))
	.then((videos) => getVideoDetails(videos[0]))
	.then((detail) => console.log(detail));

console.log('End');
