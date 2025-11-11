import { createElement } from '../../render';

function createEventItemTemplate () {
  return '<li class="trip-events__item"></li>';
}

export default class EventItem {
  getTemplate () {
    return createEventItemTemplate();
  }

  getElement () {
    if(!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement () {
    this.element = null;
  }
}
