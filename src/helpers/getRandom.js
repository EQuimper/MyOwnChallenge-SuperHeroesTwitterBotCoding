/** @flow */
import type { Quotes } from '../types/Data';

export const getRandom = (arr: Array<Quotes>) =>
  arr[Math.floor(Math.random() * arr.length)];
