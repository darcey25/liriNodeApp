// Load API credentials from .env when it exists (Node 20.12+ built-in).
try {
	process.loadEnvFile();
} catch (error) {
	// No .env file; use whatever is already in the environment.
}
var fs = require("fs");
var apiKeys = require("./keys.js");

// global variables
var logFile = "log.txt";
var nodeArguments = process.argv;
var userSearch = nodeArguments.slice(3).join(" ");

// calls a specific command depending on the user command input
runCommand(nodeArguments[2]);

function runCommand(command) {
	if (command === "my-tweets") {
		tweet();
	}
	else if (command === "spotify-this-song") {
		song();
	}
	else if (command === "movie-this") {
		movie();
	}
	else if (command === "do-what-it-says") {
		doThis();
	}
	else {
		console.log("Sorry, only valid commands at this time are: my-tweets, spotify-this-song, movie-this, do-what-it-says");
	}
}

function log(text) {
	fs.appendFile(logFile, text, function(error) {
		if (error) {
			console.log(error);
		}
	});
}

// functions
function tweet() {
	// Twitter (now X) shut down free access to the v1.1 timeline API in 2023,
	// and the "twitter" npm package it used is no longer maintained.
	console.log("my-tweets is no longer available: the Twitter/X API now requires a paid plan.");
}

function getSpotifyToken() {
	var credentials = Buffer.from(apiKeys.spotify.id + ":" + apiKeys.spotify.secret).toString("base64");
	return fetch("https://accounts.spotify.com/api/token", {
		method: "POST",
		headers: {
			"Authorization": "Basic " + credentials,
			"Content-Type": "application/x-www-form-urlencoded"
		},
		body: "grant_type=client_credentials"
	}).then(function(response) {
		if (!response.ok) {
			throw new Error("Spotify login failed (" + response.status + "). Check SPOTIFY_ID and SPOTIFY_SECRET in .env.");
		}
		return response.json();
	}).then(function(data) {
		return data.access_token;
	});
}

function song() {
	if (userSearch === "") {
		userSearch = "the sign";
	}
	console.log(userSearch);
	getSpotifyToken().then(function(token) {
		var url = "https://api.spotify.com/v1/search?type=track&q=" + encodeURIComponent(userSearch);
		return fetch(url, { headers: { "Authorization": "Bearer " + token } });
	}).then(function(response) {
		if (!response.ok) {
			throw new Error("Spotify search failed (" + response.status + ")");
		}
		return response.json();
	}).then(function(data) {
		log("\n\nSong user searched for!\n");
		data.tracks.items.forEach(function(track) {
			var lines = [
				"Artist: " + track.artists[0].name,
				"Song: " + track.name,
				"Album: " + track.album.name,
				"Preview link: " + track.external_urls.spotify,
				"=================================="
			];
			log("\n" + lines.join("\n"));
			console.log(lines.join("\n"));
		});
	}).catch(function(err) {
		console.log("Error occurred: " + err.message);
	});
}

function movie() {
	var title = userSearch === "" ? "Mr. Nobody" : userSearch;
	var queryUrl = "https://www.omdbapi.com/?t=" + encodeURIComponent(title) + "&plot=short&apikey=" + encodeURIComponent(apiKeys.omdb.key);

	fetch(queryUrl).then(function(response) {
		if (!response.ok) {
			throw new Error("OMDb request failed (" + response.status + ")");
		}
		return response.json();
	}).then(function(body) {
		if (body.Response === "False") {
			console.log(body.Error);
			return;
		}
		var ratings = body.Ratings || [];
		var lines = [
			"Movie: " + body.Title,
			"Year: " + body.Year,
			"IMDB rating: " + (ratings[0] ? ratings[0].Value : "N/A"),
			"Rotten Tomatoes rating: " + (ratings[1] ? ratings[1].Value : "N/A"),
			"Country produced: " + body.Country,
			"Language(s): " + body.Language,
			"Plot: " + body.Plot,
			"Actors: " + body.Actors
		];
		log("\n\n" + lines.join("\n"));
		console.log(lines.join("\n"));
	}).catch(function(err) {
		console.log("Error occurred: " + err.message);
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
			userSearch = (dataArr[1] || "").trim().replace(/^"|"$/g, "");
			console.log(command);
			console.log(userSearch);
			if (command === "do-what-it-says") {
				console.log("random.txt can't run do-what-it-says itself.");
				return;
			}
			runCommand(command);
		}
	});
}
