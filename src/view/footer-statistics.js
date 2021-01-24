import AbstractView from "./abstract";
const createFooterStatisticsTemplate = (cards) => {
  return `
    <section class="footer__statistics">
      <p>${cards.length} movies inside</p>
    </section>
  `.trim();
};

export default class FooterStatistics extends AbstractView {
  constructor(cards) {
    super();
    this._cards = cards;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._cards);
  }
}
