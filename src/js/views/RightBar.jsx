import React from 'react';
import PropTypes from 'prop-types';
import {create, update, remove, acceptCandidate, rejectCandidate, deleteShiftEmployee} from '../actions';
import {withRouter} from 'react-router-dom';
import queryString from 'query-string';
import {Shift} from '../views/shifts';
import {Invite} from '../views/invites';
import {Location} from '../views/locations';
import {Favlist} from '../views/favorites';
import {Talent, ShiftInvite} from '../views/talents';
import {Application} from '../views/applications';
import {ValidationError} from '../utils/validation';
import {Notify} from 'bc-react-notifier';
import WEngine from "../utils/write_engine.js";

class RightBar extends React.Component {

    constructor(){
        super();
        this.state = {
            formData: {},
            catalog: null,
            error: null
        };
    }

    onSave(data={}){
        this.setState({ error: null });
        try{
            switch (data.executed_action || this.props.option.slug) {
                case 'create_shift':
                    create('shifts', Shift(this.state.formData).validate().withStatus(data.status).serialize());
                    this.props.onClose();
                break;
                case 'update_shift':
                    if(typeof data.status != 'undefined' && data.status === 'CANCELLED') update('shifts', Shift(this.state.formData).get().serialize().withStatus(data.status));
                    else update('shifts', Shift(this.state.formData).validate().withStatus(data.status).serialize(), WEngine.modes.POSPONED);
                    this.props.onClose();
                break;
                case 'delete_shift':
                    remove('shifts', Shift(Object.assign(this.state.formData,data)).serialize());
                    this.props.onClose();
                break;
                case 'filter_shift':{
                        if(data === false) this.props.history.push('/shifts');
                        else{
                            const stringified = queryString.stringify(this.state.formData);
                            this.props.history.push('/shifts?'+stringified);
                        }
                    }
                break;
                case 'invite_talent_to_jobcore':{
                        create('jobcore-invites', Invite(this.state.formData).validate().serialize());
                        this.props.onClose();
                    }
                break;
                case 'invite_talent_to_shift':{
                        create(
                            {url: 'shifts/invites', slug: 'invites'},
                            ShiftInvite(this.state.formData).validate().serialize()
                        );
                        this.props.onClose();
                    }
                break;
                case 'search_talent_and_invite_to_shift':{
                        create(
                            {url: 'shifts/invites', slug: 'invites'},
                            ShiftInvite(this.state.formData).validate().serialize()
                        );
                        this.props.onClose();
                    }
                break;
                case 'add_to_favlist':{
                        this.state.formData.favoriteLists.forEach((list)=>{
                            update({
                                path: "employers/me/favlists/employee",
                                event_name: "employees"
                            },Talent(this.state.formData).validate().serialize());
                        });
                        this.props.onClose();
                    }
                break;
                case 'filter_talent':{
                        if(data === false) this.props.history.push('/talents');
                        else{
                            const stringified = queryString.stringify(Talent(this.state.formData).filters());
                            this.props.history.push('/talents?'+stringified);
                        }
                    }
                break;
                case 'filter_applications':{
                        if(data === false) this.props.history.push('/applicants');
                        else{
                            const stringified = queryString.stringify(Application(this.state.formData).filters());
                            this.props.history.push('/applicants?'+stringified);
                        }
                    }
                break;
                case 'create_favlist':{
                        create('favlists', Favlist(this.state.formData).validate().serialize());
                        this.props.onClose();
                    }
                break;
                case 'update_favlist':{
                        update('favlists',Favlist(this.state.formData).validate().serialize(['employees']));
                        this.props.onClose();
                    }
                break;
                case 'create_location':{
                        create('venues',Location(this.state.formData).validate().serialize());
                        this.props.onClose();
                    }
                break;
                case 'update_location':{
                        update('venues',Location(this.state.formData).validate().serialize());
                        this.props.onClose();
                    }
                break;
                case 'delete_location':{
                        remove('venues',Location(this.state.formData).validate().serialize());
                        this.props.onClose();
                    }
                break;
                case 'update_venue':{
                        update('venues',Location(this.state.formData).validate().serialize());
                        this.props.onClose();
                    }
                break;
                case 'accept_applicant':{
                        acceptCandidate(data.shift.id, data.applicant);
                        this.props.onClose();
                    }
                break;
                case 'reject_applicant':{
                        rejectCandidate(data.shift.id, data.applicant);
                        this.props.onClose();
                    }
                break;
                case 'delete_shift_employee':{
                        const noti = Notify.error("Are you sure?", (answer) => {
                            if(answer){
                                deleteShiftEmployee(data.shift.id, data.employee);
                                this.props.onClose();
                            }
                            noti.remove();
                        });
                    }
                break;
                default: throw new Error("Missing logic onSave() for "+this.props.option.slug);
            }
        }
        catch(error){
            if(error instanceof ValidationError || error.validation){
                this.setState({error: error.message});
            }
            else throw error;
        }

    }

    componentDidMount(){
        if(this.props.formData) this.setState({ formData: this.props.formData });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.formData && prevState.formData !== nextProps.formData) {
            return {
                formData: nextProps.formData
            };
        }

        // Return null to indicate no change to state.
        return null;
    }

    onChange(incoming){
        const data = Object.assign(this.state.formData, incoming);
        this.setState({ formData: data });
    }

    render(){
        const View = this.props.component;
        const styles = { width: this.props.width , right: (this.props.level * (this.props.width/3))};

        return (<div className={"right-bar"+(!this.props.isCollapsable ? " collapsed" : '')} style={styles}>
            <span className="backdrop" onClick={() => this.props.onBackdropClick() } />
            {
                (this.state.error) ? <div className="alert alert-danger">{this.state.error}</div> : ''
            }
            <View
                error={this.state.error}
                catalog={this.props.catalog}
                formData={this.state.formData}
                onSave={(data)=> {
                    if(typeof this.props.option.onSave != 'undefined'){
                        this.props.option.onSave(this.state.formData);
                        this.props.onClose();
                    }
                    else this.onSave(data);
                }}
                onCancel={(incoming)=>this.props.onClose(incoming)}
                onChange={(incoming)=>this.onChange(incoming)}
                history={this.props.history}
            />
            { (this.props.isCollapsable) ?
                <button className="collapsebtn"
                    onClick={() => this.props.onClose()}
                ><i className="fas fa-angle-double-right"></i></button>
                :''
            }
        </div>);
    }

}

RightBar.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object
  ]).isRequired,
  parent: PropTypes.object,
  level: PropTypes.number,
  width: PropTypes.number,
  onClose: PropTypes.func.isRequired,
  onBackdropClick: PropTypes.func,
  isCollapsable: PropTypes.bool,
  history: PropTypes.object.isRequired,
  option: PropTypes.object.isRequired,
  formData:  PropTypes.object,
  catalog:PropTypes.object
};
RightBar.defaultProps = {
  formData: null,
  parent: null,
  onBackdropClick: null,
  isCollapsable: false,
  level: 0,
  width: 370
};
export default withRouter(RightBar);