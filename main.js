var request = require('superagent');

let getYoutubeVideoData = async (youtubeVideoId) => {
  const response = await request
    .get('https://www.googleapis.com/youtube/v3/videos')
    .query({id: youtubeVideoId})
    .query({key: process.env.YOUTUBE_API_KEY || "change-me-with-a-valid-youtube-key-if-you-need-me"}) //used only when saving youtube videos
    .query({part: 'snippet,contentDetails,statistics,status'});

  let title = response.body.items[0].snippet.title;
  const tags = response.body.items[0].snippet.tags;
  const description = response.body.items[0].snippet.description;
  const publishedAt = response.body.items[0].snippet.publishedAt;
  const publishedOn = publishedAt.substring(0, publishedAt.indexOf('T'));
  //const videoDuration = formatDuration(response.body.items[0].contentDetails.duration);
  if (title.endsWith('- YouTube')) {
    title = title.replace('- YouTube');
  } else {
    title = title;
  }

  let webpageData = {
    title: title,
    metaDescription: description.substring(0, 500),
    publishedOn: publishedOn,
    //videoDuration: videoDuration
  }

  if(tags) { //some youtube videos might not have tags defined
    webpageData.tags = tags.slice(0,8).map(tag => tag.trim().replace(/\s+/g, '-'));
  }
  
  return webpageData;
}

console.log('Init get info');
//getYoutubeVideoData('4q12HDjWY44').then(function(data) {
//	console.log('Get Info YouTube');
//	console.log(data);
//})

const youtubeVideoId = 'Fyp0VvXbrko';
  if (youtubeVideoId) {
    getYoutubeVideoData(youtubeVideoId).then(function(data) {
	console.log('Get Info YouTube');
	console.log(data);
    });
  } else {
    next();
  }