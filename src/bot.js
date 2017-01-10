import Twit from 'twit';
import {
  getFollowedMessage,
  getMotivationMessage,
  blackListUsers,
  phraseToLook,
  getRandom
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
    access_token_secret: process.env.access_token_secret
  });
} else {
  require('dotenv').config();

  T = new Twit({
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    access_token: process.env.access_token,
    access_token_secret: process.env.access_token_secret,
  });
}

console.log('Bot is running...');


const sendTweet = () => {
  console.log('WE RUN');
  const params = {
    q: phraseToLook,
    result_type: 'recent',
    lang: 'en'
  };

  T.get('search/tweets', params, (err, data) => {
    if (err) { return console.log('CANNOT RETWEET'); }
    // let num = 0;
    // Get a random tweet
    let randomName;

    randomName = getRandom(data.statuses).user.screen_name;
    // Check if this is a other bot
    console.log('OLDName', randomName);
    if (blackListUsers.includes(randomName) || new RegExp('bot', 'ig').test(randomName)) {
      console.log('THIS IS A BOT');
      randomName = getRandom(data.statuses).user.screen_name;
      console.log('NEWNAME', randomName);
    }
    return tweetIt(getMotivationMessage(randomName));
  });
};

// Send tweet immediately when app start
sendTweet();
// Send tweet each 6 minutes
setInterval(sendTweet, 60000 * 6);

/*
* TWEET function
* take a txt and tweet it
* stop after for 4 minutes cause of spam
*/
const tweetIt = txt => {
  const tweet = {
    status: txt
  };

  console.log({ tweet });
  console.log('TWEET ON THE WAY');

  T.post('statuses/update', tweet, err => {
    if (err) {
      console.log('SOMETHING WRONG HAPPEN');
    } else {
      console.log('Message Sent!');
    }
  });
};

// Restart the stream and clear the interval
// const callRestart = interval => {
//   streamFilter.start();
//   console.info('STREAM RESTART');
//   clearInterval(interval);
//   console.info('Interval clear');
// };

/*
* GET LIVE UPDATE WITH THE HASHTAG WE SEARCH
*/
// const streamFilter = T.stream('statuses/filter', { track: phraseToLook });

/*
* CHECK LIMIT MESSAGE
*/
// streamFilter.on('limit', limitMessage => {
//   console.log('LIMIT', limitMessage);
//   streamFilter.stop();
//   const int = setInterval(() => callRestart(int), 60000 * 7);
// });

/*
* STREAM EACH TWEET WITH THE HASHTAG SEARCH
*/
// streamFilter.on('tweet', t => {
//   console.log({ t });
//   console.log('NEW TWEET');
//   // Be sure we don't retweet a bot
//   const name = t.user.screen_name;
//   if (blackListUsers.includes(name) || new RegExp('bot', 'ig').test(name)) {
//     console.log('USER BLOCK', name);
//     return;
//   }
//   // Tweet the user with a motivation message
//   tweetIt(getMotivationMessage(name));
// });

/*
* WHEN GET A FOLLOWER
*/
const botStream = T.stream('user');

const getFollowed = e => {
  console.log('GET A FOLLOWER');
  // tweet user with the message on follow
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
* RETWEET THE MOST RECENT USER EACH 15 MINUTES WITH A MOTIVATION
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

    if (blackListUsers.includes(obj.name) || new RegExp('bot', 'ig').test(obj.name)) {
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

setInterval(tweetMostRecentWithMotivation, 60000 * 15);
