import { render, remove, replace, RenderPosition } from '../framework/render';

import EventPresenter from './event-presenter';
import FiltersPresenter from './filters-presenter';
import EventFormPresenter from './event-form-presenter';

import SortListView from '../view/sort-list-view';
import EventsListView from '../view/event/events-list-view';
import TripInfoView from '../view/header/trip-info-view';
import ListMessageView from '../view/list-message-view';

import { filter } from '../utils';
import { BLANK_POINT, FILTER_TYPES, SORT_TYPE, USER_ACTION } from '../const';


export default class AppPresenter {
  #headerContainer = null;
  #filtersContainer = null;
  #mainContainer = null;

  #tripInfoView = null;
  #eventsListView = null;
  #listMessageView = null;

  #pointModel = null;
  #offerModel = null;
  #destinationModel = null;
  #filterModel = null;

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
    offerModel,
    filterModel
  }) {
    this.#headerContainer = headerContainer;
    this.#filtersContainer = filtersContainer;
    this.#mainContainer = mainContainer;

    this.#pointModel = pointModel;
    this.#destinationModel = destinationModel;
    this.#offerModel = offerModel;
    this.#filterModel = filterModel;

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
      handleFilterChange: this.#handleFilterChange,
      getPoints: () => this.#pointModel.getPoints(),
      filterModel: this.#filterModel
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

    if (eventsForRender.length === 0) {
      const prevEmpty = this.#listMessageView;

      const currentFilter = this.#filterModel.getFilter();

      let message = 'There are no events now';

      if (currentFilter === FILTER_TYPES.PAST) {
        message = 'There are no past events now';
      }

      if (currentFilter === FILTER_TYPES.FUTURE) {
        message = 'There are no future events now';
      }

      this.#listMessageView = new ListMessageView(message);

      if (prevEmpty === null) {
        render(this.#listMessageView, this.#mainContainer);
      } else {
        replace(this.#listMessageView, prevEmpty);
      }

      return;
    }

    if (this.#listMessageView !== null) {
      remove(this.#listMessageView);
      this.#listMessageView = null;
    }

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

    this.#eventPresenters.set(eventData.point.id, presenter);
  }

  #clearEvents() {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();

    this.#eventsListView.element.replaceChildren();
  }

  #getEventsForRender() {
    const currentFilter = this.#filterModel.getFilter();
    const filterFn = filter[currentFilter];

    const filteredPoints = typeof filterFn === 'function'
      ? filterFn(this.#pointModel.getPoints())
      : [...this.#pointModel.getPoints()];

    const sortedPoints = this.#sortPoints(filteredPoints);
    return sortedPoints.map((point) => this.#makeViewData(point));
  }

  #toTime(date) {
    if (date === null || date === undefined) {
      return 0;
    }

    const time = new Date(date).getTime();

    if (Number.isNaN(time)) {
      return 0;
    }

    return time;
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
        sorted.sort((a, b) => {
          const diff = this.#toTime(a.dateFrom) - this.#toTime(b.dateFrom);

          if (diff !== 0) {
            return diff;
          }

          const aId = a.id;
          const bId = b.id;

          if (aId === null || aId === undefined) {
            return -1;
          }

          if (bId === null || bId === undefined) {
            return 1;
          }

          if (aId < bId) {
            return -1;
          }

          if (aId > bId) {
            return 1;
          }

          return 0;
        });
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
    const point = this.#pointModel.getPoints().find((p) => p.id === pointId);
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
      handleSubmit: this.#handlePointChange,
      handleDelete: (pointToDelete) => {
        this.#handleUserAction(USER_ACTION.DELETE_POINT, pointToDelete);
      }
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

  #handlePointChange = (updatedPoint) => {
    if (updatedPoint === null || updatedPoint === undefined) {
      return;
    }

    const id = updatedPoint.id;

    const actionType = (id === null || id === undefined)
      ? USER_ACTION.ADD_POINT
      : USER_ACTION.UPDATE_POINT;

    this.#handleUserAction(actionType, updatedPoint);
  };

  #handleUserAction(actionType, payload) {
    switch (actionType) {
      case USER_ACTION.UPDATE_POINT:
        this.#pointModel.updatePoint(payload);
        this.#filtersPresenter.update();
        this.#renderEvents();
        break;

      case USER_ACTION.ADD_POINT: {
        const point = payload;

        if (point === null || point === undefined) {
          return;
        }

        let dateFrom = point.dateFrom;
        let dateTo = point.dateTo;

        if (dateFrom === null || dateFrom === undefined) {
          dateFrom = new Date();
        }

        if (dateTo === null || dateTo === undefined) {
          dateTo = new Date(dateFrom.getTime() + 60 * 60 * 1000);
        }

        const pointToAdd = {
          ...point,
          dateFrom,
          dateTo,
        };

        this.#pointModel.addPoint(pointToAdd);
        this.#filtersPresenter.update();
        this.#destroyForm();
        this.#renderEvents();
        break;
      }

      case USER_ACTION.DELETE_POINT: {
        const point = payload;

        if (point === null || point === undefined) {
          return;
        }

        const id = point.id;

        if (id === null || id === undefined) {
          return;
        }

        this.#pointModel.deletePoint(id);

        this.#filtersPresenter.update();
        this.#destroyForm();
        this.#renderEvents();
        break;
      }

      default:
        throw new Error(`Unknown action type: ${actionType}`);
    }
  }

  #makeViewData(point) {
    return {
      point,
      destinations: this.#destinationModel.get(),
      offers: this.#offerModel.get(),
    };
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
