'use strict';

var uri = process.env.DBURI || '127.0.0.1:27017/pathhero';
var db = exports.db = require('monk')(uri);
var bcrypt = require('bcrypt-nodejs');

exports.uri = uri;

// Users Collection
// id: username or oauth token
// secret: salted hash or a dummy password if the user authenticated by oauth


// Asynchronous
// Find or create the user
// If no password is provided a dummy one is created
// calls the callback with callback(err, id);
exports.findOrCreateUser = function(id, password, callback) {
  password = password || 'OAUTH';
  bcrypt.hash(password, null, null, function(err, hash) {
    if (err) {
      callback(err);
    } else {
      db.get('Users').findAndModify({
        query: {id: id},
        update: {
          $setOnInsert: {id: id, secret: hash}
        },
        upsert: true
      }).on('complete', function(err) { // ignored params: doc
        callback(err, id);
      });
    }
  });
};

// Asynchronous
// Validate that the username and password are correct
// Used for local authentication
// does not mutate the DB
// calls the callback with callback(err, id, message)
exports.validateUser = function(username, password, callback) {
  db.get('Users').findOne({id: username})
  .on('complete', function(err, doc) {
    if (err) {
      callback(err);
    } else {
      // create a fake password so bycrypt still runs to reduce timing attacks
      if (!doc || !doc.secret) {
        doc.secret = '';
      }
      bcrypt.compare(password, doc.secret, function(err, isMatch) {
        if (err) {
          callback(err);
        } else if (!doc || !isMatch) {
          callback(null, null, 'Incorrect user name or password'); 
        } else {
          callback(null, doc.id, 'success');
        }
      });
    }
  });
};
