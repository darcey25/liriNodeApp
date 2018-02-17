require("dotenv").config();
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");
var apiKeys = require("./keys.js");

// global variables
var logFile = "log.txt";
var client = new Twitter(apiKeys.twitter);
var spotify = new Spotify(apiKeys.spotify);
var nodeArguments = process.argv;
var userSearch = "";

// extracts the song or movie the user wants to search
for (var i = 3; i < nodeArguments.length; i++) {
	if (i > 3 && i < nodeArguments.length) {
		userSearch = userSearch + "+" + nodeArguments[i];
	}
  	else {
    	userSearch += nodeArguments[i];
  	}
}

// calls a specific command depending on the user command input 
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
	doThis();
}


// functions
function tweet() {
	var params = {screen_name: "@alexinho2025", count: 20};
	client.get("statuses/user_timeline", params, function(error, tweets, response) {
	if (error) {
		console.log(error);
	}
	else {
		fs.appendFile(logFile, "\n\nUser: " + tweets[0].user.name,(error)=>{if(error){console.log(error)}});
		fs.appendFile(logFile, "\ntwitter handle: " + tweets[0].user.screen_name,(error)=>{if(error){console.log(error)}});
		fs.appendFile(logFile, "\n==================================",(error)=>{if(error){console.log(error)}});
		console.log("User: " + tweets[0].user.name);
		console.log("twitter handle: " + tweets[0].user.screen_name);
		console.log("==================================");
			for(var i = 0; i < tweets.length; i++) {
				fs.appendFile(logFile, "\n"+tweets[i].text,(error)=>{if(error){console.log(error)}});
				fs.appendFile(logFile, "\n"+tweets[i].created_at,(error)=>{if(error){console.log(error)}});
				fs.appendFile(logFile, "\n==================================",(error)=>{if(error){console.log(error)}});
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
 			fs.appendFile(logFile, "\n\nSong user searched for!\n",(error)=>{if(error){console.log(error)}});
			for(var i = 0; i < data.tracks.items.length; i++) {
				fs.appendFile(logFile, "\nArtist: " + data.tracks.items[i].artists[0].name, (error)=>{if(error){console.log(error)}});
				fs.appendFile(logFile, "\nSong: " + data.tracks.items[i].name, (error)=>{if(error){console.log(error)}});
				fs.appendFile(logFile, "\nAlbum: " + data.tracks.items[i].album.name, (error)=>{if(error){console.log(error)}});
				fs.appendFile(logFile, "\nPreview link: " + data.tracks.items[i].href, (error)=>{if(error){console.log(error)}});
				fs.appendFile(logFile, "\n==================================", (error)=>{if(error){console.log(error)}});
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
			fs.appendFile(logFile, "\n\nMovie: " + JSON.parse(body).Title, (error)=>{if(error){console.log(error)}});
			fs.appendFile(logFile, "\nYear: " + JSON.parse(body).Year, (error)=>{if(error){console.log(error)}});
			fs.appendFile(logFile, "\nIMDB rating: " + JSON.parse(body).Ratings[0].Value, (error)=>{if(error){console.log(error)}});
			fs.appendFile(logFile, "\nRotten Tomatoes rating: " + JSON.parse(body).Ratings[1].Value, (error)=>{if(error){console.log(error)}});
			fs.appendFile(logFile, "\nCountry produced: " + JSON.parse(body).Country, (error)=>{if(error){console.log(error)}});
			fs.appendFile(logFile, "\nLanguage(s): " + JSON.parse(body).Language, (error)=>{if(error){console.log(error)}});
			fs.appendFile(logFile, "\nPlot: " + JSON.parse(body).Plot, (error)=>{if(error){console.log(error)}});
			fs.appendFile(logFile, "\nActors: " + JSON.parse(body).Actors, (error)=>{if(error){console.log(error)}});
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

function doThis() {
	fs.readFile("random.txt", "utf8", function(err, data) {
		if(err) {
			console.log(err);
		}
		else {
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

