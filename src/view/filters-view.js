import AbstractView from '../framework/view/abstract-view';
import { FILTER_TYPES } from '../const';

const FILTERS_ORDER = [
  FILTER_TYPES.EVERYTHING,
  FILTER_TYPES.FUTURE,
  FILTER_TYPES.PRESENT,
  FILTER_TYPES.PAST,
];

const FILTERS_META = {
  [FILTER_TYPES.EVERYTHING]: { id: 'filter-everything', title: 'Everything' },
  [FILTER_TYPES.FUTURE]: { id: 'filter-future', title: 'Future' },
  [FILTER_TYPES.PRESENT]: { id: 'filter-present', title: 'Present' },
  [FILTER_TYPES.PAST]: { id: 'filter-past', title: 'Past' },
};

function isFilterAvailable(filtersAvailability, type) {
  if (filtersAvailability === null || filtersAvailability === undefined) {
    return false;
  }

  if (typeof filtersAvailability !== 'object') {
    return false;
  }

  if (Object.prototype.hasOwnProperty.call(filtersAvailability, type) !== true) {
    return false;
  }

  if (filtersAvailability[type] !== true) {
    return false;
  }

  return true;
}

function createFilterItemTemplate({ id, type, title }, currentFilter, filtersAvailability) {
  let checkedAttr = '';
  if (currentFilter === type) {
    checkedAttr = 'checked';
  }

  const isAvailable = isFilterAvailable(filtersAvailability, type);

  let disabledAttr = '';
  if (isAvailable === false) {
    disabledAttr = 'disabled';
  }

  return (
    `<div class="trip-filters__filter">
      <input
        id="${id}"
        class="trip-filters__filter-input visually-hidden"
        type="radio"
        name="trip-filter"
        value="${type}"
        ${checkedAttr}
        ${disabledAttr}
      >
      <label class="trip-filters__filter-label" for="${id}">${title}</label>
    </div>`
  );
}

function createFiltersListTemplate(currentFilter, filtersAvailability) {
  let availability = {};

  if (filtersAvailability !== null && filtersAvailability !== undefined) {
    if (typeof filtersAvailability === 'object') {
      if (Array.isArray(filtersAvailability) === false) {
        availability = filtersAvailability;
      }
    }
  }

  const items = FILTERS_ORDER
    .map((type) => {
      if (Object.prototype.hasOwnProperty.call(FILTERS_META, type) !== true) {
        return '';
      }

      const meta = FILTERS_META[type];

      if (meta === null || meta === undefined) {
        return '';
      }

      return createFilterItemTemplate(
        { id: meta.id, type, title: meta.title },
        currentFilter,
        availability
      );
    })
    .join('');

  return (
    `<form class="trip-filters" action="#" method="get">
      ${items}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
}


export default class FiltersView extends AbstractView {
  #currentFilter = FILTER_TYPES.EVERYTHING;
  #filtersAvailability = null;
  #handleFilterChange = null;

  constructor({ currentFilter, filtersAvailability, handleFilterChange }) {
    super();
    this.#currentFilter = currentFilter;
    this.#filtersAvailability = filtersAvailability;
    this.#handleFilterChange = handleFilterChange;

    this.#setHandlers();
  }

  #setHandlers() {
    this.element.addEventListener('change', (evt) => {
      if (evt.target.name !== 'trip-filter') {
        return;
      }

      if (typeof this.#handleFilterChange !== 'function') {
        return;
      }

      this.#handleFilterChange(evt.target.value);
    });
  }

  get template() {
    return createFiltersListTemplate(this.#currentFilter, this.#filtersAvailability);
  }
}
