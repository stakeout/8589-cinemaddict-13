import Observer from '../utils/observer.js';

export default class Movies extends Observer {
  constructor() {
    super();
    this._movies = [];
  }

  updateMovie(updateType, updatedMovieObject) {
    const index = this._movies.findIndex((item) => item.id === updatedMovieObject.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting movie`);
    }
    this._movies = [
      ...this._movies.slice(0, index),
      updatedMovieObject,
      ...this._movies.slice(index + 1)
    ];

    this._notify(updateType, updatedMovieObject);
  }

  setMovies(updateType, movies) {
    this._movies = movies.slice();

    this._notify(updateType);
  }

  get movies() {
    return this._movies;
  }

  static adaptToClient(movie) {
    const adaptedMovie = Object.assign(
        {},
        movie,
        {
          id: movie.id,
          actors: movie[`film_info`].actors,
          ageRating: movie[`film_info`].age_rating,
          country: movie[`film_info`].release.release_country,
          description: movie[`film_info`].description,
          duration: movie[`film_info`].runtime,
          genre: movie[`film_info`].genre,
          isFavorite: movie[`user_details`].favorite,
          isInWatchList: movie[`user_details`].watchlist,
          isWatched: movie[`user_details`].already_watched,
          originalTitle: movie[`film_info`].alternative_title,
          poster: movie[`film_info`].poster,
          producer: movie[`film_info`].director,
          releaseDate: movie[`film_info`].release.date,
          screenwriters: movie[`film_info`].writers,
          title: movie[`film_info`].title,
          totalRating: movie[`film_info`].total_rating,
          watchingDate: movie[`user_details`].watching_date,
        }
    );

    // Ненужные ключи мы удаляем
    delete adaptedMovie.film_info;
    delete adaptedMovie.user_details;

    return adaptedMovie;
  }

  static adaptToServer(movie) {
    const adaptedMovie = Object.assign(
        {},
        movie,
        {
          'film_info': {
            'id': movie.id,
            'actors': movie.actors,
            'age_rating': movie.ageRating,
            'alternative_title': movie.originalTitle,
            'description': movie.description,
            'director': movie.producer,
            'genre': movie.genre,
            'poster': movie.poster,
            'release': {
              'date': movie.releaseDate,
              'release_country': movie.country,
            },
            'runtime': movie.duration,
            'title': movie.title,
            'total_rating': movie.totalRating,
            'writers': movie.screenwriters,
          },
          'user_details': {
            'favorite': movie.isFavorite,
            'watchlist': movie.isInWatchList,
            'already_watched': movie.isWatched,
            'watching_date': movie.watchingDate,
          }
        }
    );

    // Ненужные ключи мы удаляем
    delete adaptedMovie.id;
    delete adaptedMovie.actors;
    delete adaptedMovie.ageRating;
    delete adaptedMovie.originalTitle;
    delete adaptedMovie.description;
    delete adaptedMovie.producer;
    delete adaptedMovie.genre;
    delete adaptedMovie.poster;
    delete adaptedMovie.releaseDate;
    delete adaptedMovie.country;
    delete adaptedMovie.duration;
    delete adaptedMovie.title;
    delete adaptedMovie.totalRating;
    delete adaptedMovie.screenwriters;
    delete adaptedMovie.isFavorite;
    delete adaptedMovie.isInWatchList;
    delete adaptedMovie.isWatched;

    return adaptedMovie;
  }
}
