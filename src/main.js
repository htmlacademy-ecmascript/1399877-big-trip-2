import AppPresenter from './presenter/app-presenter';

const tripHeaderContainer = document.querySelector('.trip-main');
const tripMainContainer = document.querySelector('.trip-events');

const appPresenter = new AppPresenter({
  headerContainer: tripHeaderContainer,
  mainContainer: tripMainContainer
});

appPresenter.init();

