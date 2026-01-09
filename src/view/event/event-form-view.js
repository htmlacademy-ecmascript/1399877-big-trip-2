import { formatStringToShortDate, createDataListCities, isSelectedOffers } from '../../utils';
import { FORMAT_DATE, TYPES } from '../../const';
import AbstractView from '../../framework/view/abstract-view';

function createOffersListTemplate (offer, selectedOffers) {
  if (offer === null || offer === undefined) {
    return '';
  }

  if (!Array.isArray(offer.offers)) {
    return '';
  }

  if (offer.offers.length === 0) {
    return '';
  }
  return offer.offers.map((item) => (
    `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox visually-hidden"
        id="event-offer-${item.id}"
        type="checkbox"
        name="event-offer-${item.id}"
        ${isSelectedOffers(item, selectedOffers) ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${item.id}">
        <span class="event__offer-title">${item.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${item.price}</span>
      </label>
    </div>
    `
  )
  ).join('');
}

function createEventPicturesTemplate (pictures) {
  return pictures.map((picture) => (
    `
      <img class="event__photo" src="${picture.src}" alt="${picture.description}">
    `
  )
  ).join('');
}

function createDestinationTemplate(destination) {
  if (destination === null || destination === undefined) {
    return '';
  }

  let description = '';
  if (typeof destination.description === 'string') {
    description = destination.description;
  }

  let pictures = [];
  if (Array.isArray(destination.pictures)) {
    pictures = destination.pictures;
  }

  return `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${createEventPicturesTemplate(pictures)}
        </div>
      </div>
    </section>
  `;
}


function createEventTypeGroupTemplate(currentType) {
  return TYPES.map((type) => `
    <div class="event__type-item">
      <input
        id="event-type-${type}-1"
        class="event__type-input visually-hidden"
        type="radio"
        name="event-type"
        value="${type}"
        ${type === currentType ? 'checked' : ''}
      >
      <label class="event__type-label event__type-label--${type}" for="event-type-${type}-1">
        ${type[0].toUpperCase() + type.slice(1)}
      </label>
    </div>
  `).join('');
}

function createEditItemEventTemplate({ point, offer, destination }) {
  let isEdit = false;
  if (point !== null && point !== undefined) {
    if (point.id !== null && point.id !== undefined) {
      isEdit = true;
    }
  }


  let selectedOffers = [];
  if (point !== null && point !== undefined && Array.isArray(point.offers)) {
    selectedOffers = point.offers;
  }

  let offersSectionTemplate = '';

  if (offer !== null && offer !== undefined && Array.isArray(offer.offers) && offer.offers.length > 0) {
    offersSectionTemplate = `
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${createOffersListTemplate(offer, selectedOffers)}
        </div>
      </section>
    `;
  }

  let destinationSectionTemplate = '';

  if (destination !== null && destination !== undefined) {
    destinationSectionTemplate = createDestinationTemplate(destination);
  }

  let destinationName = '';

  if (isEdit === true) {
    if (destination !== null && destination !== undefined) {
      if (typeof destination.name === 'string') {
        destinationName = destination.name;
      }
    }
  }

  let dateFromValue = '';
  let dateToValue = '';

  if (isEdit === true) {
    if (point !== null && point !== undefined) {
      dateFromValue = formatStringToShortDate(point.dateFrom, FORMAT_DATE.DATE_TIME);
      dateToValue = formatStringToShortDate(point.dateTo, FORMAT_DATE.DATE_TIME);
    }
  }

  let resetButtonText = 'Cancel';
  let rollupButtonTemplate = '';

  if (point !== null && point !== undefined) {
    if (point.id !== null && point.id !== undefined) {
      resetButtonText = 'Delete';
      rollupButtonTemplate = '<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>';
    }
  }

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <!-- ВАЖНО: список типов должен быть внутри wrapper, чтобы CSS по :checked сработал -->
          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${createEventTypeGroupTemplate(point.type)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${point.type}
          </label>
          <input
            class="event__input  event__input--destination"
            id="event-destination-1"
            type="text"
            name="event-destination"
            value="${destinationName}"
            list="destination-list-1"
          >
          <datalist id="destination-list-1">
            ${createDataListCities()}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input
            class="event__input
            event__input--time"
            id="event-start-time-1"
            type="text"
            name="event-start-time"
            value="${dateFromValue}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
          <input
            class="event__input
            event__input--time"
            id="event-end-time-1"
            type="text" name="event-end-time"
            value="${dateToValue}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${point.basePrice}">
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
  </li>`;
}

export default class EventFormView extends AbstractView {
  #point = {};
  #destination = {};
  #offer = {};

  #handleFormSubmit = null;
  #handleFormClose = null;
  #handleTypeChange = null;

  constructor (eventData) {
    super();
    this.#point = eventData.point;
    this.#destination = eventData.destination;
    this.#offer = eventData.offer;

    this.#handleFormSubmit = eventData.handleSubmit;
    this.#handleFormClose = eventData.handleClose;
    this.#handleTypeChange = eventData.handleTypeChange;

    this.#setInnerHandlers();
  }

  #getPointFromForm() {
    const form = this.element.querySelector('form');

    const basePriceInput = form.querySelector('#event-price-1');
    const dateFromInput = form.querySelector('#event-start-time-1');
    const dateToInput = form.querySelector('#event-end-time-1');

    const basePrice = Number(basePriceInput?.value ?? 0);

    return {
      ...this.#point,
      basePrice: Number.isFinite(basePrice) ? basePrice : 0,
      dateFrom: dateFromInput?.value ?? this.#point.dateFrom,
      dateTo: dateToInput?.value ?? this.#point.dateTo,
    };
  }

  #setInnerHandlers() {
    const form = this.element.querySelector('form');

    form.addEventListener('submit', (evt) => {
      evt.preventDefault();
      const updatedPoint = this.#getPointFromForm();
      this.#handleFormSubmit(updatedPoint);
    });

    form.addEventListener('change', (evt) => {
      if (evt.target.name === 'event-type') {
        this.#handleTypeChange(evt.target.value);
      }
    });

    const rollupButton = this.element.querySelector('.event__rollup-btn');
    if (rollupButton !== null) {
      rollupButton.addEventListener('click', () => {
        this.#handleFormClose();
      });
    }

    const resetButton = this.element.querySelector('.event__reset-btn');
    if (resetButton !== null) {
      resetButton.addEventListener('click', (evt) => {
        evt.preventDefault();
        this.#handleFormClose();
      });
    }
  }


  get template() {
    return createEditItemEventTemplate({
      point: this.#point,
      destination: this.#destination,
      offer: this.#offer
    });
  }
}
