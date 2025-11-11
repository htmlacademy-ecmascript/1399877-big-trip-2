import EventPresenter from './event-presenter';

import EventsList from '../view/event/events-list';

import { render } from '../render';
import { MODE } from '../const';

export default class EventsPresenter {


  constructor ({mainContainer}) {
    this.mainContainer = mainContainer;
    this.eventList = new EventsList();
  }

  init () {
    render(this.eventList, this.mainContainer);
    MODE.forEach((el) => {
      this.eventPresenter = new EventPresenter({
        eventList: this.eventList.getElement(),
        mode: el.mode
      });
      this.eventPresenter.init();
    });
  }
}
