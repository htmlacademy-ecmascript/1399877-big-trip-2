import { getRandomInteger } from '../utils';
import { PRICE } from './const';

export function createOffer (type, title) {
  return {
    id: crypto.randomUUID(),
    type: type,
    title: title,
    price: getRandomInteger(PRICE.MIN, PRICE.MAX)
  };
}
