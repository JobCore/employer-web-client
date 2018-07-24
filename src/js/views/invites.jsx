import {validator, ValidationError} from '../utils/validation';
import {Session} from '@breathecode/react-session';

export const Invite = (data) => {
    
    const _defaults = {
        first_name: '',
        last_name: '',
        email: '',
        serialize: function(){
            
            const newShift = {
                sender: Session.store.getSession().user.profile.id
            };
            
            return Object.assign(this, newShift);
        }
    };
    
    let _entity = Object.assign(_defaults, data);
    return {
        validate: () => {
            if(!validator.isEmail(_entity.email)) throw new ValidationError('Please specify the email');
            if(validator.isEmpty(_entity.first_name)) throw new ValidationError('Please specify the first name');
            if(validator.isEmpty(_entity.last_name)) throw new ValidationError('Please specify the last name');
            return _entity;
        },
        defaults: () => {
            return _defaults;
        },
        getFormData: () => {
            const _formShift = {
                //foo: _entity.bar
            };
            return _formShift;
        },
        filters: () => {
            const _filters = {
                positions: _entity.positions.map( item => item.value ),
                badges: _entity.badges.map( item => item.value )
            };
            for(let key in _entity) if(typeof _entity[key] == 'function') delete _entity[key];
            return Object.assign(_entity, _filters);
        }
    };
};