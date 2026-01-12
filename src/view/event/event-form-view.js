import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import { formatStringToShortDate, isSelectedOffers } from '../../utils';
import { FORMAT_DATE, TYPES } from '../../const';
import AbstractStatefulView from '../../framework/view/abstract-stateful-view';

const FORM_ID = '1';

function createDestinationListTemplate(destinations) {
  if (!Array.isArray(destinations)) {
    return '';
  }

  return destinations
    .filter((d) => d !== null && d !== undefined && typeof d.name === 'string')
    .map((d) => `<option value="${d.name}"></option>`)
    .join('');
}

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

function createEditItemEventTemplate({ point, offer, destination, destinations }) {

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

  if (destination !== null && destination !== undefined) {
    if (typeof destination.name === 'string') {
      destinationName = destination.name;
    }
  }

  let dateFromValue = '';
  let dateToValue = '';

  if (point !== null && point !== undefined && point.id !== null && point.id !== undefined) {
    dateFromValue = formatStringToShortDate(point.dateFrom, FORMAT_DATE.DATE_TIME);
    dateToValue = formatStringToShortDate(point.dateTo, FORMAT_DATE.DATE_TIME);
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
          <label class="event__type  event__type-btn" for="event-type-toggle-${FORM_ID}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle
          visually-hidden"
          id="event-type-toggle-${FORM_ID}"
          type="checkbox">

          <!-- ВАЖНО: список типов должен быть внутри wrapper, чтобы CSS по :checked сработал -->
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
            class="event__input
            event__input--time"
            id="event-start-time-${FORM_ID}"
            type="text"
            name="event-start-time"
            value="${dateFromValue}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-${FORM_ID}">To</label>
          <input
            class="event__input
            event__input--time"
            id="event-end-time-${FORM_ID}"
            type="text"
            name="event-end-time"
            value="${dateToValue}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${FORM_ID}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input
            event__input--price"
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
  </li>`;
}

export default class EventFormView extends AbstractStatefulView {

  #handleFormSubmit = null;
  #handleFormDelete = null;
  #handleFormClose = null;

  #dateFromPicker = null;
  #dateToPicker = null;

  constructor (eventData) {
    super();

    this.#handleFormSubmit = eventData.handleSubmit;
    this.#handleFormDelete = eventData.handleDelete;
    this.#handleFormClose = eventData.handleClose;

    this._state = {
      point: eventData.point,
      destination: eventData.destination,
      offer: eventData.offer,
    };

    this.#setInnerHandlers();
    this.#initDatepickers();
  }

  #destroyDatepickers() {
    if (this.#dateFromPicker !== null) {
      this.#dateFromPicker.destroy();
      this.#dateFromPicker = null;
    }

    if (this.#dateToPicker !== null) {
      this.#dateToPicker.destroy();
      this.#dateToPicker = null;
    }
  }

  #initDatepickers() {
    this.#destroyDatepickers();

    const dateFromInput = this.element.querySelector(`#event-start-time-${FORM_ID}`);
    const dateToInput = this.element.querySelector(`#event-end-time-${FORM_ID}`);

    this.#dateFromPicker = flatpickr(dateFromInput, {
      enableTime: true,
      // eslint-disable-next-line camelcase
      time_24hr: true,
      dateFormat: 'd/m/y H:i',
      defaultDate: this._state.point.dateFrom,
      onChange: ([selectedDate]) => {
        if (selectedDate === undefined) {
          return;
        }

        this._setState({
          point: {
            ...this._state.point,
            dateFrom: selectedDate,
          },
        });

        if (this.#dateToPicker !== null) {
          this.#dateToPicker.set('minDate', selectedDate);
        }
      },
    });

    if (dateToInput !== null) {
      this.#dateToPicker = flatpickr(dateToInput, {
        enableTime: true,
        // eslint-disable-next-line camelcase
        time_24hr: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.point.dateTo,
        onChange: ([selectedDate]) => {
          if (selectedDate === undefined) {
            return;
          }

          this._setState({
            point: {
              ...this._state.point,
              dateTo: selectedDate,
            },
          });
        },
      });
    }
  }

  #getPointFromForm() {
    const form = this.element.querySelector('form');

    const basePriceInput = form.elements['event-price'];
    let basePriceValue = '0';
    if (basePriceInput !== null && basePriceInput !== undefined) {
      if ('value' in basePriceInput) {
        basePriceValue = basePriceInput.value;
      }
    }

    const basePrice = Number(basePriceValue);

    const currentPoint = this._state.point;

    return {
      ...currentPoint,
      basePrice: Number.isFinite(basePrice) ? basePrice : 0,
      dateFrom: currentPoint.dateFrom,
      dateTo: currentPoint.dateTo,
    };
  }

  #setInnerHandlers() {
    const form = this.element.querySelector('form');

    const priceInput = form.elements['event-price'];
    if (priceInput !== null && priceInput !== undefined) {
      priceInput.addEventListener('input', () => {
        const value = String(priceInput.value);

        const nextValue = value.replace(/[^0-9]/g, '');

        if (nextValue !== value) {
          priceInput.value = nextValue;
        }
      });
    }

    const destinationInput = form.elements['event-destination'];
    if (destinationInput !== null && destinationInput !== undefined) {
      destinationInput.addEventListener('focus', () => {
        destinationInput.select();
      });
    }

    if (destinationInput !== null && destinationInput !== undefined) {
      destinationInput.addEventListener('blur', () => {
        const nextName = destinationInput.value;

        const destinationSource = this._state.destination;
        if (!Array.isArray(destinationSource)) {
          return;
        }

        const matched = destinationSource.find((item) => {
          if (item === null || item === undefined) {
            return false;
          }
          return item.name === nextName;
        });

        if (matched !== undefined) {
          return;
        }

        const currentPoint = this._state.point;
        const currentId = currentPoint.destination;

        const currentDestination = destinationSource.find((item) => {
          if (item === null || item === undefined) {
            return false;
          }
          return item.id === currentId;
        });

        if (currentDestination !== undefined && typeof currentDestination.name === 'string') {
          destinationInput.value = currentDestination.name;
        } else {
          destinationInput.value = '';
        }
      });
    }

    form.addEventListener('submit', (evt) => {
      evt.preventDefault();
      const updatedPoint = this.#getPointFromForm();
      this.#handleFormSubmit(updatedPoint);
    });

    form.addEventListener('change', (evt) => {
      if (evt.target.name === 'event-type') {
        const nextType = evt.target.value;

        const nextPoint = {
          ...this._state.point,
          type: nextType,
          offers: [],
        };

        const typeToggle = this.element.querySelector(`#event-type-toggle-${FORM_ID}`);
        if (typeToggle !== null) {
          typeToggle.checked = false;
        }

        this.updateElement({ point: nextPoint });
      }

      if (evt.target.name === 'event-destination') {
        const nextName = evt.target.value;

        const destinationSource = this._state.destination;

        if (!Array.isArray(destinationSource)) {
          return;
        }

        const nextDestination = destinationSource.find((item) => {
          if (item === null || item === undefined) {
            return false;
          }
          return item.name === nextName;
        });

        if (nextDestination === undefined) {
          return;
        }

        const nextPoint = {
          ...this._state.point,
          destination: nextDestination.id,
        };

        this.updateElement({
          point: nextPoint,
          destination: destinationSource,
        });
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

        const point = this._state.point;

        const isEditForm = point !== null && point !== undefined
          && point.id !== null && point.id !== undefined;

        if (isEditForm) {
          if (typeof this.#handleFormDelete === 'function') {
            const pointToDelete = this.#getPointFromForm();
            this.#handleFormDelete(pointToDelete);
          }
          return;
        }

        this.#handleFormClose();
      });
    }

  }

  get template() {
    const point = this._state.point;
    const offerSource = this._state.offer;
    const destinationSource = this._state.destination;

    let destinationForPoint = null;

    if (Array.isArray(destinationSource)) {
      destinationForPoint = destinationSource.find((item) => {
        if (item === null || item === undefined) {
          return false;
        }
        return item.id === point.destination;
      });

      if (destinationForPoint === undefined) {
        destinationForPoint = null;
      }
    } else {
      destinationForPoint = destinationSource;
    }

    let offerForCurrentType = null;
    if (Array.isArray(offerSource)) {
      offerForCurrentType = offerSource.find((item) => {
        if (item === null || item === undefined) {
          return false;
        }
        return item.type === point.type;
      });

      if (offerForCurrentType === undefined) {
        offerForCurrentType = null;
      }
    } else {
      offerForCurrentType = offerSource;
    }

    return createEditItemEventTemplate({
      point,
      destination: destinationForPoint,
      destinations: destinationSource,
      offer: offerForCurrentType
    });

  }

  _restoreHandlers() {
    this.#setInnerHandlers();
  }
}
