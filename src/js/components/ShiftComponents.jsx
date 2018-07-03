import React from 'react';
import PropTypes from 'prop-types';

export const ShiftCard = ({ position, location, start, end, price }) => {
    return <li>{position} @ {location} {start.format('ll')} from {start.format('LT')} to {end.format('LT')} {price.currency}{price.amount}{price.timeframe}.</li>;
};

ShiftCard.propTypes = {
  position: PropTypes.object.required,
  location: PropTypes.object.required,
  price: PropTypes.object.required,
  start: PropTypes.number.required,
  end: PropTypes.number.required
};
