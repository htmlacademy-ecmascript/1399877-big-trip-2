import { render, replace, RenderPosition } from '../framework/render';
import FiltersView from '../view/filters-view';
import SortListView from '../view/sort-list-view';
import EventsListView from '../view/event/events-list-view';
import EventItemView from '../view/event/event-item-view';
import EventFormView from '../view/event/event-form-view';
import { BLANK_POINT } from '../const';
import TripInfoView from '../view/header/trip-info-view';

export default class AppPresenter {
  #headerContainer;
  #tripInfo = null;
  #mainContainer;
  #eventListContainer;
  #pointModel;
  #offerModel;
  #destinationModel;
  #points;
  #addButton;
  #newPointFormComponent = null;
  #newPointEscHandler = null;

  constructor({ headerContainer, mainContainer, pointModel, destinationModel, offerModel }) {
    this.#headerContainer = headerContainer;
    this.#mainContainer = mainContainer;
    this.#tripInfo = new TripInfoView();
    this.#eventListContainer = new EventsListView();
    this.#pointModel = pointModel;
    this.#offerModel = offerModel;
    this.#destinationModel = destinationModel;

    this.#points = this.#pointModel.get();
  }

  #destroyNewPointForm() {
    if (this.#newPointFormComponent === null) {
      return;
    }

    this.#newPointFormComponent.element.remove();
    this.#newPointFormComponent = null;

    if (this.#newPointEscHandler !== null) {
      document.removeEventListener('keydown', this.#newPointEscHandler);
      this.#newPointEscHandler = null;
    }

    if (this.#addButton) {
      this.#addButton.disabled = false;
    }
  }


  #getFormData(point) {
    const pointDestination = point.destination ? this.#destinationModel.getById(point.destination) : null;
    const pointOffer = this.#offerModel.getByType(point.type) ?? null;
    return { point, pointDestination, pointOffer };
  }

  #renderEvent (point) {
    const formData = this.#getFormData(point);

    const eventComponent = new EventItemView ({
      point,
      pointDestination: formData.pointDestination,
      pointOffer: formData.pointOffer,
      onEditClick: replaceEventToForm
    });

    const eventFormComponent = new EventFormView ({
      point: formData.point,
      pointDestination: formData.pointDestination,
      pointOffer: formData.pointOffer,
      onSubmit: (evt) => {
        evt.preventDefault();
        replaceFormToEvent();
      },
      onClose: () => replaceFormToEvent()
    });

    function replaceFormToEvent () {
      replace(eventComponent, eventFormComponent);
      document.removeEventListener('keydown', escKeyDownHandler);
    }

    function escKeyDownHandler (evt) {
      if (evt.key === 'Escape') {
        replaceFormToEvent();
      }
    }

    function replaceEventToForm () {
      replace(eventFormComponent, eventComponent);
      document.addEventListener('keydown', escKeyDownHandler);
    }

    render(eventComponent, this.#eventListContainer.element);
  }

  #openNewPointForm () {
    if (this.#newPointFormComponent !== null) {
      this.#destroyNewPointForm();
    }

    const newPoint = {
      ...BLANK_POINT,
    };

    const formData = this.#getFormData(newPoint);

    this.#newPointFormComponent = new EventFormView({
      point: formData.point,
      pointDestination: formData.pointDestination,
      pointOffer: formData.pointOffer,
      onSubmit: (evt) => {
        evt.preventDefault();
        this.#destroyNewPointForm();
      },
      onClose: () => {
        this.#destroyNewPointForm();
      }
    });

    render(this.#newPointFormComponent, this.#eventListContainer.element,RenderPosition.AFTERBEGIN);
    this.#addButton.disabled = true;

    this.#newPointEscHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        this.#destroyNewPointForm();
      }
    };

    document.addEventListener('keydown', this.#newPointEscHandler);
  }

  #handleCreateButtonClick = (evt) => {
    evt.preventDefault();
    this.#openNewPointForm();
  };

  init() {
    this.#addButton = document.querySelector('.trip-main__event-add-btn');
    this.#addButton.addEventListener('click', this.#handleCreateButtonClick);
    render(this.#tripInfo, this.#headerContainer);
    render(new FiltersView(), this.#headerContainer);
    render(new SortListView(), this.#mainContainer);
    render(this.#eventListContainer, this.#mainContainer);

    this.#points.forEach((point) => {
      this.#renderEvent(point);
    });
  }
}
