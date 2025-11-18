import { TYPES } from '../const';
import { getRandomInteger } from '../utils';
import { PRICE, TYPE_OFFERS } from './const';

function createOffersGroupByType (type) {

  const typeOffersTitles = TYPE_OFFERS[type];

  return typeOffersTitles.map((item) => ({

    id: crypto.randomUUID(),
    title: item,
    price: getRandomInteger(PRICE.MIN, PRICE.MAX)
  }));
}

export function createOffers () {
  return TYPES.map((offerType) => ({
    type: offerType,
    offers: createOffersGroupByType(offerType)
  }));
}
