import Twit from 'twit';
import {
  getFollowedMessage,
  getMotivationMessage,
  blackListUsers,
  phraseToLook,
  getRandom,
  handleError
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

const sendTweet = async motivation => {
  const params = {
    q: phraseToLook,
    result_type: 'recent',
    lang: 'en'
  };
  console.log(params);
  let api;

  try {
    api = await T.get('search/tweets', params);
  } catch (err) {
    handleError(err);
  }

  const randomName = getRandom(api.data.statuses).user.screen_name;

  console.log('THE NAME', randomName);

  if (blackListUsers.indexOf(randomName) !== -1 || new RegExp('bot', 'ig').test(randomName)) {
    console.log('THIS IS A BOT');
    return;
  }

  if (motivation) {
    console.log('MOTIVATION');
    return tweetIt(getMotivationMessage(randomName));
  }

  console.log('SUPERCODER');
  const mess = `@${randomName} is one of the #supercoder of the day. Good work. #100DaysOfCode #301DaysOfCode`;
  return tweetIt(mess);
};

// Send tweet immediately when app start
sendTweet(true);
// Send tweet each 30 minutes
setInterval(() => sendTweet(true), 60000 * 30);

// Tweet about supercoder every 40 minutes
setInterval(sendTweet, 60000 * 40);

// Take txt and tweet it
const tweetIt = async txt => {
  console.log({ txt });
  console.log('TWEET ON THE WAY');

  try {
    await T.post('statuses/update', { status: txt });
    console.log('TWEET SENT');
  } catch (err) {
    handleError(err);
  }
};

// ===============================
//          GET A FOLLOWER
// ===============================
const botStream = T.stream('user');

const getFollowed = e => {
  console.log('GET A FOLLOWER');
  // tweet user with the message on follow
  tweetIt(getFollowedMessage(e.source.screen_name));
};

botStream.on('follow', getFollowed);

// Connect
// botStream.on('connect', console.log('CONNECTED'));

// Reconnect
botStream.on('reconnect', (req, res, connectInterval) => {
  console.log('Reconnect');
  console.log(req);
  console.log(res);
  console.log(connectInterval);
});

// Limit
botStream.on('limit', mess => console.log('Limit', mess));
