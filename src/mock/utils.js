import {getRandomInteger} from '../utils.js';
import dayjs from 'dayjs';
import { DURATION } from './const';

let date = dayjs().subtract(getRandomInteger(0, DURATION.DAY), 'day').toDate();

export function getDate(dateValue) {
  const minsGap = getRandomInteger(0, DURATION.MIN);
  const hoursGap = getRandomInteger(1, DURATION.HOUR);
  const daysGap = getRandomInteger(0, DURATION.DAY);

  if (dateValue) {
    date = dayjs(date)
      .add(minsGap, 'minute')
      .add(hoursGap, 'hour')
      .add(daysGap, 'day')
      .toDate();
  }
  return date;
}

export function getRandomItems(items) {
  const copy = [...items];
  const count = getRandomInteger(1, copy.length);

  for (let i = copy.length - 1; i >= 1; i--) {
    const randomIndex = getRandomInteger(0, i);
    const temp = copy[i];
    copy[i] = copy[randomIndex];
    copy[randomIndex] = temp;
  }
  return copy.slice(0, count);
}
