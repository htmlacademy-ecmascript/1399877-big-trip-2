import { TYPES } from '../const';
import { createDestinations } from '../mock/destinations';
import { createOffers } from '../mock/offers';
import { createPoint } from '../mock/point';
import { getRandomValue } from '../utils';

export default class Service {
  constructor () {
    this.destination = this.generateDestinations();
    this.offers = this.generateOffers();
    this.points = this.generatePoints();
  }

  generateOffers () {
    return createOffers();
  }

  generateDestinations () {
    return createDestinations();
  }

  generatePoints () {
    const type = getRandomValue(TYPES);
    const typeOfffers = this.offers.find((offerType) => offerType.type === type);
    const destinationId = getRandomValue(this.destination).id;
    const offersId = typeOfffers.offers.map(({id}) => id);
    return createPoint(type, destinationId, offersId);
  }

  getDestination () {
    return this.destination;
  }

  getOffers () {
    return this.offers;
  }

  getPoints () {
    return this.points;
  }
}
