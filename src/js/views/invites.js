import React, { useEffect, useState } from 'react';
import {validator, ValidationError} from '../utils/validation';
import {update, searchMe} from '../actions';
import {Session} from 'bc-react-session';
import PropTypes from 'prop-types';
import {GET} from '../utils/api_wrapper';
import Select from 'react-select';
import {TIME_FORMAT, DATE_FORMAT, NOW} from '../components/utils.js';
import {Button, Theme, ShiftOption, ShiftOptionSelected, SearchCatalogSelect, ShiftCard} from '../components/index';
import {Shift} from "./shifts.js";
import moment from 'moment';

export const Invite = (data) => {

    const _defaults = {
        first_name: '',
        last_name: '',
        status: 'PENDING',
        created_at: NOW(),
        email: '',
        include_sms: undefined,
        phone_number: '',
        serialize: function(){

            const newShift = {
                sender: Session.getPayload().user.profile.id
            };

            return Object.assign(this, newShift);
        },
        unserialize: function(){
            const dataType = typeof this.created_at;
            //if its already serialized
            if((typeof this.position == 'object') && ['number','string'].indexOf(dataType) == -1) return this;
            const newInvite = {
                shift: Shift(this.shift).defaults().unserialize(),
                created_at: (!moment.isMoment(this.created_at)) ? moment(this.created_at) : this.created_at
            };

            return Object.assign(this, newInvite);
        }
    };

    let _entity = Object.assign(_defaults, data);
    return {
        validate: () => {
            if(!validator.isEmail(_entity.email)) throw new ValidationError('Please specify the email');
            if(validator.isEmpty(_entity.first_name)) throw new ValidationError('Please specify the first name');
            if(validator.isEmpty(_entity.last_name)) throw new ValidationError('Please specify the last name');
            //if(validator.isEmpty(_entity.phone_number.toString())) throw new ValidationError('Please specify the last name');
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

/**
 * AddShift
 */
export const SearchShiftToInviteTalent = (props) => {

    const [ shifts, setShifts ] = useState([]);
    useEffect(() => {
        searchMe('shifts', `?upcoming=true&employee_not=${props.formData.employees.join(',')}&employee_not=${props.formData.employees.join(',')}`)
            .then(data => setShifts(data.map(item => ({ value: Shift(item).defaults().unserialize(), label: '' }))));
    }, []);

    return (<form>
        <div className="row">
            <div className="col-12">
                <label>Pick your shifts:</label>
                <Select isMulti className="select-shifts"
                    value={props.formData.shifts}
                    components={{ Option: ShiftOption, MultiValue: ShiftOptionSelected({ multi: true }) }}
                    onChange={(selectedOption)=>props.onChange({ shifts: selectedOption })}
                    options={shifts}
                >
                </Select>
            </div>
        </div>
        <p>Click on invite to invite the talent to your selected shifts</p>
        <div className="btn-bar">
            <Button color="primary" onClick={() => props.onSave()}>Send Invite</Button>
        </div>
    </form>);
};
SearchShiftToInviteTalent.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  formData: PropTypes.object,
  catalog: PropTypes.object //contains the data needed for the form to load
};

/**
 * Invite Talent To Shift
 */
export const SearchTalentToInviteToShift = ({ formData, onSave, onChange }) => {
    return (<Theme.Consumer>
        {({bar}) => (<form>
            <div className="row">
                <div className="col-12">
                    <label>Seach the JobCore Database:</label>
                    <SearchCatalogSelect
                        isMulti={true}
                        value={formData.pending_invites}
                        onChange={(selections)=> {
                            const invite = selections.find(opt => opt.value == 'invite_talent_to_jobcore');
                            if(invite) bar.show({
                                allowLevels: true,
                                slug: "invite_talent_to_jobcore",
                                onSave: (emp) => onChange({ pending_jobcore_invites: formData.pending_jobcore_invites.concat(emp) })
                            });
                            else onChange({ pending_invites: selections, employees: selections.map(opt => opt.value) });
                        }}
                        searchFunction={(search) => new Promise((resolve, reject) =>
                            GET('catalog/employees?full_name='+search)
                                .then(talents => resolve([
                                    { label: `${(talents.length==0) ? 'No one found: ':''}Invite "${search}" to jobcore`, value: 'invite_talent_to_jobcore' }
                                ].concat(talents)))
                                .catch(error => reject(error))
                        )}
                    />
                </div>
            </div>
            <p>Click on invite to invite the talent to your selected shifts</p>
            <div className="btn-bar">
                <Button color="primary" onClick={() => onSave()}>Send Invite</Button>
            </div>
        </form>)}
    </Theme.Consumer>);
};
SearchTalentToInviteToShift.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  formData: PropTypes.object,
  catalog: PropTypes.object //contains the data needed for the form to load
};

/**
 * ShiftDetails
 */
export const InviteTalentToJobcore = ({ onSave, onCancel, onChange, catalog, formData }) => (<Theme.Consumer>
    {({bar}) => (
        <form id="invite_talent_jobcore">
            <div className="row">
                <div className="col-12">
                    <p>
                        <span>Invite someone into yor talent pool or </span>
                        <span className="anchor"
                            onClick={() => bar.show({ slug: "show_pending_jobcore_invites", allowLevels: true })}
                        >review previous invites</span>:
                    </p>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <label>Talent First Name</label>
                    <input type="text" className="form-control"
                        onChange={(e)=>onChange({first_name: e.target.value})}
                    />
                </div>
                <div className="col-12">
                    <label>Talent Last Name</label>
                    <input type="text" className="form-control"
                        onChange={(e)=>onChange({last_name: e.target.value})}
                    />
                </div>
                <div className="col-12">
                    <label>Talent email</label>
                    <input type="email" className="form-control"
                        onChange={(e)=>onChange({email: e.target.value})}
                    />
                </div>
                <div className="col-12">
                    <label>Talent Phone</label>
                    <input type="tel" className="form-control"
                        onChange={(e)=>onChange({phone_number: e.target.value})}
                    />
                    <div className="form-group text-left">
                        <input type="checkbox" className="mr-1"
                            onChange={(e) => onChange({ include_sms: !formData.include_sms })} checked={formData.include_sms}
                        />
                        Send invite throught SMS as well.
                    </div>
                </div>
            </div>
            <div className="btn-bar">
                <Button color="success" onClick={() => onSave()}>Send Invite</Button>
                <Button color="secondary" onClick={() => onCancel()}>Cancel</Button>
            </div>
        </form>
    )}
</Theme.Consumer>);
InviteTalentToJobcore.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  width: PropTypes.number,
  formData: PropTypes.object,
  catalog: PropTypes.object //contains the data needed for the form to load
};


/**
 * ShiftDetails
 */
export const PendingJobcoreInvites = ({ catalog, formData }) => (<div>
    <div className="row">
        <div className="col">
            <h2>These are your pending invites</h2>
            <ul className="li-white">
                { (catalog.jcInvites.length > 0) ?
                    catalog.jcInvites.map((inv, i) =>{
                        if(inv.status == "PENDING" || inv.status == "COMPANY"){
                            return(<li key={i}>
                                <button
                                    className="btn btn-primary float-right mt-2 btn-sm"
                                    onClick={() => update('jobcore-invites', inv)}
                                >Resend</button>
                                <p className="p-0 m-0">
                                    <span>{inv.first_name} {inv.last_name} {inv.employer && " (company)"} </span>
                                </p>
                                <span className="badge">{moment(inv.updated_at).fromNow()}</span>
                                <small>{inv.email}</small>
                            </li>);
                        }
                    }
                    ):
                    <p className="text-center">No pending invites</p>
                }
            </ul>
        </div>
    </div>
</div>);
PendingJobcoreInvites.propTypes = {
  width: PropTypes.number,
  formData: PropTypes.object,
  catalog: PropTypes.object //contains the data needed for the form to load
};

/**
 * ShiftDetails
 */
export const PendingInvites = ({ catalog, formData }) => {
    return (<div>
        <div className="row">
            <div className="col">
                <h2>Pending invites for {formData.talent.user.first_name}</h2>
                <ul className="li-white mx-1">
                    { (catalog.invites.length > 0) ?
                        catalog.invites.map((inv, i) =>
                            (<ShiftCard key={i} shift={inv.shift} showStatus={false} hoverEffect={false} />)
                        ):
                        <p className="text-center">No pending invites</p>
                    }
                </ul>
            </div>
        </div>
    </div>);
};
PendingInvites.propTypes = {
  formData: PropTypes.object,
  catalog: PropTypes.object //contains the data needed for the form to load
};