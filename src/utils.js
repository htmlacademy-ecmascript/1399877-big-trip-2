import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {CITIES} from './mock/const';
import { FILTER_TYPES } from './const';

dayjs.extend(duration);

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

export function callcDate(dateFrom,dateTo){
  const from = dayjs(dateFrom);
  const to = dayjs(dateTo);
  const diff = to.diff(from);
  const d = dayjs.duration(diff);
  const days = d.days();
  const hours = d.hours();
  const minutes = d.minutes();

  const parts = [];

  if (days > 0) {
    parts.push(`${days}D`);
  }

  if (hours > 0 || days > 0) {
    const hoursStr = String(hours).padStart(2, '0');
    parts.push(`${hoursStr}H`);
  }

  const minutesStr = String(minutes).padStart(2, '0');
  parts.push(`${minutesStr}M`);

  return parts.join(' ');

}

export function createDataListCitys () {
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

const isDateFuture = (dateFrom) => dayjs().isBefore(dateFrom);

const isDatePast = (dateTo) => dayjs().isAfter(dateTo);

const isDatePresent = (dateFrom, dateTo) => dayjs().isAfter(dateFrom) && dayjs().isBefore(dateTo);

export const filter = {
  [FILTER_TYPES.EVERYTHING] : (points) => [...points],
  [FILTER_TYPES.FUTURE] : (points) => points.filter((point) => isDateFuture(point)),
  [FILTER_TYPES.PRESENT] : (points) => points.filter((point) => isDatePresent(point)),
  [FILTER_TYPES.PAST] : (points) => points.filter((point) => isDatePast(point)),
};
