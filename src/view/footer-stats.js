import AbstractView from './abstract.js';

const createFooterStatsTemplate = (count) => {
  return `<p>${count} movies inside</p>`;
};

export default class FooterStats extends AbstractView {
  constructor(filmsLength) {
    super();
    this._filmsAmount = filmsLength;
  }

  _getTemplate() {
    return createFooterStatsTemplate(this._filmsAmount);
  }
}
