import {Session} from 'bc-react-session';
import {updateProfile} from '../actions.js';

export const hasTutorial = () => (Session.store.getSession().user.profile.show_tutorial == 'true') ? true:false;

export const callback = ({type}) => {
    if(type == 'tour:end')
        updateProfile({ id: Session.store.getSession().user.id, show_tutorial: false});
};