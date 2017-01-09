import Twit from 'twit';
import {
  getFollowedMessage,
  getMotivationMessage,
  blackListUsers,
  phraseToLook
} from './helpers';

/*
* INIT THE BOT
*/
let T;
if (process.env.NODE_ENV === 'production') {
  T = new Twit({
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    access_token: process.env.access_token,
    access_token_secret: process.env.access_token_secret,
    timeout_ms: 60 * 1000
  });
} else {
  require('dotenv').config();

  T = new Twit({
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    access_token: process.env.access_token,
    access_token_secret: process.env.access_token_secret,
    timeout_ms: 60 * 1000
  });
}

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
  })
    .then(() => {
      console.log('STOP FOR 2 MINUTES');
      streamFilter.stop();
      const int = setInterval(() => callRestart(int), 60000 * 2);
    });
};

// Restart the stream and clear the interval
const callRestart = interval => {
  streamFilter.start();
  console.info('STREAM RESTART');
  clearInterval(interval);
  console.info('Interval clear');
};

/*
* GET LIVE UPDATE WITH THE HASHTAG WE SEARCH
*/
const streamFilter = T.stream('statuses/filter', { track: phraseToLook });

streamFilter.on('tweet', t => {
  console.log({ t });
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
// * WHEN GET A QUOTED ON A TWEET
// */
// const quotedStream = T.stream('user');

// const getQuoted = e => {
//   console.log('GET A QUOTED');
//   console.log({ e });
// };

// quotedStream.on('quoted_tweet', getQuoted);

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
    let num = 0;
    let obj = {
      id: data.statuses[num].id,
      name: data.statuses[num].user.screen_name
    };

    if (blackListUsers.includes(obj.name)) {
      num++;
      obj = {
        id: data.statuses[num].id,
        name: data.statuses[num].user.screen_name
      };
    }

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
