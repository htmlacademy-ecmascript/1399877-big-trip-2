import AbstractView from '../framework/view/abstract-view';
import { FILTER_TYPES } from '../const';

function createFiltersListTemplate(currentFilter, filtersAvailability) {
  return (
    `<form class="trip-filters" action="#" method="get">
        <div class="trip-filters__filter">
          <input id="filter-everything" class="trip-filters__filter-input visually-hidden"
            type="radio" name="trip-filter" value="${FILTER_TYPES.EVERYTHING}"
            ${currentFilter === FILTER_TYPES.EVERYTHING ? 'checked' : ''}
            ${filtersAvailability[FILTER_TYPES.EVERYTHING] ? '' : 'disabled'}>
          <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
        </div>

        <div class="trip-filters__filter">
          <input id="filter-future" class="trip-filters__filter-input visually-hidden"
            type="radio" name="trip-filter" value="${FILTER_TYPES.FUTURE}"
            ${currentFilter === FILTER_TYPES.FUTURE ? 'checked' : ''}
            ${filtersAvailability[FILTER_TYPES.FUTURE] ? '' : 'disabled'}>
          <label class="trip-filters__filter-label" for="filter-future">Future</label>
        </div>

        <div class="trip-filters__filter">
          <input id="filter-present" class="trip-filters__filter-input visually-hidden"
            type="radio" name="trip-filter" value="${FILTER_TYPES.PRESENT}"
            ${currentFilter === FILTER_TYPES.PRESENT ? 'checked' : ''}
            ${filtersAvailability[FILTER_TYPES.PRESENT] ? '' : 'disabled'}>
          <label class="trip-filters__filter-label" for="filter-present">Present</label>
        </div>

        <div class="trip-filters__filter">
          <input id="filter-past" class="trip-filters__filter-input visually-hidden"
            type="radio" name="trip-filter" value="${FILTER_TYPES.PAST}"
            ${currentFilter === FILTER_TYPES.PAST ? 'checked' : ''}
            ${filtersAvailability[FILTER_TYPES.PAST] ? '' : 'disabled'}>
          <label class="trip-filters__filter-label" for="filter-past">Past</label>
        </div>

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
      this.#handleFilterChange(evt.target.value);
    });
  }

  get template() {
    return createFiltersListTemplate(this.#currentFilter, this.#filtersAvailability);
  }
}
