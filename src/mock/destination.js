import { getRandomInteger, getRandomValue } from '../utils';
import { CITIES, DESCRIPTIONS } from './const';
import { getRandomItems } from './utils';

function createPictures () {
  const count = getRandomInteger(1,5);
  const pictures = [];
  for(let i = 0; i < count; i++) {
    pictures.push({
      src: `https://loremflickr.com/300/200?random=${getRandomInteger(1,100)}.jpg`,
      description: getRandomValue(DESCRIPTIONS)
    });
  }
  return pictures;
}

export function createDestination() {
  return {
    id: crypto.randomUUID(),
    name: getRandomValue(CITIES),
    description: getRandomItems(DESCRIPTIONS).join(' '),
    pictures: createPictures()
  };
}
