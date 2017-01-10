import { sendTweet } from '../src/functions';
import { phraseToLook } from '../src/helpers';

describe('sendTweet function', () => {
  it('should have a good queries', () => {
    expect(sendTweet().params).toEqual('true');
  });
});
