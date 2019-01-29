import moment from 'moment';

export const TIME_FORMAT = 'h:mm a';
export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATETIME_FORMAT = DATE_FORMAT+' '+TIME_FORMAT;
export const NOW = () => moment().hour(0).minute(0);
export const YESTERDAY = moment().subtract( 1, 'day' ).hour(0).minute(0);