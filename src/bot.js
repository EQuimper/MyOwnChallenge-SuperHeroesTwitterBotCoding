import Twit from 'twit';
import jsonfile from 'jsonfile';
import config from './config';
import { quotes } from './quotes';
import { getRandomQuotes } from './helpers';

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

const getMess = name => {
  let mess;
  const qt = getRandomQuotes(quotes);
  mess = `@${name} • "${qt.text}" -${qt.author} #goodJob #coderBot`;

  if (mess.length > 144) {
    getMess(name);
  } else {
    return mess;
  }
}

/*
* TWEET function
*/
const tweetIt = name => {
  const tweet = {
    status: getMess(name)
  };
  T.post('statuses/update', tweet, (err, data, res) => {
    console.log({ err, data, res });
  });
};

/*
* GET LIVE UPDATE WITH THE HASHTAG WE SEARCH
*/
const stream = T.stream('statuses/filter', { track: phraseToLook })

stream.on('tweet', t => {
  console.log('NEW TWEET');

  // Be sure we don't retweet a bot
  if (blackListUser.includes(t.user.screen_name)) {
    console.log('USER BLOCK', t.user.screen_name);
    return;
  }

  tweetIt(t.user.screen_name);
});
