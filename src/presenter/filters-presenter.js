import { render, replace } from '../framework/render';
import FiltersView from '../view/filters-view';
import { FILTER_TYPES } from '../const';

export default class FiltersPresenter {
  #filtersContainer = null;
  #currentFilter = FILTER_TYPES.EVERYTHING;
  #onFilterChange = null;
  #filtersComponent = null;

  constructor({ filtersContainer, currentFilter, onFilterChange }) {
    this.#filtersContainer = filtersContainer;
    this.#currentFilter = currentFilter;
    this.#onFilterChange = onFilterChange;
  }

  init() {
    const prevFiltersComponent = this.#filtersComponent;

    this.#filtersComponent = new FiltersView({
      currentFilter: this.#currentFilter,
      onFilterChange: this.#handleFilterChange
    });

    if (!prevFiltersComponent) {
      render(this.#filtersComponent, this.#filtersContainer);
      return;
    }

    replace(this.#filtersComponent, prevFiltersComponent);
  }

  #handleFilterChange = (nextFilter) => {
    if (this.#currentFilter === nextFilter) {
      return;
    }

    this.#currentFilter = nextFilter;
    this.#onFilterChange(nextFilter);
    this.init();
  };

  getCurrentFilter() {
    return this.#currentFilter;
  }

  setFilter(nextFilter) {
    if (this.#currentFilter === nextFilter) {
      return;
    }

    this.#currentFilter = nextFilter;
    this.#onFilterChange?.(nextFilter);
    this.init();
  }

}
