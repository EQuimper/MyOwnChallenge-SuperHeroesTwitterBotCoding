/** @flow */
import { getRandom } from './getRandom';
import { quotes } from './quotes';
import { hashtagsToTweets } from './hashtagsToTweets';

export const getMotivationMessage = (name: string): string => {
  let mess: string;
  const qt = getRandom(quotes);
  const ht: string = hashtagsToTweets[qt.hashtag];
  mess = `@${name} • “${qt.text}” -${qt.author} ${ht} #coderBot`;

  if (mess.length > 144) {
    const smallText = quotes.filter(item => item.text.length < qt.text.length);
    const nGt = getRandom(smallText);
    mess = `@${name} • “${nGt.text}” -${nGt.author} ${ht} #coderBot`;
  }

  console.log('MESSAGE OK');
  return mess;
};
