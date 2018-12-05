
//reads out the sentence as an object and uses the subject words to define points

var express = require("express");
var app = express();
var mysql = require("mysql");

app.set('view engine', 'pug');
const hostname = '13.210.163.174';
const port = 3000;


app.get("/search/:query", function(req,res){
	var query = '#'+req.params.query;
	var Tweets = [];
	var Sentimentscore = 0;
	
	var IFB299DB = mysql.createConnection({
		host: "twitterstreamdb.cyz8buz9jllb.ap-southeast-2.rds.amazonaws.com",
		user: "Twitter",
		password: "Pickles123",
		database:"TwitterStream"
	});
	// Connect to MySQL database.
	IFB299DB.connect();
	// Do the query to get data.
	
	//IFB299DB.query("SELECT * FROM Tweets where tweet LIKE CONCAT ('%',"+query+",'%'),
	IFB299DB.query("SELECT * FROM Tweets WHERE tweet LIKE '%"+query+"%'" , function(err, rows, fields) {
	  	if (err) {
	  		res.status(500).json({"status_code": 500,"status_message": "internal server error"});
			
	  	} else {
	  		var length = rows.length;
			
	  		for (var i = 0; i < rows.length; i++) {
				
	  			// Create an object to save current row's data
		  		var Tweet = {
		  			'Text':rows[i].tweet,
		  			'Time':rows[i].timestamp
		  		}
		  		// Add object into array
		  		if(i+6> rows.length){
					Tweets.push(Tweet);
				}
				Sentimentscore = Sentimentscore + parseInt(rows[i].sentiment);
				
	  		}
			Sentimentscore = Sentimentscore / rows.length;
			
			res.render('search', {"TWEETS": Tweets,"SearchText":"Search Query: " +query,"Mood":"Sentiment Analysis: "+Sentimentscore});
	  	// Render index.pug page using array 
	  	
	  }
	});
	
	
	 
});

app.get("/", function(req,res){
	var Haters = [];
	var Sentimentscore = 0;
	var ResponseLevel = "";
	
	var IFB299DB = mysql.createConnection({
		host: "twitterstreamdb.cyz8buz9jllb.ap-southeast-2.rds.amazonaws.com",
		user: "Twitter",
		password: "Pickles123",
		database:"TwitterStream"
	});
	// Connect to MySQL database.
	IFB299DB.connect();
	// Do the query to get data.
	
	//IFB299DB.query("SELECT * FROM Tweets where tweet LIKE CONCAT ('%',"+query+",'%'),
	IFB299DB.query("SELECT * FROM Tweets WHERE tweet LIKE '%@realDonaldTrump%'" , function(err, rows, fields) {
	  	if (err) {
	  		res.status(500).json({"status_code": 500,"status_message": "internal server error"});
			console.log(err);
	  	} else {
	  		var length = rows.length;
			
	  		for (var i = 0; i < rows.length; i++) {
				
	  			// Create an object to save current row's data
		  		var Tweet = {
		  			'Text':rows[i].tweet,
		  			'Time':rows[i].timestamp
		  		}
		  		// Add object into array
		  		if(i+6> rows.length){
					Haters.push(Tweet);
				}
				
				Sentimentscore = Sentimentscore + parseInt(rows[i].sentiment);
				
	  		}
			
			Sentimentscore = Sentimentscore / rows.length;
			
			if(Sentimentscore<-2){
				ResponseLevel= "Im being discredited by fake news. Haters everywhere. Even my children need protection. Get the FBI here now. I will personally check all these haters myself after I tweet more about the Korea crisis. Korea is the worst. North Korea that is. No, not South Korea. South Korea is great. They're known for their stuff.. that is... good. Fantastic people. Love them.";
			}else if(Sentimentscore<0){
				ResponseLevel= "Still better than Crooked Hillary. I heard Hillary has tiny hands. What president would have tiny hands? How can you shake hands with the people of this nation with such tiny hands? She has to go somewhere over CHINA to get her hand sized increased other wise they shrink. Bill loves it there too. He likes exploring the Beijing especially, the red-light district. Him and his woman. Can't stop him. Pure Sex-drive. He'll be 100 and still get it up. Fantastic man. Except for marrying a crook. Crooked Hillary. Why did they even marry?";
			}else{
				ResponseLevel= "I can't help it if the masses adore me. I am just fantastic. Fantastic. My wife, Melania,gorgeous woman, says I'm the best president in the world. She is not a liar, I can guarantee that. But do you know who is a liar. Crooked Hillary. So toxic and evil. She got pneumonia because she is absolutley toxic on the inside. Did I forget to mention I have fanastic sized hands. If I wasn't President, I would be the best hand model. No doubt.";
			}
			
			res.render('homepage',{ Pagetitle:'Trump vs the world',HateLevel:"Sentiment score for yours truly: "+ Sentimentscore,Response: ResponseLevel,TrumpTweets:Haters});
	  	
	  }
	});
	
	
	
});

app.get("*", function(req,res){
	res.render('Redirect',{ title:'Whoopsie Doopsie', })
});



app.listen(port, function () {
    console.log(`Express app listening at http://${hostname}:${port}/`);
});

//  netstat -a -o -n
//  taskkill /F /PID ... 