require("dotenv").config();
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");
var apiKeys = require("./keys.js");

var client = new Twitter(apiKeys.twitter);
var spotify = new Spotify(apiKeys.spotify);
var nodeArguments = process.argv;
var userSearch = "";

for (var i = 3; i < nodeArguments.length; i++) {
	if (i > 3 && i < nodeArguments.length) {
		userSearch = userSearch + "+" + nodeArguments[i];
	}
  	else {
    	userSearch += nodeArguments[i];
  	}
}
console.log("hi alex" + userSearch);

if (nodeArguments[2] === "my-tweets") {
	tweet();
}
else if (nodeArguments[2] === "spotify-this-song") {
	song();
}
else if (nodeArguments[2] === "movie-this") {
	movie();
}
else if (nodeArguments[2]  === "do-what-it-says") {
	fs.readFile("random.txt", "utf8", function(err, data) {
		if(err) {
			console.log(err);
		}
		else {
			console.log(data);
			var dataArr = data.split(",");
			var command = dataArr[0].trim();
			userSearch = dataArr[1];
			console.log(command);
			console.log(userSearch);
			if (command === "my-tweets") {
			tweet();
			}
			else if (command === "spotify-this-song") {
				song();
			}
			else if (command === "movie-this") {
				movie();
			}
			else {
				console.log("Sorry, only valid commands at this time are: my-tweets, spotify-this-song, movie-this, do-what-it-says")
			}
		}
	});
}

// else {
// 	console.log("Sorry, only valid commands at this time are: my-tweets, spotify-this-song, movie-this, do-what-it-says")
// }

function tweet() {
	var params = {screen_name: "@alexinho2025", count: 20};
	client.get("statuses/user_timeline", params, function(error, tweets, response) {
	if (error) {
		console.log(error);
	}
	else {
		console.log("User: " + tweets[0].user.name);
		console.log("twitter handle: " + tweets[0].user.screen_name);
		console.log("==================================");
			for(var i = 0; i < tweets.length; i++) {
				console.log(tweets[i].text);
				console.log(tweets[i].created_at);
				console.log("==================================");
			}
		}
	});
}

function song() {
	if (userSearch === "") {
		userSearch = "the+sign";
	}
	spotify.search({ type: "track", query: userSearch}, function(err, data) {
		console.log(userSearch);
  		if (err) {
    		console.log('Error occurred: ' + err);
  		}
 		else {
			for(var i = 0; i < data.tracks.items.length; i++) {
				console.log("Artist: " + data.tracks.items[i].artists[0].name);
				console.log("Song: " + data.tracks.items[i].name);
				console.log("Album: " + data.tracks.items[i].album.name);
				console.log("Preview link: " + data.tracks.items[i].href);
				console.log("==================================");
			}
		}
	});
}

function movie() {
	if (userSearch === "") {
		var queryUrl = "http://www.omdbapi.com/?t=Mr+Nobody&y=&plot=short&apikey=trilogy";
	}
	else {
		var queryUrl = "http://www.omdbapi.com/?t=" + userSearch + "&y=&plot=short&apikey=trilogy";
	}

	request(queryUrl, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			console.log("Movie: " + JSON.parse(body).Title);
			console.log("Year: " + JSON.parse(body).Year);
			console.log("IMDB rating: " + JSON.parse(body).Ratings[0].Value);
			console.log("Rotten Tomatoes rating: " + JSON.parse(body).Ratings[1].Value);
			console.log("Country produced: " + JSON.parse(body).Country);
			console.log("Language(s): " + JSON.parse(body).Language);
			console.log("Plot: " + JSON.parse(body).Plot);
			console.log("Actors: " + JSON.parse(body).Actors);
		}
	});
}

