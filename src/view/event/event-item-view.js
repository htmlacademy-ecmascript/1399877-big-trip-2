import { FORMAT_DATE } from '../../const';
import AbstractView from '../../framework/view/abstract-view';
import { formatStringToShortDate, callcDate , isFavoriteClass} from '../../utils';

function createOffersListTemplate (offers) {
  return offers.map((item) => (
    `
    <li class="event__offer">
      <span class="event__offer-title">${item.title}</span>
        &plus;&euro;&nbsp;
      <span class="event__offer-price">${item.price}</span>
    </li>
    `
  )).join('');
}

function createEventItemTemplate ({point, pointDestination, pointOffer}) {
  const dateFrom = (formatDate) => formatStringToShortDate(point.dateFrom,formatDate);
  const dateTo = (formatDate) => formatStringToShortDate(point.dateTo, formatDate);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFrom(FORMAT_DATE.DATE_ONLY)}">${dateFrom(FORMAT_DATE.DATE)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${point.type} ${pointDestination?.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom(FORMAT_DATE.FULL_DATE_TIME)}">${dateFrom(FORMAT_DATE.TIME)}</time>
              &mdash;
            <time class="event__end-time" datetime="${dateTo(FORMAT_DATE.FULL_DATE_TIME)}">${dateTo(FORMAT_DATE.TIME)}</time>
          </p>
          <p class="event__duration">${callcDate(point.dateFrom, point.dateTo)}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value"> ${point.basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${createOffersListTemplate(pointOffer?.offers)}
        </ul>
        <button class="event__favorite-btn  ${isFavoriteClass(point.isFavorite)}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
}

export default class EventItemView extends AbstractView{
  #point = null;
  #pointDestination = null;
  #pointOffer = null;

  #handleEditClick = null;
  #onFavoriteClick = null;

  constructor (params) {
    super();
    this.#point = params.point;
    this.#pointDestination = params.pointDestination;
    this.#pointOffer = params.pointOffer;

    this.#handleEditClick = params.onEditClick;
    this.#onFavoriteClick = params.onFavoriteClick;

    this.#setInnerHandlers();
  }

  #setInnerHandlers() {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      this.#handleEditClick?.();
    });

    this.element.querySelector('.event__favorite-btn').addEventListener('click', () => {
      this.#onFavoriteClick?.();
    });
  }

  get template () {
    return createEventItemTemplate({
      point: this.#point,
      pointDestination: this.#pointDestination,
      pointOffer: this.#pointOffer
    });
  }
}
