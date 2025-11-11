import EventFactory from '../factory/event-factory';
import { render } from '../render';
import EventItem from '../view/event/event-item';

export default class EventPresenter {
  constructor ({eventList, mode}) {
    this.eventList = eventList;
    this.mode = mode;
    this.eventItem = new EventItem();
    this.eventFactory = new EventFactory({
      container: this.eventItem.getElement(),
      mode: this.mode
    });
  }

  init () {
    render(this.eventItem, this.eventList);
    this.eventFactory.render();
  }
}
