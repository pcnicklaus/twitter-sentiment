//includes
var util = require('util');
var twitter = require('twitter');
var sentimentAnalysis = require('./sentimentAnalysis');
var db = require('diskdb');

db = db.connect('db', ['sentiments']);

//config
var config = {
  consumer_key: 'tunpZqKR5uZkS5C3yAZyb4gTh',
  consumer_secret: 'utGJcRZLNasgZEEseXbGbBVyggk6Dv0EVPh5zWsQUdQOwnsGcA',
  access_token_key: '1636189436-3HtmLXcmg8nHgxVWU0PjjQHlACQtw7hj6mW8Uu8',
  access_token_secret: 's8gIwDwVzWuuA1XYmoafV9Q0bzZUqnyG8u4SVkT740FK0'
};

module.exports = function(text, callback) {
  var twitterClient = new twitter(config);
  var response = [], dbData = []; // to store the tweets and sentiment
  twitterClient.search(text, function(data) {
    for (var i = 0; i < data.statuses.length; i++) {
      var resp = {};
      resp.tweet = data.statuses[i];
      resp.sentiment = sentimentAnalysis(data.statuses[i].text);
      dbData.push({
        "tweet" : resp.tweet.text,
        "score" : resp.sentiment.score
      });
      response.push(resp);
    }
    db.sentiments.save(dbData);
    callback(response);
  });
};
