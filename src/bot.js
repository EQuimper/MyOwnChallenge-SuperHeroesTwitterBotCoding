import Twit from 'twit';
import config from './config';
import {
  getFollowedMessage,
  getMotivationMessage,
  blackListUsers,
  hashtagsToReply,
  phraseToLook
} from './helpers';

const { consumer_key, consumer_secret, access_token, access_token_secret } = config;

/*
* INIT THE BOT
*/
const T = new Twit({
  consumer_key,
  consumer_secret,
  access_token,
  access_token_secret,
  timeout_ms: 60 * 1000
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

  T.post('statuses/update', tweet, err => {
    if (err) {
      console.log('SOMETHING WRONG HAPPEN');
    } else {
      console.log('Message Sent!');
    }
  });
};

/*
* GET LIVE UPDATE WITH THE HASHTAG WE SEARCH
*/
const streamFilter = T.stream('statuses/filter', { track: phraseToLook });

streamFilter.on('tweet', t => {
  console.log('NEW TWEET');
  // Be sure we don't retweet a bot
  if (blackListUsers.includes(t.user.screen_name)) {
    console.log('USER BLOCK', t.user.screen_name);
    return;
  }
  tweetIt(getMotivationMessage(t.user.screen_name));
});

/*
* WHEN GET A FOLLOWER
*/
const botStream = T.stream('user');

const getFollowed = e => {
  console.log('GET A FOLLOWER');
  tweetIt(getFollowedMessage(e.source.screen_name));
};

botStream.on('follow', getFollowed);

/*
* WHEN GET A QUOTED ON A TWEET
*/
const quotedStream = T.stream('user');

const getQuoted = e => {
  console.log('GET A QUOTED');
  console.log({ e });
};

quotedStream.on('quoted_tweet', getQuoted);

/*
* RETWEET THE MOST RECENT USER EACH 10 MINUTE WITH A MOTIVATION
*/
const tweetMostRecentWithMotivation = () => {
  const params = {
    q: phraseToLook,
    result_type: 'recent',
    lang: 'en'
  };

  T.get('search/tweets', params, (err, data) => {
    console.log('CHECK TWEET');
    if (err) { return console.log('CANNOT RETWEET'); }
    const obj = {
      id: data.statuses[0].id,
      name: data.statuses[0].user.screen_name
    };

    const tweet = {
      status: `@${obj.name} is one of the #supercoder of the day. Good work. #100DaysOfCode.`,
      in_reply_to_status_id: obj.id,
    };

    console.log('RETWEET');
    console.log({ tweet });

    T.post('statuses/update', tweet, err => {
      console.log({ err });
    });
  });
};

setInterval(tweetMostRecentWithMotivation, 60000 * 10);
