'use strict';
var secrets;
try {
  secrets = require('./secrets');
}
catch(err) {
  secrets = {};
}

var facebook = secrets.facebook || {
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackUrl: 'http://create.pathhero.com/login/facebook/'
};

var github = secrets.github || {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackUrl: 'http://create.pathhero.com/login/github/'
};

var google = secrets.google || {
  consumerKey: process.env.GOOGLE_CONSUMER_KEY,
  consumerSecret: process.env.GOOGLE_CONSUMER_SECRET,
  callbackUrl: 'http://create.pathhero.com/login/google/'
};

var twitter = secrets.twitter || {
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackUrl: 'http://create.pathhero.com/login/twitter/'
};

var sessionKey = secrets.sessionKey || process.env.SESSION_KEY;

module.exports = {
  domain: 'pathhero.com',
  createSubdomain: 'create',
  playSubdomain: 'play',
  facebook: facebook,
  github: github,
  google: google,
  twitter: twitter,
  sessionKey: sessionKey
};
