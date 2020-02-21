var fs = require('fs');
var readline = require('readline');
var {google} = require('googleapis');
var OAuth2 = google.auth.OAuth2;

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/youtube-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl'];

 var TOKEN_DIR = './.credentials/';
 var TOKEN_PATH = TOKEN_DIR + 'youtube-nodejs-quickstart.json';

const getAuth = async () => {

// var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + '/.credentials/';
// var TOKEN_PATH = TOKEN_DIR + 'youtube-nodejs-quickstart.json';


	//console.log('TOKEN', TOKEN_DIR, TOKEN_PATH);
	// Load client secrets from a local file.
	return new Promise(function(resolve, reject) { 
	
	fs.readFile('client_secret.json', function processClientSecrets(err, content) {
	  if (err) {
	    console.log('Error loading client secret file: ' + err);
	    reject(err);
	  }


	  //resolve(content);
	  //console.log('Client Secret', JSON.parse(content));
	  // Authorize a client with the loaded credentials, then call the YouTube API.
	    authorize(JSON.parse(content)).then(function(authResponse) {
	    	resolve(authResponse);
	   });
	});
	})

	
}


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
const authorize = async (credentials) => {
//console.log('authorize -->', credentials);
  var clientSecret = credentials.web.client_secret;
  var clientId = credentials.web.client_id;
  //var redirectUrl = credentials.web.redirect_uris[0];
  var redirectUrl = credentials.web.redirect_uris[0];
  var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);  
  //var oauth2Client = new OAuth2(clientId, clientSecret);

	return new Promise(function(resolve, reject) { 
  //Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client);
      reject();
    } else {
      oauth2Client.credentials = JSON.parse(token);
      resolve(oauth2Client);
      //callback(oauth2Client);
    }
  });

	});
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      //callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    if (err) throw err;
    console.log('Token stored to ' + TOKEN_PATH);
  });
}

/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function getChannel(auth) {
  var service = google.youtube('v3');
  service.channels.list({
    auth: auth,
    part: 'snippet,contentDetails,statistics',
    forUsername: 'GoogleDevelopers'
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var channels = response.data.items;
    if (channels.length == 0) {
      console.log('No channel found.');
    } else {
      console.log('This channel\'s ID is %s. Its title is \'%s\', and ' +
                  'it has %s views.',
                  channels[0].id,
                  channels[0].snippet.title,
                  channels[0].statistics.viewCount);
    }
  });
}

/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
 const addComment = async (auth, videoId, textMessage ) => {
  var service = google.youtube('v3');
  var params = {
    auth: auth,
    part: "snippet",
    resource: {
      snippet: {
        videoId: videoId,
      topLevelComment: {
        snippet: {
          textOriginal: textMessage
        }
      }
    }
  }
};

	return new Promise(function(resolve, reject) { 
  service.commentThreads.insert(params, function(err, data) {
	  if (err) {
	    console.log(err);
	    reject(err);
	    //res.status(400).send("Error posting comment ");
	  }
	  else {
	  	//console.log(data);
	    console.log('Comment OK');
	    resolve(true);
	    //console.log(data);
	    //res.status(200).send("Successfully posted comment ");
	  }
	});
  });
}

function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

exports.getAuth = getAuth;
exports.addComment = addComment;
exports.sleep = sleep;