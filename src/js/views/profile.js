import React, { useState, useContext, useEffect } from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import { store, fetchTemporal, update, updateProfileImage, searchMe, remove, updateUser, removeUser,updateProfileMe, sendCompanyInvitation } from '../actions.js';
import { TIME_FORMAT, DATETIME_FORMAT, DATE_FORMAT, TODAY } from '../components/utils.js';
import { Button, Theme, GenericCard, Avatar, SearchCatalogSelect,Wizard} from '../components/index';
import { Notify } from 'bc-react-notifier';
import { Session } from 'bc-react-session';
import { validator, ValidationError } from '../utils/validation';
import Dropzone from 'react-dropzone';
import DateTime from 'react-datetime';
import moment from 'moment';
import PropTypes from "prop-types";
import Select from 'react-select';
import { GET } from '../utils/api_wrapper';
import {hasTutorial } from '../utils/tutorial';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap_white.css';
import { select } from "underscore";

export const Employer = (data = {}) => {

    const _defaults = {
        title: undefined,
        website: undefined,
        payroll_period_starting_time: TODAY(),
        maximum_clockout_delay_minutes: 0,
        bio: undefined,
        uploadCompanyLogo: null,
        editingImage: false,
        response_time: undefined,
        rating: undefined,
        retroactive: undefined,
        serialize: function () {

            const newShift = {
                //                status: (this.status == 'UNDEFINED') ? 'DRAFT' : this.status,
            };

            return Object.assign(this, newShift);
        }
    };

    let _employer = Object.assign(_defaults, data);
    return {
        validate: () => {
            if (_employer.bio && validator.isEmpty(_employer.bio)) throw new ValidationError('The company bio cannot be empty');
            if (_employer.title && validator.isEmpty(_employer.title)) throw new ValidationError('The company name cannot be empty');
            if (_employer.website && validator.isEmpty(_employer.website)) throw new ValidationError('The company website cannot be empty');
            return _employer;
        },
        defaults: () => {
            return _defaults;
        }
    };
};

export class Profile extends Flux.DashView {

    constructor() {
        super();
        this.state = {
            employer: Employer().defaults(),
            currentUser: Session.getPayload().user.profile,
            runTutorial: hasTutorial(),
            stepIndex: 0,
            steps: [
                {
                    content: <div className="text-left"><h1>Your Profile</h1><p>Here you will edit your company information. You can also manage subscription and view your company rating</p></div>,
                    placement: "center",   

                    styles: {
                        options: {
                            zIndex: 10000
                        },
                        buttonClose: {
                            display: "none"
                        }
                    },
                    locale: { skip: "Skip tutorial" },
                    target: "body"
                  
                    },
                {
                    target: '#company-logo-circle',
                    content: 'Click here to upload your company logo',
                    placement: 'right',
                    styles: {
                        buttonClose: {
                            display: "none"
                        },
                        buttonNext:{
                            display: "none"
                        }
                    },
                    spotlightClicks: true

                },
                {
                    target: '#company-logo-dropzone',
                    content: 'Click the on the rectangle to upload a company logo',
                    placement: 'right',
                    styles: {
                        buttonClose: {
                            display: "none"
                        },
                        buttonNext:{
                            display: "none"
                        }
                    },
                    spotlightClicks: true
                },
                {
                    target: '#company-logo-save',
                    content: 'Click save to update your logo',
                    placement: 'right',
                    styles: {
                        buttonClose: {
                            display: "none"
                        },
                        buttonNext:{
                            display: "none"
                        }
                    },
                    spotlightClicks: true

                },
                {
                    target: '#company_title',
                    content: 'Edit company name',
                    placement: 'right',
                    styles: {
                        buttonClose: {
                            display: "none"
                        }
                    },
                    spotlightClicks: true

                },
                {
                    target: '#company_website',
                    content: 'Edit company website',
                    placement: 'right',
                    styles: {
                        buttonClose: {
                            display: "none"
                        }
                    },
                    spotlightClicks: true

                },
                {
                    target: '#company_bio',
                    content: 'Tell future employees about your business',
                    placement: 'right',
                    styles: {
                        buttonClose: {
                            display: "none"
                        }
                    },
                    spotlightClicks: true

                },
                {
                    target: '#button_save',
                    content: 'Save all your progress',
                    placement: 'right',
                    styles: {
                        buttonClose: {
                            display: "none"
                        },
                        buttonNext:{
                            display: "none"
                        }
                    },
                    spotlightClicks: true

                },
            
                {
                    target: '#manage_locations',
                    content: 'Edit your company locations. This is how your employee will know where to report. You will need at least one company address in order to send shifts to future employees',
                    placement: 'right',
                    styles: {
                        buttonClose: {
                            display: "none"
                        },
                        buttonNext: {
                            display: 'none'
                        }
                    },
                    spotlightClicks: true
                }
            
            ]
        };
    }

    setEmployer(newEmployer) {
        const employer = Object.assign(this.state.employer, newEmployer);
        this.setState({ employer });
    }

    componentDidMount() {
   
        const users = store.getState('users');
        this.subscribe(store, 'users', (_users) => {
            const user = _users.filter(e => e.profile.id ==Session.getPayload().user.profile.id )[0];
            this.setState({ user: user });
        });
        if (users){
            const user = users.filter(e => e.profile.id ==Session.getPayload().user.profile.id )[0];
            this.setState({ user: user });
        }
        else searchMe('users');

        let employer = store.getState('current_employer');
        if (employer) this.setState({ employer });
        this.subscribe(store, 'current_employer', (employer) => {
            this.setState({ employer });
        });

    }

 
    _crop() {
        // image in dataUrl
        console.log(this.cropper.getCroppedCanvas().toDataURL());
    }
 
    onCropperInit(cropper) {
        this.cropper = cropper;
    }
    callback = (data) => {
        console.log('DATA', data);
        
        // if(data.action == 'next' && data.index == 0){
        //     this.props.history.push("/payroll");

        // }
        if(data.action == "next" && data.index == 0){


            this.setState({stepIndex: 1});
        
        }
        else if(data.action == "next" && data.index == 4 && data.lifecycle == "complete" && data.step.target == "#company_title"){
        
            this.setState({stepIndex: 5});
    
        }
        else if(data.action == "next" && data.index == 5 && data.lifecycle == "complete" &&  data.step.target == "#company_website"){

                this.setState({stepIndex: 6});
  
        }
        else if(data.action == "next" && data.index == 6 && data.lifecycle == "complete" &&  data.step.target == "#company_bio"){
     
                this.setState({stepIndex: 7});

        }
     

        if(data.action == 'skip'){
            const session = Session.get();
            updateProfileMe({show_tutorial: false});
            
            const profile = Object.assign(session.payload.user.profile, { show_tutorial: false });
            const user = Object.assign(session.payload.user, { profile });
            Session.setPayload({ user });
            this.setState({runTutorial: false});
            document.getElementById("profilelink").style.backgroundColor = "";

        }
    };

    render() {
        console.log(this.state);
  
        return (<div className="p-1 listcontents company-profile">
            <Wizard continuous
                            steps={this.state.steps}
                            run={this.state.runTutorial}
                            callback={(data) => this.callback(data)}
                            stepIndex={this.state.stepIndex}
                            allowClicksThruHole= {true}
                            disableOverlay= {true}
                            spotlightClicks= {true}
                            styles={{
                                options: {
                                    width: 600  ,
                                    primaryColor: '#000',
                                    zIndex: 1000
                                }
                            }}

                        />
            <h1><span id="company_details">User Details</span></h1>
            <form>
                <div className="row mt-2">
                    <div className="col-6">
                        <label>Name</label>
                        <p>{this.state.user && this.state.user.first_name + " " + this.state.user.last_name}</p>
                    </div>
                    <div className="col-6">
                        <label>Email</label>
                        <p>{this.state.user &&  this.state.user.email}</p>
                    </div>
                </div>
            </form>
            <h1><span id="company_details">Company Details</span></h1>
            <form>
                <div className="row mt-2">
                    <div className="col-6">
                        <label>Response Time</label>
                        <p>You answer applications within <span className="text-success">{this.state.employer.response_time} min.</span></p>
                    </div>
                    <div className="col-6">
                        <label>Rating</label>
                        <p>Talents rated you with <span className="text-success">{this.state.employer.rating} points.</span></p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <label>Subscription</label>
                        <p>{ this.state.employer.active_subscription ? 
                                this.state.employer.active_subscription.title 
                                : 
                                "No active subscription"
                            } 
                            <Button className="ml-2" onClick={() => this.props.history.push('/profile/subscription')} size="small">update</Button></p>
                    </div>
                </div>
                <div className="row"  id="company-logo-dropzone" >
                    <div className="col-12">
                        <label>Company Logo</label>
                            
                        {!this.state.editingImage ?
                            <div id="company-logo-circle" className="company-logo" style={{ backgroundImage: `url(${this.state.employer.picture})` }}>
                                <Button color="primary" size="small" onClick={() => this.setState({ editingImage: true, stepIndex: 2})} icon="pencil" />
                            </div>
                            :
                            <div>
                                {this.state.uploadCompanyLogo ? <div className="company-logo" style={{backgroundImage:`url(${URL.createObjectURL(this.state.uploadCompanyLogo)})`}}> <Button color="primary" size="small" onClick={() => this.setState({ editingImage: false, uploadCompanyLogo: null })} icon="times" /></div> : 
                                <div>

                                
                                    <Dropzone onDrop={acceptedFiles => this.setState({ uploadCompanyLogo: acceptedFiles[0], stepIndex: 3 })}>
                                        {({ getRootProps, getInputProps }) => {
                                                return(<section className="upload-zone">
                                                    <div {...getRootProps()}>
                                                        <input {...getInputProps()} />
                                                        <strong style={{textDecoration:"underline",cursor:"pointer", fontSize: '20px'}}>Drop your company logo here, or click me to open the file browser</strong>
                                                    </div>
                                                </section>);
                                        }}
                                    </Dropzone>  
                                </div>                             
                                
                                }

                                <br/>
                         

                                <Button onClick={() => this.setState({ editingImage: false, uploadCompanyLogo: null})} color="secondary">Cancel</Button>
                                <Button id="company-logo-save" onClick={() => {
                                    updateProfileImage(this.state.uploadCompanyLogo).then(picture => {
                                        this.setState(prevState => {
                                            let employer = Object.assign({}, prevState.employer);  
                                            employer.picture =  picture;                                   
                                            return { employer,editingImage: false, uploadCompanyLogo: null, stepIndex:4 };                                 
                                          });
                                    });

                                }} color="success">Save</Button>
                            </div>
                        }
                    </div>
                </div>
                <div className="row" id="company_title">
                    <div className="col-12">
                        <label>Company Name</label>
                        <input type="text" className="form-control" value={this.state.employer.title}
                            onChange={(e) => this.setEmployer({ title: e.target.value })}
                        />
                    </div>
                </div>
                <div className="row mt-2" id="company_website">
                    <div className="col-12">
                        <label>Website</label>
                        <input type="text" className="form-control" value={this.state.employer.website}
                            onChange={(e) => this.setEmployer({ website: e.target.value })}
                        />
                    </div>
                </div>
                <div className="row mt-2" id="company_bio">
                    <div className="col-12">
                        <label>Bio</label>
                        <input type="text" className="form-control" value={this.state.employer.bio}
                            onChange={(e) => this.setEmployer({ bio: e.target.value })}
                        />
                    </div>
                </div>
                <div className="mt-4 text-right">
                    <button
                        type="button"
                        id="button_save"
                        className="btn btn-primary"
                        onClick={() => {update({ path: 'employers/me', event_name: 'current_employer' }, Employer(this.state.employer).validate().serialize()).catch(e => Notify.error(e.message || e)); this.setState({stepIndex: 8});}}
                    >Save</button>
                </div>
            </form>
        </div>);
    }
}
Profile.propTypes = {
    history: PropTypes.object
};

export class ManageUsers extends Flux.DashView {

    constructor() {
        super();
        this.state = {
            companyUsers: [],
            currentUser: Session.getPayload().user.profile
        };
    }

    componentDidMount() {

        const users = store.getState('users');
        this.subscribe(store, 'users', (_users) => {
            this.setState({ companyUsers: _users, currentUser: Session.getPayload().user.profile });
        });
        if (users) this.setState({ companyUsers: users, currentUser: Session.getPayload().user.profile });
        else searchMe('users');

        this.props.history.listen(() => {
            this.filter();
            this.setState({ firstSearch: false });
        });
    }

    filter(users = null) {
        searchMe('users', window.location.search);
    }

    showRole(profile){
        if(profile.employer.id === this.state.currentUser.employer.id){
            return profile.employer_role;
        }else if(profile.employer.id != this.state.currentUser.employer.id){
            const role = profile.other_employers.find(emp => emp.employer == this.state.currentUser.employer);
            if(role)return role.employer_role;
            else return "";
        }else return "";
    }
    render() {
        const allowLevels = (window.location.search != '');
        return (<div className="p-1 listcontents">
            <Theme.Consumer>
                {({ bar }) => (<span>
                    <p className="text-right">
                        <h1 className="float-left">Company Users</h1>
                        <Button onClick={() => bar.show({ slug: "invite_user_to_employer", allowLevels: true })}>Invite new user</Button>
                
                    </p>
  
                    {this.state.companyUsers.map((u, i) => (
                        <GenericCard key={i} hover={true}>
                            <Avatar url={u.profile.picture} />
                            <div className="btn-group">
                                <Tooltip placement="bottom" trigger={['hover']} overlay={<small>Admin can create shifts, make payroll payments and change employers role.</small>}>

                                    <Button color="primary" style={{background:"white", color: "black" }}onClick={() => {
                                        if (this.state.currentUser.id === u.profile.id)  Notify.error('You cannot make yourself an admin');
                                        else if(this.state.currentUser.employer_role !='ADMIN'){
                                            Notify.error('You cannot change role if you are not ADMIN');
                                        }
                                        else{
                                            const noti = Notify.info("Are you sure you want to make this person Admin?", (answer) => {
                                                if (answer) updateUser({ id: u.profile.id, employer_id: this.state.currentUser.employer, employer_role: 'ADMIN' });
                                                noti.remove();
                                            });

                                        }
                                    }}>Make Admin</Button>
                                </Tooltip> 

                                <Tooltip placement="bottom" trigger={['hover']} overlay={<small>Manager can create shifts and make payroll payments.</small>}>

                                    <Button  style={{background:"white", color: "black" }} onClick={() => {
                                        if (this.state.currentUser.id === u.profile.id) Notify.error('You cannot make yourself an manager');
                                        else if(this.state.currentUser.employer_role !='ADMIN'){
                                            Notify.error('You cannot change role if you are not ADMIN');
                                        }
                                        else{
                                            const noti = Notify.info("Are you sure you want to make this person Manager?", (answer) => {
                                                if (answer) updateUser({ id: u.profile.id, employer_id: this.state.currentUser.employer, employer_role: 'MANAGER' });
                                                noti.remove();
                                            });

                                        }
                                    }}>Make manager</Button>
                                </Tooltip> 

                                <Tooltip placement="bottom" trigger={['hover']} overlay={<small>Supervisor can create shifts and invite employees to work.</small>}>
                                    <Button style={{background:"white", color: "black" }} onClick={() => {
                                        if (this.state.currentUser.id === u.profile.id) Notify.error('You cannot make yourself an supervisor');
                                        else if(this.state.currentUser.employer_role !='ADMIN'){
                                            Notify.error('You cannot change role if you are not ADMIN');
                                        }
                                        else{
                                            const noti = Notify.info("Are you sure you want to make this person Supervisor?", (answer) => {
                                                if (answer) updateUser({ id: u.profile.id, employer_id: this.state.currentUser.employer, employer_role: 'SUPERVISOR' });
                                                noti.remove();
                                            });

                                        }
                                    }}>Make Supervisor</Button>   
                           
                                </Tooltip>                             
                                <Button icon="trash" style={{background:"white", color: "red" }} onClick={() => {
                                    if (this.state.currentUser.id === u.profile.id) Notify.error('You cannot delete yourself');
                                    else if(this.state.currentUser.employer_role !='ADMIN'){
                                        Notify.error('You cannot delete if you are not ADMIN');
                                    }
                                    else{
                                        const noti = Notify.info("Are you sure you want to delete this user?", (answer) => {
                                            if (answer) removeUser(u);
                                            noti.remove();
                                        });

                                    }
                                }}></Button>
                            </div>
                            <p className="mt-2">{u.first_name} {u.last_name} ({this.showRole(u.profile)})</p>
                        </GenericCard>
                    ))}
                </span>)}
            </Theme.Consumer>
        </div>);
    }
}

/**
 * Invite a new user to the company
 */
export const InviteUserToCompanyJobcore = ({ onSave, onCancel, onChange, catalog, formData }) => {

    const { bar } = useContext(Theme.Context);
    const [isNew, setIsNew] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [employer, setEmployer] = useState(Session.getPayload().user.profile);
    if(selectedUser) formData.user = selectedUser.value;

    return (
        <form>
            <div className="row">
                <div className="col-12">
                    <p>
                        <span>Invite someone into your company </span>
                        <span className="anchor"
                            onClick={() => bar.show({ slug: "show_pending_jobcore_invites", allowLevels: true })}
                        >review previous invites</span>:
                    </p>
                </div>
            </div>
            <div className="row">
                
                <div className="col-12 align-content-center justify-content-center text-center mb-4">
                    <div className="btn-group btn-group-toggle" data-toggle="buttons">
                        <label className={"btn btn-secondary " + (isNew ? 'active' : '')}>
                            <input type="radio" name="options" id="option1" autoComplete="off" onClick={()=>setIsNew(true)} checked={isNew}/> New User
                        </label>
                        <label className={"btn btn-secondary " + (!isNew ? 'active' : '')}>
                            <input type="radio" name="options" id="option2" autoComplete="off" onClick={()=>setIsNew(false)} checked={!isNew}/> Existing User
                        </label>
                    </div>
                </div>
            </div>
            {isNew ? (
                <div>

                    <div className="row">  
                        <div className="col-12">
                            <label>First Name</label>
                            <input type="text" className="form-control"
                                onChange={(e) => onChange({ first_name: e.target.value })}
                            />
                        </div>
                        <div className="col-12">
                            <label>Last Name</label>
                            <input type="text" className="form-control"
                                onChange={(e) => onChange({ last_name: e.target.value })}
                            />
                        </div>
                        <div className="col-12">
                            <label>Email</label>
                            <input type="email" className="form-control"
                                onChange={(e) => onChange({ email: e.target.value })}
                            />
                        </div>
                        <div className="col-12">
                            <label>Company Role</label>
                            <Select
                                value={catalog.employer_role.find((a) => a.value == formData.employer_role)}
                                onChange={(selection) => onChange({ employer_role: selection.value.toString() })}
                                options={catalog.employer_role}
                            />
                        </div> 
                    </div>      
                    <div className="btn-bar">
                        <Button color="success" onClick={() => onSave()}>Send Invite</Button>
                        <Button color="secondary" onClick={() => onCancel()}>Cancel</Button>
                    </div>    
                </div>

            ):(
                <div>
                    <div className="row">  
                        <div className="col-12">
                            <label>Search people in JobCore:</label>
                            <SearchCatalogSelect
                                isMulti={false}
                                value={selectedUser}
                                onChange={(selection) => {
                                    setSelectedUser({label: selection.label, value: selection.value});
                                }}
                                searchFunction={(search) => new Promise((resolve, reject) =>
                                    GET('catalog/profiles?full_name=' + search)
                                        .then(talents => resolve([
                                            { label: `${(talents.length == 0) ? 'No one found: ' : ''}Invite "${search}" to Company?`, value: 'invite_talent_to_jobcore' }
                                        ].concat(talents)))
                                        .catch(error => reject(error))
                                )}
                            />
                        </div>
                
                        <div className="col-12">
                            <label>Company Role</label>
                            <Select
                                value={catalog.employer_role.find((a) => a.value == formData.employer_role)}
                                onChange={(selection) => onChange({ employer_role: selection.value.toString() })}
                                options={catalog.employer_role}
                            />
                        </div>     
                    </div>  
                    <div className="btn-bar">
                        <Button color="success" onClick={() => {
                            GET(`employers/me/users/${formData.user}`).then(user =>
                                sendCompanyInvitation(user.email, employer.employer, formData.employer_role, employer.id)
                                );
                        }}>Send Invite</Button>
                        <Button color="secondary" onClick={() => onCancel()}>Cancel</Button>
                    </div>

                </div>
            )}
        </form>
    );
};
InviteUserToCompanyJobcore.propTypes = {
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    formData: PropTypes.object,
    catalog: PropTypes.object //contains the data needed for the form to load
};