import {Session} from 'bc-react-session';
import {updateProfileMe} from '../actions.js';

export const hasTutorial = function(){
    const session = Session.get();

    if(typeof session == 'undefined') return false;
    return (session.payload.user.profile.show_tutorial == true) ? true : false;
};

export const callback = ({type}) => {
    if(type == 'tour:end'){
        const session = Session.get();
        updateProfileMe({show_tutorial: false});
        
        const profile = Object.assign(session.payload.user.profile, { show_tutorial: false });
        const user = Object.assign(session.payload.user, { profile });
        Session.setPayload({ user });
    }
};