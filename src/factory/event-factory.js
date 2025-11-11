import ViewEventItem from '../view/event/view-event-item';
import EditEventItem from '../view/event/edit-event-item';
import NewEventItem from '../view/event/new-event-item';

import { render } from '../render';

export default class EventFactory {
  constructor ({container, mode}) {
    this.container = container;
    this.mode = mode;
  }

  render() {
    let component;

    switch(this.mode) {
      case 'view':
        component = new ViewEventItem();
        break;

      case 'edit':
        component = new EditEventItem();
        break;

      case 'create':
        component = new NewEventItem();
        break;
    }
    render(component, this.container);
  }
}
