import AbstractView from './abstract.js';

const createStatsTemplate = () => {
  return `<a href="#stats" class="main-navigation__additional">Stats</a>`;
};

export default class Stats extends AbstractView {

  _getTemplate() {
    return createStatsTemplate();
  }
}
