/* global FontAwesomeConfig */
import fontawesome from '@fortawesome/fontawesome';
import faStar from '@fortawesome/fontawesome-free-solid/faStar';
import faEmptyStar from '@fortawesome/fontawesome-free-regular/faStar';
import faStarHalf from '@fortawesome/fontawesome-free-solid/faStarHalf';
import faTimesCircle from '@fortawesome/fontawesome-free-solid/faTimesCircle';
import faCheckCircle from '@fortawesome/fontawesome-free-solid/faCheckCircle';
fontawesome.config = {
  autoReplaceSvg: 'nest'
};
fontawesome.library.add(
    faStar, faStarHalf, faEmptyStar, faTimesCircle, faCheckCircle
);