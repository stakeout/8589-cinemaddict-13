import dayjs from "dayjs";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import SmartView from "./smart";
import {filter} from "../utils/filter";
import {FilterType} from "../consts";
import {getUserStatus} from "../utils/helper";

const MINUTES_IN_HOUR = 60;

const getAllGenres = (watchedMovies) => {
  let allGenres = [];
  for (let i = 0; i < watchedMovies.length; i += 1) {
    allGenres = allGenres.concat(watchedMovies[i].genres);
  }

  return allGenres
  .map((genre) => {
    return {
      count: 1,
      genre
    };
  })
  .reduce((a, b) => {
    a[b.genre] = (a[b.genre] || 0) + b.count;
    return a;
  }, {});
};

const getPopularGenre = (watchedMovies) => {
  const frequentGenre = Math.max(...Object.values(getAllGenres(watchedMovies)));
  const popularGenre = Object.keys(getAllGenres(watchedMovies)).find((key) => getAllGenres(watchedMovies)[key] === frequentGenre);

  return popularGenre !== undefined
    ? popularGenre
    : ``;
};

const renderPeriodChart = (statisticCtx, movies) => {
  const allGenres = Object.keys(getAllGenres(movies));
  const watchedMoviesGenresCount = Object.values(getAllGenres(movies));
  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: allGenres,
      datasets: [{
        data: watchedMoviesGenresCount,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const getDayToCompareWith = () => {
  return `${new Date().getFullYear()} ${new Date().getMonth()} ${new Date().getDate()}`;
};

const getWeekToCompareWith = () => {
  const now = new Date();
  now.setDate(now.getDate() - 6);
  return now;
};

const getMonthToCompareWith = () => {
  const now = new Date();
  now.setMonth(now.getMonth() - 1);
  return now;
};

const getYearToCompareWith = () => {
  const now = new Date();
  now.setFullYear(now.getFullYear() - 1);
  return now;
};


const createStatsTemplate = (allWatchedMovies, {watchedMovies, checked}) => {
  const historyCount = filter[FilterType.HISTORY](allWatchedMovies).length;
  const userStatus = getUserStatus(historyCount);
  const generalRuntime = watchedMovies.reduce((sum, {runtime}) => {
    return sum + runtime;
  }, 0);

  const getRuntimeInHours = Math.floor(generalRuntime / MINUTES_IN_HOUR);
  const getRuntimeInMinutes = generalRuntime % MINUTES_IN_HOUR;
  return `
    <section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        ${historyCount ? `<span class="statistic__rank-label">${userStatus}</span>` : ``}
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">

        <p class="statistic__filters-description">Show stats:</p>

        <input
          type="radio"
          class="statistic__filters-input visually-hidden"
          name="statistic-filter"
          id="statistic-all-time"
          value="all-time"
          ${checked === `all-time` ? `checked` : ``}>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>

        <input
          type="radio"
          class="statistic__filters-input visually-hidden"
          name="statistic-filter"
          id="statistic-today" value="today"
          ${checked === `today` ? `checked` : ``}>
        <label for="statistic-today" class="statistic__filters-label">Today</label>

        <input
          type="radio"
          class="statistic__filters-input visually-hidden"
          name="statistic-filter"
          id="statistic-week" value="week"
          ${checked === `week` ? `checked` : ``}>
        <label for="statistic-week" class="statistic__filters-label">Week</label>

        <input
          type="radio"
          class="statistic__filters-input visually-hidden"
          name="statistic-filter"
          id="statistic-month" value="month"
          ${checked === `month` ? `checked` : ``}>
        <label for="statistic-month" class="statistic__filters-label">Month</label>

        <input
          type="radio"
          class="statistic__filters-input visually-hidden"
          name="statistic-filter"
          id="statistic-year"
          value="year"
          ${checked === `year` ? `checked` : ``}>
        <label for="statistic-year" class="statistic__filters-label">Year</label>
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${watchedMovies.length} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${getRuntimeInHours} <span class="statistic__item-description">h</span> ${getRuntimeInMinutes} <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${getPopularGenre(watchedMovies)}</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>

    </section>
  `.trim();
};

export default class Stats extends SmartView {
  constructor(movies) {
    super();
    this._movies = movies;
    this._periodChart = null;

    this._data = {
      watchedMovies: movies.filter((movie) => movie.isWatched),
      checked: `all-time`,
    };

    this._statisticsFiltersChangeHandler = this._statisticsFiltersChangeHandler.bind(this);
    this._setChart();
  }

  _setChart() {
    if (this._periodChart !== null) {
      this._periodChart = null;
    }

    const BAR_HEIGHT = 50;
    const statisticCtx = this.getElement().querySelector(`.statistic__chart`);

    statisticCtx.height = BAR_HEIGHT * Object.keys(getAllGenres(this._data.watchedMovies)).length;

    this._periodChart = renderPeriodChart(statisticCtx, this._data.watchedMovies);
  }

  getTemplate() {
    return createStatsTemplate(this._movies, this._data);
  }

  _statisticsFiltersChangeHandler(evt) {
    evt.preventDefault();
    switch (evt.target.value) {
      case `all-time`:
        this.updateData({
          watchedMovies: this._movies.filter((movie) => movie.isWatched),
          checked: `all-time`,
        });
        this._setChart();
        break;
      case `today`:
        this.updateData({
          watchedMovies: this._movies.filter((movie) => movie.isWatched && dayjs(`${movie.watchingDate.getFullYear()} ${movie.watchingDate.getMonth()} ${movie.watchingDate.getDate()}`).isSame(getDayToCompareWith())),
          checked: `today`,
        });
        this._setChart();
        break;
      case `week`:
        this.updateData({
          watchedMovies: this._movies.filter((movie) => movie.isWatched && dayjs(movie.watchingDate).isAfter(getWeekToCompareWith())),
          checked: `week`,
        });
        this._setChart();
        break;
      case `month`:
        this.updateData({
          watchedMovies: this._movies.filter((movie) => movie.isWatched && dayjs(movie.watchingDate).isAfter(getMonthToCompareWith())),
          checked: `month`,
        });
        this._setChart();
        break;
      case `year`:
        this.updateData({
          watchedMovies: this._movies.filter((movie) => movie.isWatched && dayjs(movie.watchingDate).isAfter(getYearToCompareWith())),
          checked: `year`,
        });
        this._setChart();
        break;
    }
  }

  restoreHandlers() {
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`change`, this._statisticsFiltersChangeHandler);
  }
}
