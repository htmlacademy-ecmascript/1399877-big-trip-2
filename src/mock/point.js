import {getRandomInteger, getRandomValue, formatStringToDateTime} from '../utils';
import {getDate} from './utils';
import TYPES from '../const';
import { PRICE } from './const';


export function createPoint(destinationId, offersIds) {
  return {
    id: crypto.randomUUID(),
    type: getRandomValue(TYPES),
    dateFrom: formatStringToDateTime(getDate(false)),
    dateTo: formatStringToDateTime(getDate(true)),
    basePrice: getRandomInteger(PRICE.MIN, PRICE.MAX),
    isFavorite: !!getRandomInteger(0,1),
    destinationId: destinationId,
    offersIds: offersIds
  };
}
