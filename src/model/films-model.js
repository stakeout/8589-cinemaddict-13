import Observer from "../utils/observer";

export default class FilmsModel extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films.slice();
    this._notify(updateType);
  }

  getFilms() {
    return this._films;
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting film`);
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign(
        {},
        film,
        {
          title: film[`film_info`].title,
          originTitle: film[`film_info`].alternative_title,
          rating: film[`film_info`].total_rating,
          poster: film[`film_info`].poster,
          ageRating: film[`film_info`].age_rating,
          director: film[`film_info`].director,
          writers: film[`film_info`].writers,
          actors: film[`film_info`].actors,
          releaseDate: new Date(film[`film_info`].release.date),
          country: film[`film_info`].release.release_country,
          runtime: film[`film_info`].runtime,
          genres: film[`film_info`].genre,
          description: film[`film_info`].description,
          isWatchlist: film[`user_details`].watchlist,
          isWatched: film[`user_details`].already_watched,
          watchingDate: film[`user_details`].watching_date !== null ? new Date(film[`user_details`].watching_date) : null,
          isFavorites: film[`user_details`].favorite,

        }
    );

    delete adaptedFilm.film_info;
    delete adaptedFilm.user_details;

    return adaptedFilm;
  }

  static adaptToServer(film) {
    const adaptedFilm = Object.assign(
        {},
        film,
        {
          "film_info": {
            "title": film.title,
            "alternative_title": film.originTitle,
            "total_rating": film.rating,
            "poster": film.poster,
            "age_rating": film.ageRating,
            "director": film.director,
            "writers": film.writers,
            "actors": film.actors,
            "release": {
              "date": film.releaseDate.toISOString(),
              "release_country": film.country,
            },
            "runtime": film.runtime,
            "genre": film.genres,
            "description": film.description,
          },
          "user_details": {
            "watchlist": film.isWatchlist,
            "already_watched": film.isWatched,
            "watching_date": film.watchingDate !== null ? film.watchingDate.toISOString() : null,
            "favorite": film.isFavorites,
          }

        }
    );

    delete adaptedFilm.title;
    delete adaptedFilm.originTitle;
    delete adaptedFilm.rating;
    delete adaptedFilm.poster;
    delete adaptedFilm.ageRating;
    delete adaptedFilm.director;
    delete adaptedFilm.writers;
    delete adaptedFilm.actors;
    delete adaptedFilm.releaseDate;
    delete adaptedFilm.country;
    delete adaptedFilm.runtime;
    delete adaptedFilm.genres;
    delete adaptedFilm.description;
    delete adaptedFilm.isWatchlist;
    delete adaptedFilm.isWatched;
    delete adaptedFilm.isFavorites;

    return adaptedFilm;
  }
}
