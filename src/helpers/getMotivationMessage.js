import { getRandom } from './getRandom';
import { quotes } from './quotes';
import { hashtagsToTweets } from './hashtagsToTweets';

export const getMotivationMessage = name => {
  let mess;
  const qt = getRandom(quotes);
  const ht = getRandom(hashtagsToTweets);
  mess = `@${name} • “${qt.text}” -${qt.author} ${ht} #coderBot`;

  if (mess.length > 144) {
    const smallText = quotes.filter(item => item.text.length < qt.text.length);
    const nGt = getRandom(smallText);
    mess = `@${name} • “${nGt.text}” -${nGt.author} ${ht} #coderBot`;
  }

  console.log('MESSAGE OK');
  return mess;
};
