import { FILTER_TYPES } from '../const';

export default class FilterModel {
  #filter = FILTER_TYPES.EVERYTHING;

  getFilter() {
    return this.#filter;
  }

  setFilter(filter) {
    if (filter === null || filter === undefined) {
      throw new Error('FilterModel.setFilter: filter must not be null or undefined');
    }

    this.#filter = filter;
  }
}
