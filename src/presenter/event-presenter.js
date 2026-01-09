import { render, replace } from '../framework/render';
import EventItemView from '../view/event/event-item-view';

export default class EventPresenter {
  #eventListContainer = null;
  #handleEventChange = null;
  #handleOpenEditForm = null;

  #eventData = null;

  #eventComponent = null;

  constructor({ eventListContainer, handleEventChange, handleOpenEditForm }) {
    this.#eventListContainer = eventListContainer;

    this.#handleEventChange = handleEventChange;
    this.#handleOpenEditForm = handleOpenEditForm;
  }

  #handleEditClick = () => {
    this.#handleOpenEditForm(this.#eventData.point.id, this.#eventComponent);
  };

  init(eventData) {
    this.#eventData = eventData;

    this.#eventComponent = this.#createEventItem();

    render(this.#eventComponent, this.#eventListContainer);
  }

  update(eventData) {
    this.#eventData = eventData;

    const prevEventComponent = this.#eventComponent;

    this.#eventComponent = this.#createEventItem();

    replace(this.#eventComponent, prevEventComponent);
  }


  destroy() {
    this.#eventComponent.element.remove();
    this.#eventComponent = null;
  }

  #createEventItem() {
    return new EventItemView({
      point: this.#eventData.point,
      destination: this.#eventData.destination,
      offer: this.#eventData.offer,
      handleFavoriteClick: this.#handleFavoriteClick,
      handleEditClick: this.#handleEditClick
    });
  }

  #handleFavoriteClick = () => {
    const nextPoint = {
      ...this.#eventData.point,
      isFavorite: !this.#eventData.point.isFavorite
    };

    this.#handleEventChange(nextPoint);
  };
}
