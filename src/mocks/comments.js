import {getRandomIndex} from '../utils/common.js';

const authors = [
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

const emojies = [`smile`, `sleeping`, `puke`, `angry`];

const comments = [
  `Interesting setting and a good cast`,
  `Booooooooooring`,
  `Very very old. Meh`,
  `Almost two hours? Seriously?`,
  `o_O, kek`,
];


const generateComment = () => {
  const author = getRandomIndex(authors);
  const emoji = getRandomIndex(emojies);
  const comment = getRandomIndex(comments);

  return {
    author,
    emoji,
    comment,
    dateCreation: ``,
  };
};

export {generateComment};