import React from 'react';
import Flux from '@4geeksacademy/react-flux-dash';
import { Route, Switch, NavLink } from 'react-router-dom';
import {logout, fetchAll, fetchSingle} from './actions';
import Dashboard from './views/Dashboard';
import ButtonBar from './views/ButtonBar';
import { Session } from 'bc-react-session';
import LoadBar from './components/load-bar/LoadBar.jsx';
import {Theme, SideBar} from './components/index';
import {ShiftDetails, ManageShifts, FilterShifts, ShiftApplicants, Shift, getShiftInitialFilters, RateShift, AddVenue} from './views/shifts';
import {ManageApplicantions, ApplicationDetails,FilterApplications, getApplicationsInitialFilters} from './views/applications';
import {Talent, ShiftInvite, ManageTalents, FilterTalents, getTalentInitialFilters, TalentDetails} from './views/talents';
import {PendingInvites, InviteTalentToShift, InviteTalentToJobcore} from './views/invites';
import {ManageFavorites, AddFavlistsToTalent, FavlistEmployees, AddTalentToFavlist, Favlist, AddFavlist} from './views/favorites';
import { ManageLocations } from './views/locations';
import { ManagePayroll, SelectTimesheet } from './views/payroll';
import {Profile, Location} from './views/profile';
import {store} from './actions';
import {NOW} from './components/utils.js';
import {Notifier, Notify} from 'bc-react-notifier';
import logoURL from '../img/logo.png';
import moment from 'moment';

const logoStyles = {
    backgroundImage: `url(${logoURL})`
};

class PrivateLayout extends Flux.DashView{
    
    constructor(){
        super();
        this.currentPath = null;
        this.removeHistoryListener = null;
        this.state = {
            showRightBar: 0,
            showButtonBar: true,
            loading: true,
            sideBarLevels: [],
            catalog:{
                positions: [],
                venues: [],
                applicants: [],
                applicationRestrictions: [
                    { label: "Anyone that qualifies", value: 'ANYONE' },
                    { label: "Only from my favorites", value: 'FAVORITES' },
                    { label: "Specific People", value: 'SPECIFIC_PEOPLE' }
                ],
                stars: [
                    { label: "1 Star", value: 1 },
                    { label: "2 Stars", value: 2 },
                    { label: "3 Stars", value: 3 },
                    { label: "4 Stars", value: 4 },
                    { label: "5 Stars", value: 5 }
                ],
                shiftStatus: [
                    { label: '', value: 'Select a status' },
                    { label: 'Draft', value: 'DRAFT' },
                    { label: 'Open', value: 'OPEN' },
                    { label: 'Filled', value: 'FILLED' },
                    { label: 'Upcoming', value: 'UPCOMING' }
                ]
            },
            bar: {
                show: (option) => {
                    switch (option.slug) {
                        case 'create_shift':
                            this.showRightBar(ShiftDetails, option, {formData: Shift(option.data).defaults()});
                        break;
                        case 'filter_talent':
                            this.showRightBar(FilterTalents, option, {formData: getTalentInitialFilters(this.state.catalog)});
                        break;
                        case 'filter_shift':
                            this.showRightBar(FilterShifts, option, {formData: getShiftInitialFilters(this.state.catalog)});
                        break;
                        case 'filter_applications':
                            this.showRightBar(FilterApplications, option, {formData: getApplicationsInitialFilters(this.state.catalog)});
                        break;
                        case 'show_shift_applications':{
                            this.showRightBar(ShiftApplicants, option, { 
                                applicants: option.data.candidates,
                                shift: option.data 
                            });
                        }break;
                        case 'show_single_applicant':
                            this.showRightBar(ApplicationDetails, option, {applicant: option.data });
                        break;
                        case 'shift_details':
                            fetchSingle('shifts', option.data.id);
                            this.showRightBar(ShiftDetails, option, {formData: Shift(option.data).getFormData() });
                        break;
                        case 'favlist_employees':
                            option.title = "List Details";
                            this.showRightBar(FavlistEmployees, option, {formData: Favlist(option.data).getFormData()});
                        break;
                        case 'invite_talent':
                            option.title = "Invite Talent";
                            this.showRightBar(InviteTalentToShift, option, {formData: ShiftInvite(option.data).getFormData()});
                        break;
                        case 'invite_talent_to_jobcore':
                            this.showRightBar(InviteTalentToJobcore, option);
                        break;
                        case 'show_pending_jobcore_invites':
                            this.showRightBar(PendingInvites, option);
                        break;
                        case 'show_single_talent':
                            option.title = "Talent Details";
                            this.showRightBar(TalentDetails, option, {employee: option.data});
                        break;
                        case 'add_to_favlist':
                            option.title = "Add to favorite lists";
                            this.showRightBar(AddFavlistsToTalent, option, {formData: Talent(option.data).getFormData()});
                        break;
                        case 'create_favlist':
                            option.title = "Create Favorite List";
                            this.showRightBar(AddFavlist, option, {formData: Favlist(option.data).getFormData()});
                        break;
                        case 'update_favlist':
                            option.title = "Update list";
                            this.showRightBar(AddFavlist, option, {formData: Favlist(option.data).getFormData()});
                        break;
                        case 'create_venue':
                            option.title = "Create New Venue";
                            this.showRightBar(AddVenue, option, {formData: Location(option.data).getFormData()});
                        break;
                        case 'add_talent_to_favlist':
                            option.title = "Search for the talent";
                            this.showRightBar(AddTalentToFavlist, option, {formData: Favlist(option.data).getFormData() });
                        break;
                        case 'select_timesheet':
                            this.showRightBar(SelectTimesheet, option, {
                                formData: {
                                    shift: null,
                                    starting_at: NOW.subtract( 7, 'day' ),
                                    ending_at: moment()
                                }
                            });
                        break;
                        case 'filter_timesheet':
                            this.showRightBar(SelectTimesheet, option, { formData: option.data });
                        break;
                        default:
                            if(typeof option.to == 'string') this.props.history.push(option.to);
                            else console.log("Option slug not found: "+option.slug);
                        break;
                    }
                },
                close: () => this.closeRightBar()
            }
        };
    }
    
    
    componentDidMount(){
        
        const session = Session.get();
        if(typeof session == 'undefined' || typeof session.active == 'undefined' || session.active == false) this.props.history.push('/login');
        
        const reduce = (list) => list.map(itm => {
            return ({ 
                label: itm.title || itm.user.first_name + ' ' + itm.user.last_name, 
                value: itm.id 
            });
        });
        
        
        fetchAll(['positions', 'badges']);
        fetchAllFromEmployer(['venues', 'favlists', 'jobcore-invites' ])
            .then(() => fetchAll(['shifts']));
        
        this.subscribe(store, 'jobcore-invites', (jcInvites) => this.setCatalog({jcInvites: jcInvites || []}));
        this.subscribe(store, 'venues', (venues) => this.setCatalog({venues: reduce(venues)}));
        this.subscribe(store, 'positions', (positions) => this.setCatalog({positions: reduce(positions)}));
        this.subscribe(store, 'badges', (badges) => this.setCatalog({badges: reduce(badges)}));
        this.subscribe(store, 'favlists', (favlists) => {
            
            let favoriteEmployees = [];
            let favoriteEmployeesIds = [];
            if(Array.isArray(favlists)){
                favlists.forEach((favlist)=>{
                    favoriteEmployees = favoriteEmployees.concat(favlist.employees.filter(em => favoriteEmployeesIds.indexOf(em.id) == -1));
                    favoriteEmployeesIds = favoriteEmployeesIds.concat(favlist.employees.map(em => em.id));
                });
            } 
            this.setCatalog({
                favlists: reduce(favlists), 
                favoriteEmployees: reduce(favoriteEmployees)
            });
            
        });
        this.subscribe(store, 'shifts', (shifts) => {
            
            this.setCatalog({ shifts });
            if(this.state.showRightBar && this.state.rightBarOption){
                if(this.state.rightBarOption.slug == 'show_shift_applicants'){
                    const newRightBarOpt = Object.assign(this.state.rightBarOption, {
                        data: store.get('shifts', this.state.rightBarOption.data.id)
                    });
                    this.state.bar.show(newRightBarOpt);
                }
            }
        });
        this.currentPath = this.props.history.location.pathname;
        this.removeHistoryListener = this.props.history.listen((e) => {
            if(this.currentPath != e.pathname) this.closeRightBar(true);
            this.currentPath = e.pathname;
        });
        //this.showRightBar(AddShift);
    }
    
    componentWillUnmount(){
        if(this.removeHistoryListener) this.removeHistoryListener();
    }
    
    showRightBar(component, option, incomingCatalog={}){
        const catalog = Object.assign(this.state.catalog, incomingCatalog);
        
        const newLevel = [{ component, option, formData: incomingCatalog.formData || null }];
        const levels = (option.allowLevels) ? this.state.sideBarLevels.concat(newLevel) : newLevel;
        this.setState({
            showRightBar: levels.length,
            sideBarLevels: levels,
            catalog
        });
    }
    closeRightBar(all=false){
        const newLevels = this.state.sideBarLevels.filter((e,i) => i < this.state.sideBarLevels.length-1);
        this.setState({
            showRightBar: (all) ? 0 : newLevels.length,
            sideBarLevels: (all) ? [] : newLevels
        });
    }
    
    setCatalog(incomingCatalog){
        const catalog = Object.assign(this.state.catalog, incomingCatalog);
        this.setState({catalog});
    }
    
    render() {
        const Logo = () => (<span className="svg_img" style={logoStyles} />);
        return (
            <Theme.Provider value={{bar: this.state.bar}}>
                <LoadBar />
                <div className="row sidebar">
                    <div className="left_pane">
                        <ul>
                            <li><NavLink to="/home"><i className="icon icon-dashboard"></i>Dashboard</NavLink></li>
                            <li><NavLink to="/talents"><i className="icon icon-talents"></i>Talents</NavLink></li>
                            <li><NavLink to="/favorites"><i className="icon icon-favorite"></i>Favorites</NavLink></li>
                            <li><NavLink to="/applicants"><i className="icon icon-applications"></i>Applicants</NavLink></li>
                            <li><NavLink to="/payroll"><i className="icon icon-shifts"></i>Payroll</NavLink></li>
                            <li><NavLink to="/profile"><i className="icon icon-companyprofile"></i>Your Profile</NavLink></li>
                            <li>
                                <a 
                                    href="#" 
                                    onClick={() => {
                                        const noty = Notify.error("Hey! Are you sure?", (answer) => {
                                            if(answer){
                                                logout();
                                                this.props.history.push('/login');
                                            } 
                                            noty.remove();
                                        });
                                    }}>
                                    <i className="icon icon-logout icon-sm"></i>Logout
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="right_pane bc-scrollbar">
                        <Notifier />
                        <div className="row">
                            <div className="col-12">
                                <Logo />
                            </div>
                        </div>
                        <Switch>
                            <Route exact path='/shifts' component={ManageShifts} />
                            <Route exact path='/applicants' component={ManageApplicantions} />
                            <Route exact path='/talents' component={ManageTalents} />
                            <Route exact path='/favorites' component={ManageFavorites} />
                            <Route exact path='/locations' component={ManageLocations} />
                            <Route exact path='/profile' component={Profile} />
                            <Route exact path='/payroll' component={ManagePayroll} />
                            <Route exact path='/rate' component={RateShift} />
                            <Route exact path='/home' component={Dashboard} />
                            <Route exact path='/' component={Dashboard} />
                        </Switch>    
                    </div>
                    <ButtonBar onClick={(option) => this.state.bar.show(option)} />
                    {
                        (this.state.showRightBar) ? 
                            <SideBar
                                sideBarLevels={this.state.sideBarLevels}
                                catalog={this.state.catalog}
                                onClose={() => this.closeRightBar()}
                            />:''
                    }
                </div>
            </Theme.Provider>
        );
    }
    
}
export default PrivateLayout;