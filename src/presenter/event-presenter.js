import { render, replace } from '../framework/render';
import EventItemView from '../view/event/event-item-view';
import EventFormView from '../view/event/event-form-view';

export default class EventPresenter {
  #eventListContainer = null;

  #onFormOpen = null;
  #isEditBlocked = null;
  #onTypeChange = null;
  #onPointChange = null;

  #eventData = null;
  #isFormOpen = false;

  #eventComponent = null;
  #eventFormComponent = null;

  #escKeyDownHandler = null;

  constructor({ eventListContainer, onFormOpen, isEditBlocked, onTypeChange, onPointChange }) {
    this.#eventListContainer = eventListContainer;
    this.#onFormOpen = onFormOpen;
    this.#isEditBlocked = isEditBlocked;
    this.#onTypeChange = onTypeChange;
    this.#onPointChange = onPointChange;
  }

  init(eventData) {
    this.#eventData = eventData;
    this.#escKeyDownHandler = this.#createEscKeyDownHandler();

    this.#eventComponent = this.#createEventItem();
    this.#eventFormComponent = this.#createEventForm();

    render(this.#eventComponent, this.#eventListContainer);
  }

  update(eventData) {
    this.#eventData = eventData;

    const prevEventComponent = this.#eventComponent;
    const prevEventFormComponent = this.#eventFormComponent;

    this.#eventComponent = this.#createEventItem();
    this.#eventFormComponent = this.#createEventForm();

    if (this.#isFormOpen) {
      replace(this.#eventFormComponent, prevEventFormComponent);
    } else {
      replace(this.#eventComponent, prevEventComponent);
    }
  }

  resetForm() {
    if (!this.#isFormOpen) {
      return;
    }

    this.#replaceEvent(this.#eventFormComponent, this.#eventComponent);
  }

  destroy() {
    document.removeEventListener('keydown', this.#escKeyDownHandler);

    this.#eventComponent?.element?.remove();
    this.#eventFormComponent?.element?.remove();

    this.#eventComponent = null;
    this.#eventFormComponent = null;
    this.#isFormOpen = false;
  }

  #createEscKeyDownHandler() {
    return (evt) => {
      if (evt.key !== 'Escape') {
        return;
      }

      evt.preventDefault();
      this.#replaceEvent(this.#eventFormComponent, this.#eventComponent);
    };
  }

  #replaceEvent(oldComponent, newComponent) {
    replace(newComponent, oldComponent);

    this.#isFormOpen = newComponent === this.#eventFormComponent;

    if (this.#isFormOpen) {
      document.addEventListener('keydown', this.#escKeyDownHandler);
    } else {
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  }

  #createEventItem() {
    return new EventItemView({
      point: this.#eventData.point,
      pointDestination: this.#eventData.pointDestination,
      pointOffer: this.#eventData.pointOffer,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick
    });
  }

  #createEventForm() {
    return new EventFormView({
      point: this.#eventData.point,
      pointDestination: this.#eventData.pointDestination,
      pointOffer: this.#eventData.pointOffer,
      onTypeChange: this.#handleTypeChange,
      onSubmit: this.#handleFormSubmit,
      onClose: this.#handleFormClose
    });
  }

  #handleEditClick = () => {
    if (this.#isEditBlocked?.()) {
      return;
    }

    this.#onFormOpen?.();
    this.#replaceEvent(this.#eventComponent, this.#eventFormComponent);
  };

  #handleFavoriteClick = () => {
    const nextPoint = {
      ...this.#eventData.point,
      isFavorite: !this.#eventData.point.isFavorite
    };

    this.#onPointChange?.(nextPoint);
  };

  #handleTypeChange = (newType) => {
    const nextPoint = {
      ...this.#eventData.point,
      type: newType,
      offers: []
    };

    const nextEventData = this.#onTypeChange(nextPoint);

    const prevForm = this.#eventFormComponent;

    this.#eventData = nextEventData;
    this.#eventFormComponent = this.#createEventForm();

    replace(this.#eventFormComponent, prevForm);
  };

  #handleFormSubmit = (evt) => {
    evt.preventDefault();
    this.#replaceEvent(this.#eventFormComponent, this.#eventComponent);
  };

  #handleFormClose = () => {
    this.#replaceEvent(this.#eventFormComponent, this.#eventComponent);
  };
}
