// var request = require('superagent');

// let getYoutubeVideoData = async (youtubeVideoId) => {
//   const response = await request
//     .post('https://www.googleapis.com/youtube/v3/commentThreads')
//     .query({key: process.env.YOUTUBE_API_KEY || "change-me-with-a-valid-youtube-key-if-you-need-me"}) //used only when saving youtube videos
//     .query({snippet:{'videoId': youtubeVideoId,'topLevelComment':{'snippet':{'textOriginal':'* Master SEO *'}}}})
//     //.query({snippet: });
//     //.query({part: 'snippet,contentDetails,statistics,status'});
//     .query({part: 'snippet'});

//   //const videoDuration = formatDuration(response.body.items[0].contentDetails.duration);
//   // {{'snippet':{'videoId':'Fyp0VvXbrko','topLevelComment':{'snippet':{'textOriginal':"Master SEO"}}}}}
  
//   return response;
// }

// console.log('Init get info');
// //getYoutubeVideoData('4q12HDjWY44').then(function(data) {
// //	console.log('Get Info YouTube');
// //	console.log(data);
// //})

// const youtubeVideoId = 'Fyp0VvXbrko';
//   if (youtubeVideoId) {
//     getYoutubeVideoData(youtubeVideoId).then(function(data) {
// 	console.log('Get Info YouTube');
// 	console.log(data);
//     });
//   } else {
//     next();
//   }


// oauth2Client.setCredentials({
//   refresh_token: "REFRESH_TOKEN"
// });
var service = require('./quickstart.js');
var quotes = require('./quotes-seo.json');
var words = require('./words.json');
var sleep = require('sleep');

//console.log(quote);
/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function mainQuotes() {
	console.log('Init service YT');
	service.getAuth().then(function(auth) {
	console.log('Auth', auth);
	for (var i = quotes.length - 1; i >= 0; i--) {
		const element = quotes[i];
		const waitTime = getRandomArbitrary(1,10);
		const msg = element.quote.concat(' - ').concat(element.author).concat('*');
		 service.addComment(auth, "Fyp0VvXbrko", msg).then(function(responseC) {
  		  console.log('waitTime', waitTime, 'Insert Comment', responseC);
  		  sleep.sleep(waitTime);
  		}).catch(function(err){
  			console.log(err);
  		});
	}
	//quotes.forEach(element => { }); 

	//service.addComment(auth, "Fyp0VvXbrko", "********* SEO SUPREME 2020****");
	});
}

function wait(milleseconds) {
  return new Promise(resolve => setTimeout(resolve, milleseconds))
}

function mainWords() {
console.log('Init service YT Words');
service.getAuth().then(function(auth) {
	console.log('Auth', auth);
	const wordsList = Object.keys(words);
	for (var i = 10000 ; i >= 0; i--) {
	 const wordRand = getRandomArbitrary(1, 400000);
	 const waitTime = getRandomArbitrary(1,100);
	 const element = wordsList[wordRand];
	 //const waitd = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
	 const msg = 'SEO MASTER'.concat(' -- random: ').concat(element).concat(' --*');
	 	service.addComment(auth, "Fyp0VvXbrko", msg).then(function(responseC) {
	 	console.log(i, 'waitTime', waitTime, 'Insert Comment', msg);
  		console.log('Comment status:', responseC);
  		sleep.sleep(waitTime);
  		console.log('End Turn');
  		}).catch(function(err){
  			console.log(err);
  		});
	}
	console.log('End Loop');

});
}

mainWords();

