import { render, replace, RenderPosition } from '../framework/render';
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

  #pointModel = null;
  #offerModel = null;
  #destinationModel = null;

  #points = [];
  #eventPresenters = new Map();

  #filtersPresenter = null;
  #sortComponent = null;

  #addButton = null;
  #isCreatingPoint = false;
  #newEventPresenter = null;

  #currentSort = SORT_TYPE.DAY;

  constructor({ headerContainer, filtersContainer, mainContainer, pointModel, destinationModel, offerModel }) {
    this.#headerContainer = headerContainer;
    this.#filtersContainer = filtersContainer;
    this.#mainContainer = mainContainer;

    this.#pointModel = pointModel;
    this.#destinationModel = destinationModel;
    this.#offerModel = offerModel;

    this.#tripInfo = new TripInfoView();
    this.#eventListContainer = new EventsListView();

    this.#points = this.#pointModel.get();
  }

  init() {
    this.#addButton = document.querySelector('.trip-main__event-add-btn');
    this.#addButton.addEventListener('click', this.#handleCreateButtonClick);

    render(this.#tripInfo, this.#headerContainer, RenderPosition.AFTERBEGIN);

    this.#initFilters();
    this.#renderSort();

    render(this.#eventListContainer, this.#mainContainer);

    this.#renderEvents();
  }

  #initFilters() {
    this.#filtersPresenter = new FiltersPresenter({
      filtersContainer: this.#filtersContainer,
      currentFilter: FILTER_TYPES.EVERYTHING,
      onFilterChange: this.#handleFilterChange,
      getPoints: () => this.#points
    });


    this.#filtersPresenter.init();
  }

  #handleCreateButtonClick = (evt) => {
    evt.preventDefault();
    this.#createNewEvent();
  };

  #handleFilterChange = () => {
    this.#setSort(SORT_TYPE.DAY);
    this.#renderEvents();
  };

  #handleSortChange = (nextSort) => {
    if (this.#currentSort === nextSort) {
      return;
    }

    this.#setSort(nextSort);
    this.#renderEvents();
  };

  #handleEventFormOpen = () => {
    if (this.#isCreatingPoint) {
      this.#destroyNewEvent();
    }

    this.#resetAllPointPresenters();
  };

  #handleNewEventDestroy = () => {
    this.#newEventPresenter = null;
    this.#closeNewEvent();
  };

  #handlePointChange = (updatedPoint) => {
    this.#updatePointInStore(updatedPoint);
    this.#filtersPresenter.init();

    const presenter = this.#eventPresenters.get(updatedPoint.id);
    if (!presenter) {
      return;
    }

    presenter.update(this.#getFormData(updatedPoint));
  };


  #setSort(nextSort) {
    this.#currentSort = nextSort;
    this.#renderSort();
  }

  #renderSort() {
    const prev = this.#sortComponent;

    this.#sortComponent = new SortListView({
      currentSort: this.#currentSort,
      onSortChange: this.#handleSortChange
    });

    if (!prev) {
      render(this.#sortComponent, this.#mainContainer);
      return;
    }

    replace(this.#sortComponent, prev);
  }

  #renderEvents() {
    this.#clearEvents();

    const events = this.#getEventsForRender();
    for (const eventData of events) {
      this.#renderEvent(eventData);
    }
  }

  #renderEvent(eventData) {
    const presenter = this.#createEventPresenter();
    presenter.init(eventData);

    const { id } = eventData.point;
    if (id) {
      this.#eventPresenters.set(id, presenter);
    }
  }

  #createEventPresenter() {
    return new EventPresenter({
      eventListContainer: this.#eventListContainer.element,
      onFormOpen: this.#handleEventFormOpen,
      isEditBlocked: () => this.#isCreatingPoint,
      onTypeChange: (point) => this.#getFormData(point),
      onPointChange: this.#handlePointChange,
    });
  }

  #clearEvents() {
    this.#eventPresenters.forEach((presenter) => presenter.destroy?.());
    this.#eventPresenters.clear();
    this.#eventListContainer.element.innerHTML = '';
  }

  #getEventsForRender() {
    const currentFilter = this.#filtersPresenter.getCurrentFilter();
    const filtered = filter[currentFilter](this.#points);
    const sorted = this.#sortPoints(filtered);
    return sorted.map((p) => this.#getFormData(p));
  }

  #sortPoints(points) {
    const sorted = [...points];

    const time = (d) => (d ? new Date(d).getTime() : 0);
    const duration = (p) => time(p.dateTo) - time(p.dateFrom);

    switch (this.#currentSort) {
      case SORT_TYPE.TIME:
        sorted.sort((a, b) => duration(b) - duration(a));
        break;
      case SORT_TYPE.PRICE:
        sorted.sort((a, b) => (b.basePrice ?? 0) - (a.basePrice ?? 0));
        break;
      case SORT_TYPE.DAY:
      default:
        sorted.sort((a, b) => time(a.dateFrom) - time(b.dateFrom));
        break;
    }

    return sorted;
  }

  #getFormData(point) {
    const pointDestination = point.destination ? this.#destinationModel.getById(point.destination) : null;
    const pointOffer = this.#offerModel.getByType(point.type) ?? null;
    return { point, pointDestination, pointOffer };
  }

  #makeEventDataByType = (prevEventData, nextType) => {
    const nextPoint = { ...prevEventData.point, type: nextType, offers: [] };
    const nextPointOffer = this.#offerModel.getByType(nextType) ?? null;
    return { point: nextPoint, pointOffer: nextPointOffer, pointDestination: prevEventData.pointDestination };
  };

  #createNewEvent() {
    this.#filtersPresenter.setFilter(FILTER_TYPES.EVERYTHING);
    this.#setSort(SORT_TYPE.DAY);

    this.#resetAllPointPresenters();
    this.#destroyNewEvent();
    this.#openNewEvent();

    this.#newEventPresenter = new NewEventPresenter({
      eventListContainer: this.#eventListContainer,
      onDestroy: this.#handleNewEventDestroy,
      onTypeChange: this.#makeEventDataByType
    });

    this.#newEventPresenter.init(this.#getFormData({ ...BLANK_POINT }));
  }

  #openNewEvent() {
    this.#isCreatingPoint = true;
    this.#addButton.disabled = true;
  }

  #closeNewEvent() {
    this.#isCreatingPoint = false;
    this.#addButton.disabled = false;
  }

  #destroyNewEvent() {
    if (!this.#newEventPresenter) {
      return;
    }

    const presenter = this.#newEventPresenter;
    this.#newEventPresenter = null;

    presenter.destroy();
    this.#closeNewEvent();
  }

  #resetAllPointPresenters = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetForm());
  };

  #updatePointInStore(updatedPoint) {
    this.#points = this.#points.map((p) => (p.id === updatedPoint.id ? updatedPoint : p));
  }
}
