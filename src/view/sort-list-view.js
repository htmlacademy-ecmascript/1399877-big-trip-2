import AbstractView from '../framework/view/abstract-view';
import { SORT_TYPE } from '../const';

function createSortListTemplate(currentSort) {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
        <div class="trip-sort__item  trip-sort__item--day">
          <input id="sort-day" class="trip-sort__input visually-hidden"
            type="radio" name="trip-sort" value="${SORT_TYPE.DAY}"
            ${currentSort === SORT_TYPE.DAY ? 'checked' : ''}>
          <label class="trip-sort__btn" for="sort-day" data-sort-type="${SORT_TYPE.DAY}">Day</label>
        </div>

        <div class="trip-sort__item  trip-sort__item--event">
          <input id="sort-event" class="trip-sort__input visually-hidden"
            type="radio" name="trip-sort" value="${SORT_TYPE.EVENT}" disabled>
          <label class="trip-sort__btn" for="sort-event" data-sort-type="${SORT_TYPE.EVENT}">Event</label>
        </div>

        <div class="trip-sort__item  trip-sort__item--time">
          <input id="sort-time" class="trip-sort__input visually-hidden"
            type="radio" name="trip-sort" value="${SORT_TYPE.TIME}"
            ${currentSort === SORT_TYPE.TIME ? 'checked' : ''}>
          <label class="trip-sort__btn" for="sort-time" data-sort-type="${SORT_TYPE.TIME}">Time</label>
        </div>

        <div class="trip-sort__item  trip-sort__item--price">
          <input id="sort-price" class="trip-sort__input visually-hidden"
            type="radio" name="trip-sort" value="${SORT_TYPE.PRICE}"
            ${currentSort === SORT_TYPE.PRICE ? 'checked' : ''}>
          <label class="trip-sort__btn" for="sort-price" data-sort-type="${SORT_TYPE.PRICE}">Price</label>
        </div>

        <div class="trip-sort__item  trip-sort__item--offer">
          <input id="sort-offer" class="trip-sort__input visually-hidden"
            type="radio" name="trip-sort" value="${SORT_TYPE.OFFERS}" disabled>
          <label class="trip-sort__btn" for="sort-offer" data-sort-type="${SORT_TYPE.OFFERS}">Offers</label>
        </div>
      </form>`
  );
}

export default class SortListView extends AbstractView {
  #currentSort = SORT_TYPE.DAY;
  #handleSortChange = null;

  constructor({ currentSort, handleSortChange }) {
    super();
    this.#currentSort = currentSort;
    this.#handleSortChange = handleSortChange;

    this.#setHandlers();
  }

  #setHandlers() {
    this.element.addEventListener('click', (evt) => {
      const target = evt.target;

      if (!(target instanceof HTMLElement)) {
        return;
      }

      const sortType = target.dataset.sortType;

      if (sortType === undefined) {
        return;
      }

      this.#handleSortChange(sortType);
    });

  }

  get template() {
    return createSortListTemplate(this.#currentSort);
  }
}
