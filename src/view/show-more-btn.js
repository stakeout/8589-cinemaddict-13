import AbstractView from './abstract.js';

const createShowMoreBtnTemplate = () => (
  `<button class="films-list__show-more">Show more</button>`
);

export default class ShowMoreButton extends AbstractView {

  _getTemplate() {
    return createShowMoreBtnTemplate();
  }
}
