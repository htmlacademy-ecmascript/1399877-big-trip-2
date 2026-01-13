import { render, replace } from '../framework/render';
import FiltersView from '../view/filters-view';
import { getFiltersAvailability } from '../utils';

export default class FiltersPresenter {
  #filterModel = null;

  #filtersContainer = null;
  #getPoints = null;

  #handleFilterChange = null;

  #filtersComponent = null;

  constructor({ filtersContainer, handleFilterChange, getPoints, filterModel }) {
    this.#filtersContainer = filtersContainer;
    this.#handleFilterChange = handleFilterChange;
    this.#getPoints = getPoints;
    this.#filterModel = filterModel;
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
    return this.#filterModel.getFilter();
  }

  setFilter(nextFilter) {
    const currentFilter = this.#filterModel.getFilter();

    if (currentFilter === nextFilter) {
      return;
    }

    this.#filterModel.setFilter(nextFilter);

    this.#handleFilterChange(nextFilter);
    this.init();
  }

  #createFiltersView() {
    const points = this.#getPoints();
    const filtersAvailability = getFiltersAvailability(points);

    return new FiltersView({
      currentFilter: this.#filterModel.getFilter(),
      filtersAvailability,
      handleFilterChange: this.#handleViewFilterChange
    });
  }

  #handleViewFilterChange = (nextFilter) => {
    this.setFilter(nextFilter);
  };
}
