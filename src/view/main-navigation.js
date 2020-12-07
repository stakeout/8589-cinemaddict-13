import AbstractView from './abstract.js';

const createMainNavTemplate = () => {
  return `<nav class="main-navigation"></nav>`;
};

export default class MainNavContainer extends AbstractView {

  _getTemplate() {
    return createMainNavTemplate();
  }
}
