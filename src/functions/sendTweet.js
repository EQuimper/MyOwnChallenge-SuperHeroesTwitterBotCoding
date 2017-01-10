import { phraseToLook, getRandom, getMotivationMessage, blackListUsers } from '../helpers';
import { tweetIt } from './tweetIt';

export const sendTweet = T => {
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
