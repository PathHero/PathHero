'use strict';
// This is an example of the secrets file needed by this app
// Make a copy called secrets.js and fill in the proper values.

module.exports = {
  facebook: {
    clientID: 'FACEBOOK_APP_ID',
    clientSecret: 'FACEBOOK_APP_SECRET',
    callbackUrl: 'http://www.example.com/auth/facebook/callback'
  },
  github: {
    clientID: 'GITHUB_CLIENT_ID',
    clientSecret: 'GITHUB_CLIENT_SECRET',
    callbackUrl: 'http://www.example.com/auth/github/callback'
  },
  google: {
    consumerKey: 'GOOGLE_CONSUMER_KEY',
    consumerSecret: 'GOOGLE_CONSUMER_SECRET',
    callbackUrl: 'http://www.example.com/auth/google/callback'
  },
  twitter: {
    consumerKey: 'TWITTER_CONSUMER_KEY',
    consumerSecret: 'TWITTER_CONSUMER_SECRET',
    callbackUrl: 'http://www.example.com/auth/twitter/callback'
  }
};
