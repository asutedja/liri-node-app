var Twitter = require('twitter');
var inquirer = require("inquirer");
var continueChat = require("inquirer");
var request = require('request');
var Spotify = require('node-spotify-api');
var keys = require("./keys");
var talkingpoints = require("./talkingpoints");
var omdbRequest = "http://www.omdbapi.com/?apikey=40e9cece&t=";
var name = "";
var randomTalk = "";
var convStart = [
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

function spotifySearch(song) {
	var spotify = new Spotify({
	  id: "35563073063e418aa3673cc30523cc50",
	  secret: "f568229cd07c483d99097e09d419310e"
	});

	spotify.search({ type: 'track', query: song }, function(err, data) {
		if(data == null) {
		  	wrong();
		} else {
			console.log('\n' + "=================================");
		 	console.log("Artist: " + data.tracks.items[0].artists[0].name);
		 	console.log("Song: " + data.tracks.items[0].name);
		 	if (data.tracks.items[0].preview_url == null) {
		 		console.log("Track URL not available")
		 	} else {
		 		console.log("Listen to it here: " + data.tracks.items[0].preview_url);
		 	}
			console.log("Album: " + data.tracks.items[0].album.name);
			console.log("=================================" + '\n');
		}
	});
}

function postTweet(msg) {
	client.post('statuses/update', {status: msg}, function(error, tweet, response) {
	    console.log("You posted: " + tweet.text + ". View all tweets at https://twitter.com/thereal_party!");
	});

	client.get('statuses/user_timeline', {screen_name: 'thereal_party'}, function(error, tweet, response) {
		if(!error) {
			console.log('\n' + "=================================");
			console.log("Your last few tweets:")
			for (let i = 0; i < 10; i++) {
				console.log(tweet[i].text + " - " + tweet[i].created_at);
			}
			console.log("View your tweets at: https://twitter.com/thereal_party")
			console.log("=================================" + '\n');
		}
	});
}

function movieSearch(movie) {
	request(omdbRequest + movie, function (error, response, body) {
	  var film = JSON.parse(body);
	  if (film.Title == null) {
	  	wrong();
	  } else {
	  	  console.log('\n' + "=================================");
		  console.log("Title: " + film.Title);
		  console.log("Year: " + film.Year);
		  console.log("IMDB Rating: " + film.imdbRating);
		  console.log("Country: " + film.Country);
		  console.log("Language: " + film.Language);
		  console.log("Plot: " + film.Plot);
		  console.log("Actors: " + film.Actors);
		  if(film.Ratings == null || film.Ratings.length < 2) {
		  	console.log("Sorry. No reviews available for this film.")
		  } else {
		  console.log(film.Ratings[1].Source + ": " + film.Ratings[1].Value);
		  }
		  console.log("=================================" + '\n');
	  }
	});
}

function wrong() {
	console.log("You mispelled that, or it doesn't exist. Loser.");
}

function randomize(arg) {
	randomTalk = arg[Math.floor(Math.random() * arg.length)];
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
	randomize(convStart);
	continueChat
		.prompt([
			{
				type: "list",
				message: "You wanna do something cool, or just talk " + name + "?",
				choices: ["Something Cool", randomTalk + '\n'],
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
				setTimeout(switchChat, 3000);
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
				setTimeout(switchChat, 3000);
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
				setTimeout(switchChat, 3000);
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
			case talkInput.indexOf("women") != -1 || talkInput.indexOf("girls") != -1:
				randomize(talkingpoints.talkingPoints.women);
				console.log('\n' + "=================================");
				console.log(randomTalk);
				console.log("=================================" + '\n');
				break;
			case talkInput.indexOf("kids") != -1 || talkInput.indexOf("child") != -1:
				randomize(talkingpoints.talkingPoints.kids);
				console.log('\n' + "=================================");
				console.log(randomTalk);
				console.log("=================================" + '\n');
				break;
			case talkInput.indexOf("game") != -1:
				randomize(talkingpoints.talkingPoints.game);
				console.log('\n' + "=================================");
				console.log(randomTalk);
				console.log("=================================" + '\n');
				break;
			case talkInput.indexOf("love") != -1 || talkInput.indexOf("romance") != -1:
				randomize(talkingpoints.talkingPoints.love);
				console.log('\n' + "=================================");
				console.log(randomTalk);
				console.log("=================================" + '\n');
				break;
			case talkInput.indexOf("car") != -1 || talkInput.indexOf("vehicle") != -1:
				randomize(talkingpoints.talkingPoints.cars);
				console.log('\n' + "=================================");
				console.log(randomTalk);
				console.log("=================================" + '\n');
				break;
			default: 
				console.log('\n' + "=================================");
				console.log("I have nothing to say on that matter, but check this out!");
				console.log(`%c ________________________________________
				< Whooooooooooo!!! >
				 ----------------------------------------
				        \\   ^__^
				         \\  (oo)\\_______
				            (__)\\       )\\/\\
				                ||----w |
				                ||     ||`);
				console.log("=================================" + '\n');
				break;
		}
		setTimeout(switchChat, 500);
	});
}