import { getRandomInteger} from '../utils';
import { getDate } from './utils';
import { PRICE } from './const';


export function createPoint(type ,destinationId, offersIds) {
  return {
    id: crypto.randomUUID(),
    type: type,
    dateFrom: getDate(false),
    dateTo: getDate(true),
    basePrice: getRandomInteger(PRICE.MIN, PRICE.MAX),
    isFavorite: !!getRandomInteger(0,1),
    destinationId: destinationId,
    offersIds: offersIds
  };
}
