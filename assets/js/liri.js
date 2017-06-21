var Twitter = require('twitter');
var inquirer = require("inquirer");
var continueChat = require("inquirer");
var request = require('request');
var Spotify = require('node-spotify-api');
var keys = require("./keys");
var omdbRequest = "http://www.omdbapi.com/?apikey=40e9cece&t=";
var name = "";
var randomTalk = "";
var talkingPoints = [
	"Nah, I just wanna talk about FEELINGS", 
	"Let's Talk :)",
	"Just wanna shoot the breeze",
	"Let's talk BRO!",
	"Yeah, let's talk"
];

var cycle = 0;
var e = 0; // Number of Cycles

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
	    console.log("You posted: " + tweet.text + ". View all tweets at https://twitter.com/thereal_party!");
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
	if (cycle >= 1) {
		console.log("You can't look up music any more!")
	} else {
	  spotify.search({ type: 'track', query: song }, function(err, data) {
		  if(data == null) {
		  	console.log("You mispelled that, or it doesn't exist. Loser.")
		  } else {
		 	console.log("Artist: " + data.tracks.items[0].artists[0].name);
		 	console.log("Song: " + data.tracks.items[0].name);
		 	console.log("Listen to it here: " + data.tracks.items[0].preview_url);
			console.log("Album: " + data.tracks.items[0].album.name); 
		  }
	  });
	}
	cycle++;
}

function movieSearch(movie) {
	request('http://www.omdbapi.com/?apikey=40e9cece&t=' + movie, function (error, response, body) {
	  var film = JSON.parse(body);
	  if (film.Title == null) {
	  	wrong();
	  } else {
		  console.log("Title: " + film.Title);
		  console.log("Year: " + film.Year);
		  console.log("IMDB Rating: " + film.imdbRating);
		  console.log("Country: " + film.Country);
		  console.log("Language: " + film.Language);
		  console.log("Plot: " + film.Plot);
		  console.log("Actors: " + film.Actors);
	  }
	});
}

function wrong() {
	console.log("You mispelled that, or it doesn't exist. Loser.");
}

function randomize() {
	randomTalk = talkingPoints[Math.floor(Math.random() * talkingPoints.length)];
}
// Create a "Prompt" with a series of questions.
inquirer
  .prompt([
    // Here we create a basic password-protected text prompt.
    {
      type: "input",
      message: "Hi! My name is Leery! The simplest and most perverted bot! What is your name?",
      name: "name"
    }
  ])
  .then(function(inquirerResponse) {
  	name = inquirerResponse.name;
  	console.log("Nice to meet you " + name + "!");
  	switchChat();
  });

function switchChat() {
	randomize();
	continueChat
		.prompt([
			{
				type: "list",
				message: "You wanna do something cool, or just talk " + name + "?",
				choices: ["Something Cool", randomTalk],
				name: "switch"
			}
		])
		.then(function(promptResponse) {
			if(promptResponse.switch === "Something Cool") {
				console.log("Sweet!");
				setTimeout(followChat, 500);
			} else {
				console.log("OK. We can talk about feelings...");
				setTimeout(justTalk, 500);
			}
		});
		e++;
}

function followChat() {
  continueChat 
  	.prompt([
  		{
  		  type: "list",
  		  message: "What do you want to do " + name + "?",
  		  choices: ["Tweet Stuff", "Listen to Tunes", "Look up a movie"],
  		  name: "toDo"
  		}
  	])
  	.then(function(promptResponse) {
	    if (promptResponse.toDo === "Tweet Stuff") {
	    	lookUp("tweet");
	    } else if (promptResponse.toDo === "Listen to Tunes") {
			lookUp("tunes");
	    } else {
	    	lookUp("movie");
	    }
  	});
};

function lookUp(msg) {
	if (msg === "tweet") {
		continueChat
			.prompt([
				{
					type: "input",
					message: "What would you like to tweet?",
					name: "tweet"
				}
			])
			.then(function(promptResponse) {
				postTweet(promptResponse.tweet);
				setTimeout(switchChat, 500);
			});
	} else if (msg === "tunes") {
		continueChat
			.prompt([
				{
					type: "input",
					message: "What music are you looking for?",
					name: "tunes"
				}
			])
			.then(function(promptResponse) {
				spotifySearch(promptResponse.tunes);
				setTimeout(switchChat, 1500);
			});
	} else {
		continueChat
			.prompt([
				{
					type: "input",
					message: "What movie are you looking for?",
					name: "movie"
				}
			])
			.then(function(promptResponse) {
				movieSearch(promptResponse.movie);
				setTimeout(switchChat, 1500);
			});
	}
}

function justTalk() {
	continueChat
	.prompt([
		{
			type: "input",
			message: "What do you wanna talk about " + name + "?",
			name: "talk_about"
		}
	])
	.then(function(promptResponse) {
		var talkInput = promptResponse.talk_about.toLowerCase();

		switch(true) {
			case talkInput.indexOf("women") != -1:
				console.log("Yeah, women cause all sorts of problems.");
				break;
			case talkInput.indexOf("kids") != -1:
				console.log("Yeah, kids suck. No one needs them.");
				break;
			case talkInput.indexOf("games") != -1:
				console.log("I really hate games of all kinds.");
				break;
			case talkInput.indexOf("love") != -1:
				console.log("I am a bot, but I feel like I love you.");
				break;
			default: 
				console.log("Yeah, can't help you much there...");
				break;
		}
		setTimeout(switchChat, 500);
	});
}