var Twitter = require('twitter');
var inquirer = require("inquirer");
var keys = require("./keys");

var inquirer = inquirerResponse;

var client = new Twitter ({
	consumer_key: keys.twitterKeys.consumer_key,
	consumer_secret: keys.twitterKeys.consumer_secret,
	access_token_key: keys.twitterKeys.access_token_key,
	access_token_secret: keys.twitterKeys.access_token_secret
});

function postTweet(msg) {
	client.post('statuses/update', {status: msg}, function(error, tweet, response) {
	  if (!error) {
	    console.log(tweet);
	  }
	});
}

function retrieveTweet() {
	client.get('statuses/user_timeline', {screen_name: 'thereal_party'}, function(error, tweet, response) {
		if(!error) {
			console.log(tweet[0].text);
		}
	});
}

// Create a "Prompt" with a series of questions.
inquirer
  .prompt([
    // Here we create a basic password-protected text prompt.
    {
      type: "list",
      message: "What do you want to do?",
      choices: ["Tweet Stuff", "View Tweets", "Nothing"],
      name: "toDo"
    }
    if (inquirerResponse.toDo === "Tweet Stuff") {
    	type: "input",
    	message: "What would you like to tweet?",
    	name: "tweet"
    }
  ])
  .then(function(inquirerResponse) {
    if (inquirerResponse.toDo === "Tweet Stuff") {
    	postTweet();
    }
  });
