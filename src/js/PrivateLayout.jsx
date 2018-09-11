import React from 'react';
import Flux from '@4geeksacademy/react-flux-dash';
import { Route, Switch, Link } from 'react-router-dom';
import {logout, fetchAll} from './actions';
import Dashboard from './views/Dashboard';
import ButtonBar from './views/ButtonBar';
import {Theme, SideBar} from './components/index';
import {ShiftDetails, ManageShifts, FilterShifts, ShiftApplicants, Shift, getShiftInitialFilters, RateShift, AddVenue} from './views/shifts';
import {ManageApplicants, ApplicationDetails,FilterApplicants, getApplicantInitialFilters} from './views/applicants';
import {Talent, ShiftInvite, ManageTalents, FilterTalents, getTalentInitialFilters, TalentDetails} from './views/talents';
import {PendingInvites, InviteTalentToShift, InviteTalentToJobcore} from './views/invites';
import {ManageFavorites, AddTalentToFavlist, FavlistEmployees, Favlist, AddFavlist} from './views/favorites';
import {Profile, Location} from './views/profile';
import {store} from './actions';
import {Notifier} from 'bc-react-notifier';
import logoURL from '../img/logo.png';

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
            sideBarLevels: [],
            catalog:{
                positions: [],
                venues: [],
                applicants: [],
                applicationRestrictions: [
                    { label: "Anyone that qualifies", value: 'ANYONE' },
                    { label: "Only from my favorites", value: 'FAVORITES' },
                    { label: "Specific People from favorites", value: 'SPECIFIC_PEOPLE' }
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
                        case 'filter_applicants':
                            this.showRightBar(FilterApplicants, option, {formData: getApplicantInitialFilters(this.state.catalog)});
                        break;
                        case 'show_shift_applicants':
                            this.showRightBar(ShiftApplicants, option, {applicants: option.data.candidates, shift: option.data});
                        break;
                        case 'show_single_applicant':
                            this.showRightBar(ApplicationDetails, option, {applicant: option.data});
                        break;
                        case 'update_shift':
                            this.showRightBar(ShiftDetails, option, {formData: Shift(option.data).getFormData()});
                        break;
                        case 'favlist_employees':
                            option.title = "List: "+option.data.title;
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
                            option.title = "Add to favorites";
                            this.showRightBar(AddTalentToFavlist, option, {formData: Talent(option.data).getFormData()});
                        break;
                        case 'create_favlist':
                            option.title = "Create Favorite List";
                            this.showRightBar(AddFavlist, option, {formData: Favlist(option.data).getFormData()});
                        break;
                        case 'update_favlist':
                            option.title = "List: "+option.data.title;
                            this.showRightBar(AddFavlist, option, {formData: Favlist(option.data).getFormData()});
                        break;
                        case 'create_venue':
                            option.title = "Create New Venue";
                            this.showRightBar(AddVenue, option, {formData: Location(option.data).getFormData()});
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
        const reduce = (list) => list.map(itm => ({ 
            label: itm.title || itm.profile.user.first_name + ' ' + itm.profile.user.last_name, 
            value: itm.id 
        }));
        fetchAll(['shifts','positions','venues', 'favlists', 'badges', 'jobcore-invites']);
        
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
                <div className="row sidebar">
                    <div className="left_pane">
                        <ul>
                            <li><Link to="/home"><i className="icon icon-dashboard"></i>Dashboard</Link></li>
                            <li><Link to="/talents"><i className="icon icon-talents"></i>Talents</Link></li>
                            <li><Link to="/favorites"><i className="icon icon-favorite"></i>Favorites</Link></li>
                            <li><Link to="/applicants"><i className="icon icon-applications"></i>Applications</Link></li>
                            <li><Link to="/shifts"><i className="icon icon-shifts"></i>Shifts</Link></li>
                            <li><Link to="/profile"><i className="icon icon-companyprofile"></i>Your Profile</Link></li>
                            <li><a href="#" onClick={()=>logout()}><i className="icon icon-logout icon-sm"></i>Logout</a></li>
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
                            <Route exact path='/applicants' component={ManageApplicants} />
                            <Route exact path='/talents' component={ManageTalents} />
                            <Route exact path='/favorites' component={ManageFavorites} />
                            <Route exact path='/profile' component={Profile} />
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