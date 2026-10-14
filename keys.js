exports.spotify = {
	id: process.env.SPOTIFY_ID,
	secret: process.env.SPOTIFY_SECRET
};

// "trilogy" is the shared OMDb key from the coding bootcamp; set your own
// (free at https://www.omdbapi.com/apikey.aspx) in .env.
exports.omdb = {
	key: process.env.OMDB_API_KEY || "trilogy"
};
