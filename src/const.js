export const TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant'
];

export const FORMAT_DATE = {
  FULL_DATE_TIME: 'YYYY-MM-DDTHH:mm',
  DATE_TIME: 'DD/MM/YY HH:mm',
  DATE_ONLY: 'YYYY-MM-DD',
  DATE: 'MMM DD',
  TIME:'HH:mm'
};

export const BLANK_POINT = {
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: [],
  isFavorite: false,
  offers: [],
  type: 'flight'
};

export const FILTER_TYPES = {
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
  EVERYTHING: 'everything'
};

export const SORT_TYPE = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers'
};

export const USER_ACTION = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT'
};
