import Twit from 'twit';
import config from './config';

const { consumer_key, consumer_secret, access_token, access_token_secret } = config;

var T = new Twit({
  consumer_key,
  consumer_secret,
  access_token,
  access_token_secret,
  timeout_ms: 60*1000
});

console.log('Bot is running...');
