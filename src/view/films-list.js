import AbstractView from "./abstract";

const getExtraAttribute = (isExtra) => {
  return isExtra
    ? `--extra`
    : ``;
};

const getHiddenAttribute = (isHidden) => {
  return isHidden
    ? `visually-hidden`
    : ``;
};

const createFilmsListTemplate = (header) => {
  const {title, isExtra, isHidden} = header;
  const extra = getExtraAttribute(isExtra);
  const hiddenTitle = getHiddenAttribute(isHidden);
  return `
    <section class="films-list${extra}">
      <h2 class="films-list__title ${hiddenTitle}">${title}</h2>
    </section>
  `.trim();
};

export default class FilmsList extends AbstractView {
  constructor(header) {
    super();
    this._header = header;
  }

  getTemplate() {
    return createFilmsListTemplate(this._header);
  }
}

