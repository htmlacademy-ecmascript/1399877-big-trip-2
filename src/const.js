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
  basePrice: null,
  dateFrom: null,
  dateTo: null,
  destination: null,
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
