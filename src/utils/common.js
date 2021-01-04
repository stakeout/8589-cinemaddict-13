import dayjs from 'dayjs';
import dayjsRandom from 'dayjs-random';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(dayjsRandom).extend(relativeTime);

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomBoolean = () => Math.random() <= 0.5;

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const getRandomIndex = (array) => {
  return array[getRandomInteger(0, array.length - 1)];
};

const formatDurationTime = (durationTime) => {
  const hours = Math.floor(durationTime / 60);
  const minutes = durationTime % 60;
  return (hours > 0) ? `${hours}h ${minutes}m` : `${minutes}m`;
};

const sortMoviesByDate = (a, b) => {

  return dayjs(b.releaseDate).diff(dayjs(a.releaseDate));
};

const sortMoviesByRating = (a, b) => {

  return b.totalRating - a.totalRating;
};

export {
  getRandomInteger,
  getRandomBoolean,
  shuffleArray,
  getRandomIndex,
  dayjs,
  formatDurationTime,
  sortMoviesByDate,
  sortMoviesByRating,
};
