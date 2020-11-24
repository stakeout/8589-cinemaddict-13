const createFilterItemTemplate = ({name, count}) => {
  return `<a href="#${name}" class="main-navigation__item">${name} <span class="main-navigation__item-count">${count}</span></a>`;
};

const createFilterItemsTemplate = (filters) => {
  const filterItems = filters.map(createFilterItemTemplate).join(``);
  return `<div class="main-navigation__items">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    ${filterItems}
  </div>`;
};

export {createFilterItemsTemplate};
