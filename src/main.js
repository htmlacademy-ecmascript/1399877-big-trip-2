import AppPresenter from './presenter/app-presenter';
import Service from './service/service';
import PointModel from './model/point-model';
import OfferModel from './model/offer-model';
import DestinationModel from './model/destination-model';
import FilterModel from './model/filter-model';

const headerContainer = document.querySelector('.trip-main');
const filtersContainer = document.querySelector('.trip-controls__filters');
const mainContainer = document.querySelector('.trip-events');

const service = new Service();
const pointModel = new PointModel(service);
const offerModel = new OfferModel(service);
const destinationModel = new DestinationModel(service);
const filterModel = new FilterModel();

const appPresenter = new AppPresenter({
  headerContainer,
  filtersContainer,
  mainContainer,
  pointModel,
  offerModel,
  destinationModel,
  filterModel
});

appPresenter.init();

