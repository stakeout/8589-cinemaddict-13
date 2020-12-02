import AbstractView from './abstract.js';

const createFilmsContainerTemplate = () => (
  `<section class="films"></section>`
);

export default class FilmsContainer extends AbstractView {

  _getTemplate() {
    return createFilmsContainerTemplate();
  }
}
