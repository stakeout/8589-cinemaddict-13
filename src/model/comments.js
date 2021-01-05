import Observer from '../utils/observer.js';

export default class Comments extends Observer {
  constructor() {
    super();
  }

  addComment(updateType, newMovieObject) {
    this._notify(updateType, newMovieObject);
  }

  deleteComment(updateType) {

    this._notify(updateType);
  }

  get comments() {
    return this._comments;
  }

  static adaptToClient(movieObject) {
    let {movie, comments} = movieObject;
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

    const result = {};
    result.movie = adaptedMovie;
    result.comments = comments;

    return result;
  }
}
