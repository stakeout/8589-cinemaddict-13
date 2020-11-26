import {getRandomInteger, getRandomBoolean, shuffleArray, getRandomIndex} from '../utils/common.js';
import {generateComment} from './comments.js';

const MAX_COMMENTS_AMOUNT = 5;

const posters = [
  `made-for-each-other.png`,
  `popeye-meets-sinbad.png`,
  `sagebrush-trail.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `the-dance-of-life.jpg`,
  `the-great-flamarion.jpg`,
  `the-man-with-the-golden-arm.jpg`,
];

const producers = [
  `Vadim Novash`,
  `Ella Sidorova`,
  `Andrius Chepulis`,
  `My dog Ralph`,
  `Neighbour cat`,
  `Anybody`,
  `Somebody`,
  `My future life`,
  `A bird flying in the sky`,
];

const countries = [
  `Belarus`,
  `Russia`,
  `Spain`,
  `Chili`,
  `China`,
  `Bahama`,
  `Japan`,
  `Holland`,
  `Usa`,
];

const ages = [6, 12, 16, 18];

const genres = [
  `Drama`,
  `Travell`,
  `Adventure`,
  `Comedy`,
  `History`,
];

const modifyFileName = (fileName) => {
  let tempName;
  let result;
  const dotIndex = fileName.indexOf(`.`);
  tempName = fileName.substring(0, dotIndex).replaceAll(`-`, ` `);
  result = tempName[0].toUpperCase() + tempName.substring(1);
  return result;
};

const getTitlesArray = (postersArray) => {
  return postersArray.map(modifyFileName);
};

const titles = getTitlesArray(posters);

const movieDescription = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus. `;

const getRandomText = (str) => {
  const result = shuffleArray(str.split(`. `)).slice(0, getRandomInteger(1, MAX_COMMENTS_AMOUNT)).join(`. `) + `.`;
  return result;
};

const generateReleaseDate = () => {
  return new Date(getRandomInteger(1920, 2020), getRandomInteger(0, 11), getRandomInteger(1, 31));
};

const generateMovieObject = () => {
  const randomDesription = getRandomText(movieDescription);
  const writers = shuffleArray(producers).slice(0, getRandomInteger(1, producers.length - 1));
  const ageRating = `${getRandomIndex(ages)}+`;
  const genre = shuffleArray(genres).slice(0, getRandomInteger(1, genres.length - 1));
  const comments = new Array(getRandomInteger(0, MAX_COMMENTS_AMOUNT)).fill().map(generateComment);
  const isInWatchList = getRandomBoolean();
  const isWatched = getRandomBoolean();
  const isFavorite = getRandomBoolean();
  const releaseDate = generateReleaseDate();

  return {
    title: getRandomIndex(titles),
    originalTitle: getRandomIndex(titles),
    producer: getRandomIndex(producers),
    screenwriters: writers,
    actors: writers,
    poster: getRandomIndex(posters),
    description: randomDesription,
    comments,
    totalRating: `${getRandomInteger(0, 9)}.${getRandomInteger(0, 9)}`,
    releaseDate,
    duration: getRandomInteger(24, 180),
    genre,
    country: getRandomIndex(countries),
    ageRating,
    isInWatchList,
    isWatched,
    isFavorite,
  };
};

export {
  generateMovieObject,
};
