import Abstract from '../view/abstract.js';
import CardView from '../view/card.js';

// const renderMovieCard = (moviesListElement, movieObject) => {
//   const movieCardComponent = new CardView(movieObject);

//   movieCardComponent.setMovieCardClickHandler(renderPopup);

//   render(moviesListElement, movieCardComponent, RenderPosition.BEFOREEND);
// };

const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

const renderTemplate = (container, template, place) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }
  container.insertAdjacentHTML(place, template);
};

const render = (container, child, place) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }
  if (child instanceof Abstract) {
    child = child.getElement();
  }
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(child);
      break;
    case RenderPosition.BEFOREEND:
      container.append(child);
      break;
  }
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export {
  renderTemplate,
  RenderPosition,
  render,
  createElement,
};
