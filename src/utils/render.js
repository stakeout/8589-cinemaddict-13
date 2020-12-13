import AbstractView from '../view/abstract.js';

const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

const renderTemplate = (container, template, place) => {
  if (container instanceof AbstractView) {
    container = container.getElement();
  }
  container.insertAdjacentHTML(place, template);
};

const render = (container, child, place) => {
  if (container instanceof AbstractView) {
    container = container.getElement();
  }
  if (child instanceof AbstractView) {
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

const remove = (component) => {
  if (!(component instanceof AbstractView)) {
    throw new Error(`Can remove only components`);
  }
  component.getElement().remove();
  component.removeElement();
};

const replace = (newChild, oldChild) => {
  if (oldChild instanceof AbstractView) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof AbstractView) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (parent === null || oldChild === null || newChild === null) {
    throw new Error(`Can't replace unexisting elements`);
  }

  parent.replaceChild(newChild, oldChild);
};

export {
  renderTemplate,
  RenderPosition,
  render,
  createElement,
  remove,
  replace,
};
