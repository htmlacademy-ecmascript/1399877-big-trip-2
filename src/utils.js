import dayjs from 'dayjs';
import {CITIES} from './mock/const';
import { FILTER_TYPES } from './const';

export function getRandomInteger(a = 0, b = 1){
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a,b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
}

export function getRandomValue(items){
  return items[getRandomInteger(0, items.length - 1)];
}

export function formatStringToShortDate(date, formatDate) {
  return dayjs(date).format(formatDate);
}

export function callcDate(dateFrom, dateTo) {
  if (dateFrom === null || dateFrom === undefined) {
    return '';
  }

  if (dateTo === null || dateTo === undefined) {
    return '';
  }

  const from = dayjs(dateFrom);
  const to = dayjs(dateTo);

  if (from.isValid() === false || to.isValid() === false) {
    return '';
  }

  const diffMinutes = to.diff(from, 'minute');

  if (diffMinutes < 0) {
    return '';
  }

  const MINUTES_IN_HOUR = 60;
  const MINUTES_IN_DAY = 24 * MINUTES_IN_HOUR;

  const days = Math.floor(diffMinutes / MINUTES_IN_DAY);
  const hours = Math.floor((diffMinutes % MINUTES_IN_DAY) / MINUTES_IN_HOUR);
  const minutes = diffMinutes % MINUTES_IN_HOUR;

  if (days === 0 && hours === 0) {
    return `${minutes}M`;
  }

  const hoursStr = String(hours).padStart(2, '0');
  const minutesStr = String(minutes).padStart(2, '0');

  if (days === 0) {
    return `${hoursStr}H ${minutesStr}M`;
  }

  const daysStr = String(days).padStart(2, '0');
  return `${daysStr}D ${hoursStr}H ${minutesStr}M`;
}

export function createDataListCities () {
  return CITIES.map((city) => `<option value="${city}"></option>`).join('');
}

export function isSelectedOffers (offer, selectedOffers) {
  return !!selectedOffers.find((item) => item === offer.id);
}

export function isFavoriteClass(isFavorite) {
  return isFavorite ? 'event__favorite-btn--active' : '';
}

export function isEditMode (point) {
  return Boolean(point.id);
}

const toMs = (value) => {
  if (value === null || value === undefined) {
    return null;
  }

  const ms = new Date(value).getTime();

  if (Number.isNaN(ms)) {
    return null;
  }

  return ms;
};

const isDateFuture = (dateFrom) => {
  const start = toMs(dateFrom);
  if (start === null) {
    return false;
  }

  return Date.now() < start;
};

const isDatePast = (dateTo) => {
  const end = toMs(dateTo);
  if (end === null) {
    return false;
  }

  return Date.now() > end;
};

const isDatePresent = (dateFrom, dateTo) => {
  const start = toMs(dateFrom);
  const end = toMs(dateTo);

  if (start === null || end === null) {
    return false;
  }

  const now = Date.now();
  return now >= start && now <= end;
};

export const filter = {
  [FILTER_TYPES.EVERYTHING]: (points) => [...points],
  [FILTER_TYPES.FUTURE]: (points) => points.filter((p) => p.dateFrom && isDateFuture(p.dateFrom)),
  [FILTER_TYPES.PRESENT]: (points) => points.filter((p) => p.dateFrom && p.dateTo && isDatePresent(p.dateFrom, p.dateTo)),
  [FILTER_TYPES.PAST]: (points) => points.filter((p) => p.dateTo && isDatePast(p.dateTo)),
};

export function getFiltersAvailability(points) {
  return {
    [FILTER_TYPES.EVERYTHING]: true,
    [FILTER_TYPES.FUTURE]: filter[FILTER_TYPES.FUTURE](points).length > 0,
    [FILTER_TYPES.PRESENT]: filter[FILTER_TYPES.PRESENT](points).length > 0,
    [FILTER_TYPES.PAST]: filter[FILTER_TYPES.PAST](points).length > 0,
  };
}
