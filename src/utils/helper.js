import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {WatchedFilmsCount} from "../consts";
dayjs.extend(relativeTime);
const MINUTES_IN_HOUR = 60;
const getUserStatus = (count) => {
  if (count <= WatchedFilmsCount.MIN) {
    return `Novice`;
  } else if (count <= WatchedFilmsCount.MIDDLE) {
    return `Fan`;
  }
  return `Movie Buff`;
};

const helpersDate = {
  releaseTrimmdDate: (serverDate) => dayjs(serverDate).format(`YYYY`),
  releaseFullDate: (serverDate) => dayjs(serverDate).format(`DD MMMM YYYY`),
  releaseCommentDate: (serverDate) => dayjs(serverDate).fromNow(),
};

const getDurationMovie = (minutesCount) => {
  const hours = Math.floor(minutesCount / MINUTES_IN_HOUR);
  const minutes = minutesCount % MINUTES_IN_HOUR;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

const isEscapeEvent = (evt, action) => {
  if (evt.key === `Escape` || evt.key === `Esc`) {
    action();
  }
};

const sortDate = ((a, b) => {
  return dayjs(b.releaseDate).diff(dayjs(a.releaseDate));
});

const sortRating = ((a, b) => {
  return b.rating - a.rating;
});

const sortComment = ((a, b) => {
  return b.comments.length - a.comments.length;
});


export {getUserStatus, isEscapeEvent, helpersDate, getDurationMovie, sortDate, sortRating, sortComment};
