var Twitter = require('node-twitter');
var mysql = require("mysql");
var sentiment =require("sentiment");
 
const twitterStreamClient = new Twitter.StreamClient(
    	'shGRwhZ6HVP7nTPyNRK9omOiA',
	'HLKXMHTZcf5epg8z7cFKwdMZjbftDi3zghX2pwgUxUaThZNgq5',
	'900854015851982848-8f2d0UXJKWXEe8IY2Ft6QkF2uria4Sz',
    	'rxqX87al2y5gz0vcg1Mjji4CpQNmJIu8hnNj1sanVcVOe'
);
const TwitterDB = mysql.createConnection({
	host: "twitterstreamdb.cyz8buz9jllb.ap-southeast-2.rds.amazonaws.com",
	user: "Twitter",
	password: "Pickles123",
	database:"TwitterStream"
});


TwitterDB.connect(function(err){
		if (err){
			throw err;
		}else{
			//if connection is made do below
			console.log("Connected!");
			try {
    				var MakeTable = "CREATE TABLE Tweets (tweet VARCHAR(255), timestamp VARCHAR(255),sentiment VARCHAR(100))";
				TwitterDB.query(MakeTable, function (err, result) {
					console.log("Table created");
				});
			}
			catch(err) {
    				console.log(err.message);
			}
						twitterStreamClient.start(['a','b','c','e','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']);

			twitterStreamClient.on('tweet', function(tweet) {
				
				if(tweet.lang == 'en'){
					var InsertArray = new Array(3);


					var TweetSentiment = sentiment(tweet.text);

					InsertArray[0] = tweet.text.replace(/'/g, "\\'");
					InsertArray[1] = tweet.created_at;
					InsertArray[2] = TweetSentiment.score;


					var Insertquery = "INSERT INTO Tweets (tweet, timestamp,sentiment) VALUES ('"+ InsertArray[0]+"','"+InsertArray[1]+"','"+ InsertArray[2]+"')";
					TwitterDB.query(Insertquery, function (err, result) {
						if (err) {
							throw err;
						}else{
							console.log("Inserted");
						}

					});
				}else{
					console.log('Rejected non english tweet');
				}



			});
			twitterStreamClient.on('close', function() {
				console.log('Connection closed.');
			});
			twitterStreamClient.on('end', function() {
				console.log('End of Line.');
			});
			twitterStreamClient.on('error', function(error) {
				console.log('Error: ' + (error.code ? error.code + ' ' + error.message : error.message));
			});

	}
});


