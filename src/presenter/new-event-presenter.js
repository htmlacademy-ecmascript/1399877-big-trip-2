import EventFormView from '../view/event/event-form-view';
import { render, RenderPosition } from '../framework/render';

export default class NewEventPresenter {
  #eventListContainer = null;
  #newEventFormComponent = null;
  #onTypeChange = null;
  #onDestroy = null;
  #escKeyDownHandler = null;

  #eventData = null;

  constructor ({eventListContainer, onDestroy, onTypeChange}) {
    this.#eventListContainer = eventListContainer;
    this.#onDestroy = onDestroy;
    this.#onTypeChange = onTypeChange;
  }

  #renderNewEventForm () {
    this.#newEventFormComponent = new EventFormView({
      ...this.#eventData,
      onTypeChange: this.#handleTypeChange,
      onSubmit: (evt) => {
        evt.preventDefault();
        this.destroy();
      },
      onClose: () => this.destroy()
    });

    render(this.#newEventFormComponent, this.#eventListContainer.element,RenderPosition.AFTERBEGIN);
  }

  #handleTypeChange = (type) => {
    this.#eventData = this.#onTypeChange(this.#eventData, type);

    this.#newEventFormComponent.element.remove();
    this.#newEventFormComponent = null;
    this.#renderNewEventForm();
  };

  init(eventData) {
    this.#eventData = eventData;

    this.#escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        this.destroy();
      }
    };

    document.addEventListener('keydown', this.#escKeyDownHandler);

    this.#renderNewEventForm();
  }

  destroy() {
    if (this.#newEventFormComponent) {
      this.#newEventFormComponent.element.remove();
      this.#newEventFormComponent = null;
    }

    if (this.#escKeyDownHandler) {
      document.removeEventListener('keydown', this.#escKeyDownHandler);
      this.#escKeyDownHandler = null;
    }

    this.#onDestroy?.();
  }
}
