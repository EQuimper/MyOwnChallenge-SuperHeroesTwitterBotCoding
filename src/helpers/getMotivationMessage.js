import { getRandom } from './getRandom';
import { quotes } from './quotes';
import { hashtagsToTweets } from './hashtagsToTweets';

export const getMotivationMessage = name => {
  const qt = getRandom(quotes);
  const mess = `@${name} • “${qt.text}” -${qt.author} ${getRandom(hashtagsToTweets)} #coderBot`;

  if (mess.length > 144) {
    getMotivationMessage(name);
  } else {
    return mess;
  }
};
