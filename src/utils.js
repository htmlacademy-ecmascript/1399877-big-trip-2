import dayjs from 'dayjs';

export function getRandomInteger(a = 0, b = 1){
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a,b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
}

export function formatStringToDateTime(date) {
  return dayjs(date).format('YYYY-MM-DDTHH:mm');
}

export function getRandomValue(items){
  return items[getRandomInteger(0, items.length - 1)];
}
