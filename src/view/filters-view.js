import AbstractView from '../framework/view/abstract-view';
import { FILTER_TYPES } from '../const';

function createFiltersListTemplate(currentFilter) {
  return (
    `<form class="trip-filters" action="#" method="get">
        <div class="trip-filters__filter">
          <input id="filter-everything" class="trip-filters__filter-input  visually-hidden"
            type="radio" name="trip-filter" value="${FILTER_TYPES.EVERYTHING}"
            ${currentFilter === FILTER_TYPES.EVERYTHING ? 'checked' : ''}>
          <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
        </div>

        <div class="trip-filters__filter">
          <input id="filter-future" class="trip-filters__filter-input  visually-hidden"
            type="radio" name="trip-filter" value="${FILTER_TYPES.FUTURE}"
            ${currentFilter === FILTER_TYPES.FUTURE ? 'checked' : ''}>
          <label class="trip-filters__filter-label" for="filter-future">Future</label>
        </div>

        <div class="trip-filters__filter">
          <input id="filter-present" class="trip-filters__filter-input  visually-hidden"
            type="radio" name="trip-filter" value="${FILTER_TYPES.PRESENT}"
            ${currentFilter === FILTER_TYPES.PRESENT ? 'checked' : ''}>
          <label class="trip-filters__filter-label" for="filter-present">Present</label>
        </div>

        <div class="trip-filters__filter">
          <input id="filter-past" class="trip-filters__filter-input  visually-hidden"
            type="radio" name="trip-filter" value="${FILTER_TYPES.PAST}"
            ${currentFilter === FILTER_TYPES.PAST ? 'checked' : ''}>
          <label class="trip-filters__filter-label" for="filter-past">Past</label>
        </div>

        <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
}

export default class FiltersView extends AbstractView {
  #currentFilter = FILTER_TYPES.EVERYTHING;
  #onFilterChange = null;

  constructor({ currentFilter, onFilterChange }) {
    super();
    this.#currentFilter = currentFilter;
    this.#onFilterChange = onFilterChange;

    this.#setHandlers();
  }

  #setHandlers() {
    this.element.addEventListener('change', (evt) => {
      if (evt.target.name !== 'trip-filter') {
        return;
      }
      this.#onFilterChange?.(evt.target.value);
    });
  }

  get template() {
    return createFiltersListTemplate(this.#currentFilter);
  }
}
