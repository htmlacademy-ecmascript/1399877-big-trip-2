import FiltersView from '../view/filters-view';
import SortListView from '../view/sort-list-view';
import EventsListView from '../view/event/events-list-view';
import EventItemView from '../view/event/event-item-view';
import EventItemEdit from '../view/event/event-item-edit';

import { render } from '../render';

export default class AppPresenter {
  constructor({ headerContainer, mainContainer, pointModel, destinationModel, offerModel }) {
    this.headerContainer = headerContainer;
    this.mainContainer = mainContainer;
    this.eventListContainer = new EventsListView();

    this.point = pointModel;
    this.offers = offerModel;
    this.destinations = destinationModel;

    this.points = this.point.get();
  }

  init() {
    render(new FiltersView(), this.headerContainer);
    render(new SortListView(), this.mainContainer);
    render(this.eventListContainer, this.mainContainer);

    render(new EventItemEdit({
      point: this.points[0],
      destination: this.destinations.getById(this.points[0].destination),
      offers: this.offers.getByType(this.points[0].type)
    }), this.eventListContainer.getElement());

    this.points.forEach((point) => {
      render(new EventItemView({
        point: point,
        destination: this.destinations.getById(point.destination),
        offers: this.offers.getByType(point.type)
      }), this.eventListContainer.getElement());
    });
  }
}
