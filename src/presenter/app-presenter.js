import { render, RenderPosition } from '../framework/render';
import EventPresenter from './event-presenter';
import FiltersPresenter from './filters-presenter';
import SortListView from '../view/sort-list-view';
import EventsListView from '../view/event/events-list-view';
import { BLANK_POINT, FILTER_TYPES, SORT_TYPE } from '../const';
import TripInfoView from '../view/header/trip-info-view';
import NewEventPresenter from './new-event-presenter';
import { filter } from '../utils';

export default class AppPresenter {
  #headerContainer = null;
  #filtersContainer = null;
  #mainContainer = null;
  #tripInfo = null;
  #eventListContainer = null;

  #pointModel = [];
  #offerModel = {};
  #destinationModel = {};

  #points = [];
  #addButton = null;
  #isCreatingPoint = false;
  #newEventPresenter = null;
  #currentSort = SORT_TYPE.DAY;
  #eventPresenters = new Map();
  #filtersPresenter = null;

  constructor({ headerContainer,filtersContainer, mainContainer, pointModel, destinationModel, offerModel }) {
    this.#headerContainer = headerContainer;
    this.#filtersContainer = filtersContainer;
    this.#mainContainer = mainContainer;
    this.#tripInfo = new TripInfoView();
    this.#eventListContainer = new EventsListView();
    this.#pointModel = pointModel;
    this.#offerModel = offerModel;
    this.#destinationModel = destinationModel;

    this.#points = this.#pointModel.get();
  }

  #handlePointChange = (updatedPoint) => {
    this.#points = this.#points.map((p) =>
      p.id === updatedPoint.id ? updatedPoint : p
    );

    const eventPresenter = this.#eventPresenters.get(updatedPoint.id);
    if (!eventPresenter) {
      return;
    }

    const updatedEventData = this.#getFormData(updatedPoint);

    eventPresenter.update(updatedEventData);
  };


  #getEventsForRender() {
    const currentFilter = this.#filtersPresenter.getCurrentFilter();
    const filteredPoints = filter[currentFilter](this.#points);
    return filteredPoints.map((p) => this.#getFormData(p));
  }

  #clearEvents() {
    this.#eventPresenters.forEach((presenter) => presenter.destroy?.());
    this.#eventPresenters.clear();

    this.#eventListContainer.element.innerHTML = '';
  }

  #renderEvents() {
    this.#clearEvents();

    const events = this.#getEventsForRender();
    events.forEach((eventData) => this.#renderEvent(eventData));
  }

  #handleEventFormOpen = () => {
    if (this.#isCreatingPoint) {
      this.#newEventPresenter?.destroy();
      this.#closeNewEvent();
    }

    this.#resetAllPointPresenters();
  };


  #getFormData(point) {
    const pointDestination = point.destination ? this.#destinationModel.getById(point.destination) : null;
    const pointOffer = this.#offerModel.getByType(point.type) ?? null;
    return { point, pointDestination, pointOffer };
  }

  #renderEvent(eventData) {
    const eventPresenter = new EventPresenter({
      eventListContainer: this.#eventListContainer.element,
      onFormOpen: this.#handleEventFormOpen,
      isEditBlocked: () => this.#isCreatingPoint,
      onTypeChange: (point) => this.#getFormData(point),
      onPointChange: this.#handlePointChange,
    });


    eventPresenter.init(eventData);

    if (eventData.point.id) {
      this.#eventPresenters.set(eventData.point.id, eventPresenter);
    }
  }

  #openNewEvent() {
    this.#isCreatingPoint = true;
    this.#addButton.disabled = true;
  }

  #closeNewEvent() {
    this.#isCreatingPoint = false;
    this.#addButton.disabled = false;
  }

  #handleNewEventDestroy = () => {
    this.#closeNewEvent();
    this.#newEventPresenter = null;
  };

  #makeEventDataByType = (prevEventData, nextType) => {
    const nextPoint = {
      ...prevEventData.point,
      type: nextType,
      offers: []
    };

    const nextPointOffer = this.#offerModel.getByType(nextType) ?? null;

    return {
      point: nextPoint,
      pointOffer: nextPointOffer,
      pointDestination: prevEventData.pointDestination
    };
  };

  #createNewEvent () {
    this.#filtersPresenter.setFilter(FILTER_TYPES.EVERYTHING);
    this.#currentSort = SORT_TYPE.DAY;

    this.#resetAllPointPresenters();
    this.#newEventPresenter?.destroy();
    this.#openNewEvent();

    this.#newEventPresenter = new NewEventPresenter({
      eventListContainer: this.#eventListContainer,
      onDestroy: this.#handleNewEventDestroy,
      onTypeChange: this.#makeEventDataByType
    });

    const newEvent = { ...BLANK_POINT };
    const eventData = this.#getFormData(newEvent);

    this.#newEventPresenter.init(eventData);
  }

  #handleFilterChange = () => {
    this.#currentSort = SORT_TYPE.DAY;
    this.#renderEvents();
  };


  #handleCreateButtonClick = (evt) => {
    evt.preventDefault();
    this.#createNewEvent();
  };

  #resetAllPointPresenters = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetForm());
  };

  init() {
    this.#addButton = document.querySelector('.trip-main__event-add-btn');
    this.#addButton.addEventListener('click', this.#handleCreateButtonClick);

    render(this.#tripInfo, this.#headerContainer, RenderPosition.AFTERBEGIN);
    this.#filtersPresenter = new FiltersPresenter({
      filtersContainer: this.#filtersContainer,
      currentFilter: FILTER_TYPES.EVERYTHING,
      onFilterChange: this.#handleFilterChange
    });

    this.#filtersPresenter.init();

    render(
      new SortListView({
        currentSort: this.#currentSort,
        onSortChange: () => {}
      }),
      this.#mainContainer
    );
    render(this.#eventListContainer, this.#mainContainer);

    this.#renderEvents();
  }
}
