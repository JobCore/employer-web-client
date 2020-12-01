/* global FontAwesomeConfig */
import fontawesome from '@fortawesome/fontawesome';
import faStar from '@fortawesome/fontawesome-free-solid/faStar';
import faEmptyStar from '@fortawesome/fontawesome-free-regular/faStar';
import faStarHalf from '@fortawesome/fontawesome-free-solid/faStarHalf';
import faCircle from '@fortawesome/fontawesome-free-regular/faCircle';
import faTimesCircle from '@fortawesome/fontawesome-free-solid/faTimesCircle';
import faCheckCircle from '@fortawesome/fontawesome-free-solid/faCheckCircle';
import faAngleDoubleRight from '@fortawesome/fontawesome-free-solid/faAngleDoubleRight';
import faTrashAlt from '@fortawesome/fontawesome-free-solid/faTrashAlt';
import faQuestion from '@fortawesome/fontawesome-free-solid/faQuestion';
import faPencilAlt from '@fortawesome/fontawesome-free-solid/faPencilAlt';
import faPlus from '@fortawesome/fontawesome-free-solid/faPlus';
import faUsers from '@fortawesome/fontawesome-free-solid/faUsers';
import faExclamationTriangle from '@fortawesome/fontawesome-free-solid/faExclamationTriangle';
import faDollarSign from '@fortawesome/fontawesome-free-solid/faDollarSign';
import faUserCheck from '@fortawesome/fontawesome-free-solid/faUserCheck';
import faClipboardList from '@fortawesome/fontawesome-free-solid/faClipboardList';
import faClock from '@fortawesome/fontawesome-free-solid/faClock';
import faSync from '@fortawesome/fontawesome-free-solid/faSync';
import faEnvelope from '@fortawesome/fontawesome-free-solid/faEnvelope';
import faStopwatch from '@fortawesome/fontawesome-free-solid/faStopwatch';
import faMapMarkerAlt from '@fortawesome/fontawesome-free-solid/faMapMarkerAlt';
import faUndo from '@fortawesome/fontawesome-free-solid/faUndo';
import faUserCog from '@fortawesome/fontawesome-free-solid/faUserCog';
import faUserEdit from '@fortawesome/fontawesome-free-solid/faUserEdit';
import faPlusCircle from '@fortawesome/fontawesome-free-solid/faPlusCircle';
import faBell from '@fortawesome/fontawesome-free-solid/faBell';

//import faHandPaper from '@fortawesome/fontawesome-free-solid/faHandPaper';

//import faExclamationTriangle from '@fortawesome/fontawesome-free-solid/faExclamationTriangle';

import faForward from '@fortawesome/fontawesome-free-solid/faForward';
import faBackward from '@fortawesome/fontawesome-free-solid/faBackward';

fontawesome.config = {
  autoReplaceSvg: 'nest'
};
fontawesome.library.add(
    faStar, faStarHalf, faEmptyStar, faTimesCircle, faCheckCircle, faAngleDoubleRight, faUserCheck, faClock,
    faTrashAlt, faQuestion, faPencilAlt, faPlus, faUsers, faExclamationTriangle, faDollarSign, faClipboardList,
    faForward, faBackward, faSync, faEnvelope, faCircle, faMapMarkerAlt, faUndo, faUserCog, faUserEdit,
    faPlusCircle, faStopwatch, faBell
);