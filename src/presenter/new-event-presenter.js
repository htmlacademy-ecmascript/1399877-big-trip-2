import EventFormView from '../view/event/event-form-view';
import { render, RenderPosition, replace } from '../framework/render';

export default class NewEventPresenter {
  #eventListContainer = null;

  #onDestroy = null;
  #onTypeChange = null;

  #eventData = null;

  #newEventFormComponent = null;
  #escKeyDownHandler = null;

  constructor({ eventListContainer, onDestroy, onTypeChange }) {
    this.#eventListContainer = eventListContainer;
    this.#onDestroy = onDestroy;
    this.#onTypeChange = onTypeChange;
  }

  init(eventData) {
    this.#eventData = eventData;
    this.#escKeyDownHandler = this.#createEscKeyDownHandler();

    document.addEventListener('keydown', this.#escKeyDownHandler);

    this.#renderNewEventForm();
  }

  destroy() {
    document.removeEventListener('keydown', this.#escKeyDownHandler);

    this.#newEventFormComponent?.element?.remove();
    this.#newEventFormComponent = null;

    this.#escKeyDownHandler = null;

    this.#onDestroy?.();
  }

  #createEscKeyDownHandler() {
    return (evt) => {
      if (evt.key !== 'Escape') {
        return;
      }

      evt.preventDefault();
      this.destroy();
    };
  }

  #renderNewEventForm() {
    this.#newEventFormComponent = this.#createNewEventForm();
    render(this.#newEventFormComponent, this.#eventListContainer.element, RenderPosition.AFTERBEGIN);
  }

  #createNewEventForm() {
    return new EventFormView({
      ...this.#eventData,
      onTypeChange: this.#handleTypeChange,
      onSubmit: this.#handleFormSubmit,
      onClose: this.#handleFormClose
    });
  }

  #handleTypeChange = (type) => {
    const prevForm = this.#newEventFormComponent;

    this.#eventData = this.#onTypeChange(this.#eventData, type);
    this.#newEventFormComponent = this.#createNewEventForm();

    replace(this.#newEventFormComponent, prevForm);
  };

  #handleFormSubmit = (evt) => {
    evt.preventDefault();
    this.destroy();
  };

  #handleFormClose = () => {
    this.destroy();
  };
}
