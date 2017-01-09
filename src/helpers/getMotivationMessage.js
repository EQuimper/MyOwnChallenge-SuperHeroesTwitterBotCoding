import { getRandom } from './getRandom';

export const getMotivationMessage = name => {
  let mess;
  const qt = getRandom(quotes);
  mess = `@${name} • “${qt.text}” -${qt.author} ${getRandom(hashtagsToTweets)} #coderBot`;

  if (mess.length > 144) {
    getMotivationMessage(name);
  } else {
    return mess;
  }
}
