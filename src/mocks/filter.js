const movieToFilterMap = {
  watchlist: (movies) => movies
    .filter((task) => task.isInWatchList).length,
  history: (movies) => movies
    .filter((task) => task.isWatched).length,
  favorites: (movies) => movies
    .filter((task) => task.isFavorite).length,
};

const generateFilter = (movies) => {
  return Object.entries(movieToFilterMap).map(([filterName, filterFunction]) => {
    return {
      name: filterName,
      count: filterFunction(movies),
    };
  });
};

export {generateFilter};
