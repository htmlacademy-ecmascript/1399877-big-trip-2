import EventFormView from '../view/event/event-form-view';
import { render, RenderPosition, replace } from '../framework/render';

export default class EventFormPresenter {
  #eventListContainer = null;
  #replaceTarget = null;

  #eventData = null;
  #formComponent = null;

  #handleDestroy = null;
  #handleTypeChange = null;
  #handleSubmit = null;

  constructor({ eventListContainer, handleDestroy, handleTypeChange, handleSubmit }) {
    this.#eventListContainer = eventListContainer;
    this.#handleDestroy = handleDestroy;
    this.#handleTypeChange = handleTypeChange;
    this.#handleSubmit = handleSubmit;
  }


  open(eventData, replaceTarget = null) {
    this.destroy();

    this.#eventData = eventData;
    this.#replaceTarget = replaceTarget;

    this.#formComponent = this.#createForm();

    const target = this.#replaceTarget;

    if (target !== null && target !== undefined && ('element' in target)) {
      replace(this.#formComponent, target);
    } else {
      render(this.#formComponent, this.#eventListContainer.element, RenderPosition.AFTERBEGIN);
    }
  }

  destroy() {
    if (this.#formComponent === null) {
      return;
    }

    const formComponent = this.#formComponent;
    const replaceTarget = this.#replaceTarget;

    this.#formComponent = null;
    this.#replaceTarget = null;

    if (replaceTarget !== null && replaceTarget !== undefined && ('element' in replaceTarget)) {
      replace(replaceTarget, formComponent);
    } else {
      formComponent.element.remove();
    }
  }

  #createForm() {
    return new EventFormView({
      ...this.#eventData,
      handleTypeChange: this.#handleFormTypeChange,
      handleSubmit: this.#handleFormSubmit,
      handleClose: this.#handleFormClose
    });
  }

  #handleFormTypeChange = (type) => {
    const prev = this.#formComponent;

    this.#eventData = this.#handleTypeChange(this.#eventData, type);
    this.#formComponent = this.#createForm();

    replace(this.#formComponent, prev);
  };

  #handleFormSubmit = (pointFromForm) => {
    const pointToSave = pointFromForm;

    this.destroy();

    if (typeof this.#handleSubmit === 'function') {
      this.#handleSubmit(pointToSave);
    }

    if (typeof this.#handleDestroy === 'function') {
      this.#handleDestroy();
    }
  };

  #handleFormClose = () => {
    this.destroy();

    if (typeof this.#handleDestroy === 'function') {
      this.#handleDestroy();
    }
  };
}
