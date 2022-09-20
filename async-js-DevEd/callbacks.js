console.log('Start');

function loginUser(email, password, callback) {
	setTimeout(() => {
		console.log('User is now logged in');
		callback({ userEmail: email });
	}, 3000);
}

function getUserVideos(email, callback) {
	setTimeout(() => callback(['a', 'b', 'c']), 3000);
}

function getVideoDetails(video, callback) {
	setTimeout(() => {
		callback('titleFirst');
	}, 3000);
}

const user = loginUser('kshitij@gmail.com', 123, (user) => {
	console.log('User is', user);
	getUserVideos(user.userEmail, (videos) => {
		console.log('Videos are', videos);
		getVideoDetails(videos[0], (title) => {
			console.log('Title of first video is', title);
		});
	});
});
