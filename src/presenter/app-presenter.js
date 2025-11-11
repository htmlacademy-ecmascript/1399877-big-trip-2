import EventsPresenter from './events-presenter';

import FiltersView from '../view/filters-view';
import SortListView from '../view/sort-list-view';


import { render } from '../render';

export default class AppPresenter {
  constructor({ headerContainer, mainContainer }) {
    this.headerContainer = headerContainer;
    this.mainContainer = mainContainer;
    this.eventsPresenter = new EventsPresenter({
      mainContainer: this.mainContainer
    });
  }

  init() {
    render(new FiltersView(), this.headerContainer);
    render(new SortListView(), this.mainContainer);
    this.eventsPresenter.init();
  }
}
