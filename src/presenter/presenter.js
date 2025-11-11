import FiltersView from '../view/filters-view';
import SortListView from '../view/sort-list-view';

import { render } from '../render';
import EventsList from '../view/events-list';
import EventItem from '../view/event-item';

export default class Presenter {
  eventContainer = new EventsList ();

  constructor ({headerContainer, mainContainer}) {
    this.headerContainer = headerContainer;
    this.mainContainer = mainContainer;
  }

  init () {
    render(new FiltersView(), this.headerContainer);
    render(new SortListView(), this.mainContainer);
    render(this.eventContainer, this.mainContainer);
    for (let i = 0; i < 3; i++) {
      render(new EventItem(), this.eventContainer.getElement());
    }

  }
}
