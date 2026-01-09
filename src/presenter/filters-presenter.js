import { render, replace } from '../framework/render';
import FiltersView from '../view/filters-view';
import { FILTER_TYPES } from '../const';
import { getFiltersAvailability } from '../utils';

export default class FiltersPresenter {
  #filtersContainer = null;
  #getPoints = null;

  #currentFilter = FILTER_TYPES.EVERYTHING;
  #handleFilterChange = null;

  #filtersComponent = null;

  constructor({ filtersContainer, currentFilter, handleFilterChange, getPoints }) {
    this.#filtersContainer = filtersContainer;
    this.#currentFilter = currentFilter;
    this.#handleFilterChange = handleFilterChange;
    this.#getPoints = getPoints;
  }

  init() {
    const prev = this.#filtersComponent;

    this.#filtersComponent = this.#createFiltersView();

    if (!prev) {
      render(this.#filtersComponent, this.#filtersContainer);
      return;
    }

    replace(this.#filtersComponent, prev);
  }

  update() {
    this.init();
  }

  getCurrentFilter() {
    return this.#currentFilter;
  }

  setFilter(nextFilter) {
    if (this.#currentFilter === nextFilter) {
      return;
    }

    this.#currentFilter = nextFilter;
    this.#handleFilterChange(nextFilter);
    this.init();
  }

  #createFiltersView() {
    const points = this.#getPoints();
    const filtersAvailability = getFiltersAvailability(points);

    return new FiltersView({
      currentFilter: this.#currentFilter,
      filtersAvailability,
      handleFilterChange: this.#handleViewFilterChange
    });
  }

  #handleViewFilterChange = (nextFilter) => {
    this.setFilter(nextFilter);
  };
}
