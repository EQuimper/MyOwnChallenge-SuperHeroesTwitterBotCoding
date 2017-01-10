export const tweetIt = (T, txt) => {
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
