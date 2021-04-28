import moment from 'moment';

export const DATE_TIME_FORMAT = 'MMMM Do, YYYY - hh:mm a';

export const formatDateTime = (date: Date) => {
  return moment(date).format(DATE_TIME_FORMAT);
};
