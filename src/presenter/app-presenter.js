import { render, replace, RenderPosition } from '../framework/render';
import EventPresenter from './event-presenter';
import FiltersPresenter from './filters-presenter';
import SortListView from '../view/sort-list-view';
import EventsListView from '../view/event/events-list-view';
import { BLANK_POINT, FILTER_TYPES, SORT_TYPE } from '../const';
import TripInfoView from '../view/header/trip-info-view';
import EventFormPresenter from './event-form-presenter';
import { filter } from '../utils';

export default class AppPresenter {
  #headerContainer = null;
  #filtersContainer = null;
  #mainContainer = null;

  #tripInfoView = null;
  #eventsListView = null;

  #pointModel = null;
  #offerModel = null;
  #destinationModel = null;

  #eventPresenters = new Map();

  #filtersPresenter = null;
  #sortView = null;
  #eventFormPresenter = null;

  #currentSort = SORT_TYPE.DAY;

  #addButton = null;

  #escKeyDownHandler = null;

  constructor({
    headerContainer,
    filtersContainer,
    mainContainer,
    pointModel,
    destinationModel,
    offerModel
  }) {
    this.#headerContainer = headerContainer;
    this.#filtersContainer = filtersContainer;
    this.#mainContainer = mainContainer;

    this.#pointModel = pointModel;
    this.#destinationModel = destinationModel;
    this.#offerModel = offerModel;

    this.#tripInfoView = new TripInfoView();
    this.#eventsListView = new EventsListView();
  }

  init() {
    this.#addButton = document.querySelector('.trip-main__event-add-btn');
    this.#addButton.addEventListener('click', this.#handleCreateClick);

    render(this.#tripInfoView, this.#headerContainer, RenderPosition.AFTERBEGIN);
    render(this.#eventsListView, this.#mainContainer);

    this.#initFilters();
    this.#renderSort();
    this.#renderEvents();
  }

  #initFilters() {
    this.#filtersPresenter = new FiltersPresenter({
      filtersContainer: this.#filtersContainer,
      currentFilter: FILTER_TYPES.EVERYTHING,
      handleFilterChange: this.#handleFilterChange,
      getPoints: () => this.#pointModel.get()
    });

    this.#filtersPresenter.init();
  }

  #handleFilterChange = () => {
    this.#currentSort = SORT_TYPE.DAY;
    this.#renderSort();
    this.#renderEvents();
  };

  #renderSort() {
    const prev = this.#sortView;

    this.#sortView = new SortListView({
      currentSort: this.#currentSort,
      handleSortChange: this.#handleSortChange
    });

    if (prev === null) {
      render(this.#sortView, this.#mainContainer, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#sortView, prev);
  }

  #handleSortChange = (nextSort) => {
    if (this.#currentSort === nextSort) {
      return;
    }

    this.#currentSort = nextSort;
    this.#renderEvents();
  };

  #renderEvents() {
    this.#clearEvents();

    const eventsForRender = this.#getEventsForRender();
    for (const eventData of eventsForRender) {
      this.#renderEvent(eventData);
    }
  }

  #renderEvent(eventData) {
    const presenter = new EventPresenter({
      eventListContainer: this.#eventsListView.element,
      handleEventChange: this.#handlePointChange,
      handleOpenEditForm: this.#handleOpenEditForm
    });

    presenter.init(eventData);


    const id = eventData.point.id;
    if (this.#hasValue(id)) {
      this.#eventPresenters.set(id, presenter);
    }
  }

  #clearEvents() {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();

    const container = this.#eventsListView?.element;
    if (!container) {
      return;
    }

    container.replaceChildren();
  }

  #getEventsForRender() {
    const currentFilter = this.#filtersPresenter.getCurrentFilter();
    const filterFn = filter[currentFilter];

    const filteredPoints = typeof filterFn === 'function'
      ? filterFn(this.#pointModel.get())
      : [...this.#pointModel.get()];

    const sortedPoints = this.#sortPoints(filteredPoints);
    return sortedPoints.map((point) => this.#makeViewData(point));
  }

  #toTime(date) {
    return date ? new Date(date).getTime() : 0;
  }

  #getDuration(point) {
    return this.#toTime(point.dateTo) - this.#toTime(point.dateFrom);
  }

  #hasValue(value) {
    return value !== null && value !== undefined;
  }

  #isReplaceTargetValid(target) {
    return target !== null && target !== undefined && typeof target === 'object' && 'element' in target;
  }

  #sortPoints(points) {
    const sorted = [...points];

    switch (this.#currentSort) {
      case SORT_TYPE.TIME:
        sorted.sort((a, b) => this.#getDuration(b) - this.#getDuration(a));
        break;

      case SORT_TYPE.PRICE:
        sorted.sort((a, b) => (b.basePrice ?? 0) - (a.basePrice ?? 0));
        break;

      case SORT_TYPE.DAY:
      default:
        sorted.sort((a, b) => this.#toTime(a.dateFrom) - this.#toTime(b.dateFrom));
        break;
    }

    return sorted;
  }

  #handleCreateClick = (evt) => {
    evt.preventDefault();

    this.#filtersPresenter.setFilter(FILTER_TYPES.EVERYTHING);
    this.#currentSort = SORT_TYPE.DAY;

    this.#openForm(this.#makeViewData({ ...BLANK_POINT }));
  };

  #handleOpenEditForm = (pointId, eventView) => {
    const point = this.#pointModel.get().find((p) => p.id === pointId);
    if (point === undefined) {
      return;
    }

    if (!this.#isReplaceTargetValid(eventView)) {
      return;
    }

    this.#openForm(this.#makeViewData(point), eventView);
  };


  #openForm(eventData, replaceTarget) {
    this.#closeAllForms();
    this.#addButton.disabled = true;

    this.#eventFormPresenter = new EventFormPresenter({
      eventListContainer: this.#eventsListView,
      handleDestroy: this.#handleFormDestroy,
      handleTypeChange: this.#handleFormTypeChange,
      handleSubmit: this.#handlePointChange
    });

    this.#eventFormPresenter.open(eventData, replaceTarget);

    this.#setEscKeyDownHandler();
  }

  #destroyForm() {
    if (this.#eventFormPresenter === null) {
      return;
    }

    const presenter = this.#eventFormPresenter;
    this.#eventFormPresenter = null;

    this.#removeEscKeyDownHandler();

    if (this.#addButton !== null) {
      this.#addButton.disabled = false;
    }

    presenter.destroy();
  }


  #handleFormDestroy = () => {
    this.#destroyForm();
  };

  #handleFormTypeChange = (prevEventData, nextType) => {
    const nextPoint = {
      ...prevEventData.point,
      type: nextType,
      offers: []
    };

    return this.#makeViewData(nextPoint);
  };

  #handlePointChange = (updatedPoint) => {
    this.#pointModel.update(updatedPoint);

    this.#filtersPresenter.update();

    this.#renderEvents();
  };



  #makeViewData(data) {
    const point = (data && typeof data === 'object' && 'point' in data) ? data.point : data;

    const destination =
      point?.destination != null
        ? this.#destinationModel.getById(point.destination)
        : null;

    const offer =
      this.#offerModel.getByType(point?.type) ?? null;

    return { point, destination, offer };
  }


  #setEscKeyDownHandler() {
    if (this.#escKeyDownHandler !== null) {
      return;
    }

    this.#escKeyDownHandler = (evt) => {
      if (evt.key !== 'Escape') {
        return;
      }

      evt.preventDefault();
      this.#destroyForm();
    };

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #removeEscKeyDownHandler() {
    if (this.#escKeyDownHandler === null) {
      return;
    }

    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#escKeyDownHandler = null;
  }

  #closeAllForms() {
    this.#destroyForm();

    this.#eventPresenters.forEach((presenter) => {
      if (presenter !== null && presenter !== undefined && typeof presenter.resetForm === 'function') {
        presenter.resetForm();
      }
    });
  }
}
