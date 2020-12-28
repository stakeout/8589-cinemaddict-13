const showUserStatus = (num) => {
  if (num === 0) {
    return false;
  } else if (num <= 10) {
    return `Novice`;
  } else if (num <= 20) {
    return `Fan`;
  } else {
    return `Movie Buff`;
  }
};

import AbstractView from './abstract.js';

const createProfileTemplate = (historyCount) => {
  const isUserRating = showUserStatus(historyCount);

  return `
    <section class="header__profile profile">
      ${isUserRating ? `<p class="profile__rating">${isUserRating}</p>` : ``}
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>
  `.trim();
};

export default class UserProfile extends AbstractView {
  constructor(whatchedFilmsCount) {
    super();
    this._whatchedFilmsCount = whatchedFilmsCount;
  }

  _getTemplate() {
    return createProfileTemplate(this._whatchedFilmsCount);
  }
}
