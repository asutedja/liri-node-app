var Twitter = require('twitter');
var inquirer = require("inquirer");
var Spotify = require('node-spotify-api');
var keys = require("./keys");

var client = new Twitter ({
	consumer_key: keys.twitterKeys.consumer_key,
	consumer_secret: keys.twitterKeys.consumer_secret,
	access_token_key: keys.twitterKeys.access_token_key,
	access_token_secret: keys.twitterKeys.access_token_secret
});

var spotify = new Spotify({
  id: "35563073063e418aa3673cc30523cc50",
  secret: "f568229cd07c483d99097e09d419310e"
});

function postTweet(msg) {
	client.post('statuses/update', {status: msg}, function(error, tweet, response) {
	  if (!error) {
	    console.log("You posted: " + tweet.text + ". View all tweets at https://twitter.com/thereal_party!");
	  }
	});

	client.get('statuses/user_timeline', {screen_name: 'thereal_party'}, function(error, tweet, response) {
		if(!error) {
			console.log("Your last few tweets:")
			for (let i = 0; i < 4; i++) {
				console.log(tweet[i].text + " - " + tweet[i].created_at);
			}
		}
	});
}

function spotifySearch(song) {
	spotify.search({ type: 'track', query: song }, function(err, data) {
	  if (err) {
	    return console.log('Error occurred: ' + err);
	  }
	  	
	 	console.log("Artist: " + data.tracks.items[0].artists[0].name);
	 	console.log("Song: " + data.tracks.items[0].name);
	 	console.log("Listen to it here: " + data.tracks.items[0].preview_url);
		console.log("Album: " + data.tracks.items[0].album.name); 
	});
}

// Create a "Prompt" with a series of questions.
inquirer
  .prompt([
    // Here we create a basic password-protected text prompt.
    {
      type: "input",
      message: "Hi! My name is Leery! The simplest and most perverted bot! What is your name?",
      name: "name"
    },
    {
      type: "list",
      message: "What do you want to do?",
      choices: ["Tweet Stuff", "Listen to Tunes", "Look up a movie", "Nothing"],
      name: "toDo"
    },
    {
    	type: "input",
    	message: "Type in a value!",
    	name: "value"
    }
  ])
  .then(function(inquirerResponse) {
  	var inquirer = inquirerResponse;
    if (inquirer.toDo === "Tweet Stuff") {
    	postTweet(inquirer.value);
    } else if (inquirer.toDo === "Listen to Tunes") {
		spotifySearch(inquirer.value);
    } else {
    	console.log("Well... here's something you to look at: ( o )( o )");
    }
  });
