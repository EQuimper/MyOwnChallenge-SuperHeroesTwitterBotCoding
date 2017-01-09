import Twit from 'twit';
import config from './config';
import { quotes } from './quotes';
import { getRandom, getFollowedMessage, getMotivationMessage } from './helpers';
import { hashtagsToReply } from './hashtagsToReply';
import { hashtagsToTweets } from './hashtagsToTweets';

const phraseToLook = ['#100DaysOfCode'];
const blackListUser = ['_100DaysOfCode', 'heroes_bot'];
const { consumer_key, consumer_secret, access_token, access_token_secret } = config;

/*
* INIT THE BOT
*/
const T = new Twit({
  consumer_key,
  consumer_secret,
  access_token,
  access_token_secret,
  timeout_ms: 60*1000
});

console.log('Bot is running...');

/*
* TWEET function
*/
const tweetIt = txt => {
  const tweet = {
    status: txt
  };

  console.log({ tweet });

  T.post('statuses/update', tweet, (err, data, res) => {
    if (err) {
      console.log('SOMETHING WRONG HAPPEN');
    } else {
      console.log('Message Sent!');
    }
  })
    .then(() => {
      streamFilter.stop();
      setTimeout(() => streamFilter.start(), 60000);
    });
};

/*
* GET LIVE UPDATE WITH THE HASHTAG WE SEARCH
*/
const streamFilter = T.stream('statuses/filter', { track: phraseToLook })

streamFilter.on('tweet', t => {
  console.log('NEW TWEET');
  // Be sure we don't retweet a bot
  if (blackListUser.includes(t.user.screen_name)) {
    console.log('USER BLOCK', t.user.screen_name);
    return;
  }
  tweetIt(getMotivationMessage(t.user.screen_name));
});

const botStream = T.stream('user');

const getFollowed = e => {
  console.log('GET A FOLLOWER');
  tweetIt(getFollowedMessage(e.source.screen_name));
}

botStream.on('follow', getFollowed)
