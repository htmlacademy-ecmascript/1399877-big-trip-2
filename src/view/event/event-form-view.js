import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import { isSelectedOffers } from '../../utils';
import { TYPES } from '../../const';
import AbstractStatefulView from '../../framework/view/abstract-stateful-view';

const FORM_ID = '1';

function createDestinationListTemplate(destinations) {
  return destinations.map((destination) => `<option value="${destination.name}"></option>`).join('');
}

function createOffersListTemplate(offer, selectedOffers) {
  const selectedIds = Array.isArray(selectedOffers)
    ? selectedOffers.map((x) => (typeof x === 'object' && x !== null ? x.id : x))
    : [];

  return offer.offers.map((item) => `
    <div class="event__offer-selector">
      <input
        class="event__offer-checkbox visually-hidden"
        id="event-offer-${item.id}"
        type="checkbox"
        name="event-offer-${item.id}"
        ${selectedIds.includes(item.id) ? 'checked' : ''}
      >
      <label class="event__offer-label" for="event-offer-${item.id}">
        <span class="event__offer-title">${item.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${item.price}</span>
      </label>
    </div>
  `).join('');
}

function createEventPicturesTemplate(pictures) {
  return pictures.map((picture) => `
    <img class="event__photo" src="${picture.src}" alt="${picture.description}">
  `).join('');
}

function createDestinationTemplate(destination) {
  if (!destination) {
    return '';
  }

  return `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description ?? ''}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${createEventPicturesTemplate(destination.pictures ?? [])}
        </div>
      </div>
    </section>
  `;
}

function createEventTypeGroupTemplate(currentType) {
  return TYPES.map((type) => `
    <div class="event__type-item">
      <input
        id="event-type-${type}-${FORM_ID}"
        class="event__type-input visually-hidden"
        type="radio"
        name="event-type"
        value="${type}"
        ${type === currentType ? 'checked' : ''}
      >
      <label class="event__type-label event__type-label--${type}" for="event-type-${type}-${FORM_ID}">
        ${type[0].toUpperCase() + type.slice(1)}
      </label>
    </div>
  `).join('');
}

function createEditItemEventTemplate({ point, offer, destination, destinations, isEdit }) {
  const offersSectionTemplate = offer.offers.length > 0
    ? `
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${createOffersListTemplate(offer, point.offers)}
        </div>
      </section>
    `
    : '';

  const destinationSectionTemplate = destination ? createDestinationTemplate(destination) : '';
  const destinationName = destination?.name ?? '';

  const resetButtonText = isEdit ? 'Delete' : 'Cancel';
  const rollupButtonTemplate = isEdit
    ? '<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>'
    : '';

  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${FORM_ID}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle visually-hidden" id="event-type-toggle-${FORM_ID}" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${createEventTypeGroupTemplate(point.type)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${FORM_ID}">
              ${point.type}
            </label>
            <input
              class="event__input  event__input--destination"
              id="event-destination-${FORM_ID}"
              list="destination-list-${FORM_ID}"
              type="text"
              name="event-destination"
              value="${destinationName}"
            >
            <datalist id="destination-list-${FORM_ID}">
              ${createDestinationListTemplate(destinations)}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${FORM_ID}">From</label>
            <input
              class="event__input event__input--time"
              id="event-start-time-${FORM_ID}"
              type="text"
              name="event-start-time"
              value="">
            &mdash;
            <label class="visually-hidden" for="event-end-time-${FORM_ID}">To</label>
            <input
              class="event__input event__input--time"
              id="event-end-time-${FORM_ID}"
              type="text"
              name="event-end-time"
              value="">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${FORM_ID}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input
              class="event__input event__input--price"
              id="event-price-${FORM_ID}"
              type="text"
              name="event-price"
              value="${point.basePrice}"
            >
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${resetButtonText}</button>
          ${rollupButtonTemplate}
        </header>

        <section class="event__details">
          ${offersSectionTemplate}
          ${destinationSectionTemplate}
        </section>
      </form>
    </li>
  `;
}

export default class EventFormView extends AbstractStatefulView {
  #handleFormSubmit = null;
  #handleFormDelete = null;
  #handleFormClose = null;

  #dateFromPicker = null;
  #dateToPicker = null;

  constructor(eventData) {
    super();

    this.#handleFormSubmit = eventData.handleSubmit;
    this.#handleFormDelete = eventData.handleDelete;
    this.#handleFormClose = eventData.handleClose;

    this._state = {
      point: eventData.point,
      destinations: eventData.destinations,
      offers: eventData.offers,
    };

    this.#setInnerHandlers();
    this.#initDatepickers();
  }

  get #isEditForm() {
    return Boolean(this._state.point.id);
  }

  get #destinationForPoint() {
    return this._state.destinations.find(
      (d) => d.id === this._state.point.destination
    ) ?? null;
  }

  get #offerForCurrentType() {
    return this._state.offers.find(
      (o) => o.type === this._state.point.type
    ) ?? { offers: [] };
  }

  get template() {
    return createEditItemEventTemplate({
      point: this._state.point,
      destination: this.#destinationForPoint,
      destinations: this._state.destinations,
      offer: this.#offerForCurrentType,
      isEdit: this.#isEditForm,
    });
  }

  #destroyDatepickers() {
    this.#dateFromPicker?.destroy();
    this.#dateToPicker?.destroy();

    this.#dateFromPicker = null;
    this.#dateToPicker = null;
  }

  #initDatepickers() {
    this.#destroyDatepickers();

    const dateFromInput = this.element.querySelector(`#event-start-time-${FORM_ID}`);
    const dateToInput = this.element.querySelector(`#event-end-time-${FORM_ID}`);

    this.#dateFromPicker = flatpickr(dateFromInput, this.#getDateFromPickerConfig());
    this.#dateToPicker = flatpickr(dateToInput, this.#getDateToPickerConfig());
  }

  #getDateFromPickerConfig() {
    return {
      enableTime: true,
      time_24hr: true,
      dateFormat: 'd/m/y H:i',
      defaultDate: this._state.point.dateFrom,
      onChange: this.#handleDateFromChange,
    };
  }

  #getDateToPickerConfig() {
    return {
      enableTime: true,
      time_24hr: true,
      dateFormat: 'd/m/y H:i',
      defaultDate: this._state.point.dateTo,
      minDate: this._state.point.dateFrom,
      onChange: this.#handleDateToChange,
    };
  }

  #handleDateFromChange = ([selectedDate]) => {
    if (!selectedDate) {
      return;
    }

    const currentDateTo = this._state.point.dateTo;

    const nextDateTo = (currentDateTo && currentDateTo < selectedDate)
      ? selectedDate
      : currentDateTo;

    this._setState({
      point: {
        ...this._state.point,
        dateFrom: selectedDate,
        dateTo: nextDateTo,
      },
    });

    this.#dateToPicker?.set('minDate', selectedDate);

    if (nextDateTo === selectedDate) {
      this.#dateToPicker?.setDate(selectedDate, false);
    }
  };

  #handleDateToChange = ([selectedDate]) => {
    if (!selectedDate) {
      return;
    }

    this._setState({
      point: { ...this._state.point, dateTo: selectedDate },
    });
  };

  #handlePriceInput = (evt) => {
    const input = evt.target;
    const cleaned = input.value.replace(/\D/g, '');

    if (cleaned !== input.value) {
      input.value = cleaned;
    }
  };

  #handleDestinationBlur = (evt) => {
    const input = evt.target;
    const nextName = input.value;

    const matched = this._state.destinations.find((d) => d.name === nextName);
    if (matched) {
      return;
    }

    const currentDestination = this._state.destinations.find(
      (d) => d.id === this._state.point.destination
    );

    input.value = currentDestination?.name ?? '';
  };

  #handleFormSubmitInternal = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(this.#getPointFromForm());
  };

  #handleResetClick = (evt) => {
    evt.preventDefault();

    if (this.#isEditForm) {
      this.#handleFormDelete(this.#getPointFromForm());
      return;
    }

    this.#handleFormClose();
  };

  #handleFormChange = (evt) => {
    if (evt.target.name === 'event-type') {
      const nextType = evt.target.value;

      this.element.querySelector(`#event-type-toggle-${FORM_ID}`).checked = false;

      this.updateElement({
        point: {
          ...this._state.point,
          type: nextType,
          offers: [],
        },
      });

      return;
    }

    if (evt.target.name === 'event-destination') {
      const nextName = evt.target.value;

      const nextDestination = this._state.destinations.find((d) => d.name === nextName);
      if (!nextDestination) {
        return;
      }

      this.updateElement({
        point: {
          ...this._state.point,
          destination: nextDestination.id,
        },
      });

      return;
    }

    if (evt.target.classList.contains('event__offer-checkbox')) {
      const selectedOfferIds = Array.from(
        this.element.querySelectorAll('.event__offer-checkbox:checked')
      ).map((input) => input.name.replace('event-offer-', ''));

      this._setState({
        point: {
          ...this._state.point,
          offers: selectedOfferIds,
        },
      });
    }
  };

  #getPointFromForm() {
    const form = this.element.querySelector('form');
    const basePrice = Number(form.elements['event-price'].value);

    return {
      ...this._state.point,
      basePrice: Number.isFinite(basePrice) ? basePrice : 0,
      offers: this._state.point.offers,
    };
  }

  #setInnerHandlers() {
    const form = this.element.querySelector('form');
    const priceInput = form.elements['event-price'];
    const destinationInput = form.elements['event-destination'];

    priceInput.addEventListener('input', this.#handlePriceInput);
    destinationInput.addEventListener('blur', this.#handleDestinationBlur);
    form.addEventListener('submit', this.#handleFormSubmitInternal);
    form.addEventListener('change', this.#handleFormChange);

    const rollupButton = this.element.querySelector('.event__rollup-btn');
    rollupButton?.addEventListener('click', this.#handleFormClose);

    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#handleResetClick);
  }

  _restoreHandlers() {
    this.#setInnerHandlers();
    this.#initDatepickers();
  }
}
