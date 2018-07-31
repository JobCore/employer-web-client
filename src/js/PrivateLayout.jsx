import React from 'react';
import Flux from '@4geeksacademy/react-flux-dash';
import { Route, Switch, Link } from 'react-router-dom';
import {logout, fetchAll} from './actions';
import Dashboard from './views/Dashboard';
import RightBar from './views/RightBar';
import ButtonBar from './views/ButtonBar';
import {Theme} from './components/index';
import {ShiftDetails, AddShift, ManageShifts, FilterShifts, ShiftApplicants, Shift, getShiftInitialFilters} from './views/shifts';
import {ManageApplicants, ApplicationDetails} from './views/applicants';
import {Talent, ShiftInvite, ManageTalents, FilterTalents, getTalentInitialFilters, InviteTalentToShift, InviteTalentToJobcore, TalentDetails} from './views/talents';
import {ManageFavorites, AddTalentToFavlist} from './views/favorites';
import {store} from './actions';
import {Notifier} from './utils/notifier';
import logoURL from '../img/logo.png';

const logoStyles = {
    backgroundImage: `url(${logoURL})`
};

class PrivateLayout extends Flux.DashView{
    
    constructor(){
        super();
        this.state = {
            showRightBar: false,
            showButtonBar: true,
            rightBarComponent: null,
            rightBarOption: null,
            catalog:{
                positions: [],
                venues: [],
                applicants: []
            },
            bar: {
                show: (option) => {
                    switch (option.slug) {
                        case 'create_shift':
                            this.showRightBar(AddShift, option);
                        break;
                        case 'filter_talent':
                            this.showRightBar(FilterTalents, option, {formData: getTalentInitialFilters(this.state.catalog)});
                        break;
                        case 'filter_shift':
                            this.showRightBar(FilterShifts, option, {formData: getShiftInitialFilters(this.state.catalog)});
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
                        case 'invite_talent':
                            this.showRightBar(InviteTalentToShift, option, {formData: ShiftInvite(option.data).getFormData()});
                        break;
                        case 'invite_talent_to_jobcore':
                            this.showRightBar(InviteTalentToJobcore, option);
                        break;
                        case 'show_single_talent':
                            this.showRightBar(TalentDetails, option, {employee: option.data});
                        break;
                        case 'add_to_favlist':
                            this.showRightBar(AddTalentToFavlist, option, {formData: Talent(option.data).getFormData()});
                        break;
                        default:
                            this.history.push(option.to);
                        break;
                    }
                },
                close: () => this.closeRightBar()
            }
        };
    }
    
    componentDidMount(){
        fetchAll(['shifts','positions','venues', 'favlists', 'badges']);
        
        this.subscribe(store, 'venues', (venues) => this.setCatalog({venues}));
        this.subscribe(store, 'positions', (positions) => this.setCatalog({positions}));
        this.subscribe(store, 'badges', (badges) => this.setCatalog({badges}));
        this.subscribe(store, 'favlists', (favlists) => this.setCatalog({favlists}));
        this.subscribe(store, 'shifts', (shifts) => {
            
            this.setCatalog({shifts});
            if(this.state.showRightBar && this.state.rightBarOption){
                if(this.state.rightBarOption.slug == 'show_shift_applicants'){
                    const newRightBarOpt = Object.assign(this.state.rightBarOption, {
                        data: store.get('shifts', this.state.rightBarOption.data.id)
                    });
                    this.state.bar.show(newRightBarOpt);
                }
            }
        });
        //this.showRightBar(AddShift);
    }
    
    showRightBar(component, option, incomingCatalog={}){
        const catalog = Object.assign(this.state.catalog, incomingCatalog);
        this.setState({
            showRightBar: true,
            rightBarComponent: component,
            rightBarOption: option,
            catalog,
            formData: incomingCatalog.formData || null
        });
    }
    closeRightBar(){
        this.setState({
            showRightBar: false,
            rightBarComponent: null,
            rightBarOption: null
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
                            <li><Link to="/home">HOME</Link></li>
                            <li><Link to="/favorites"><i className="icon icon-favorite"></i>Favorites</Link></li>
                            <li><Link to="/profile"><i className="icon icon-companyprofile"></i>Company Profile</Link></li>
                            <li><Link to="/applicants"><i className="icon icon-applications"></i>Applications</Link></li>
                            <li><Link to="/shifts"><i className="icon icon-shifts"></i>Shifts</Link></li>
                            <li><Link to="/talents"><i className="icon icon-talents"></i>Talents</Link></li>
                            <li><Link to="/home"><i className="icon icon-dashboard"></i>Dashboard</Link></li>
                            <li><a href="#" onClick={()=>logout()}><i className="icon icon-logout icon-sm"></i>Logout</a></li>
                        </ul>
                    </div>
                    <div className="right_pane">
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
                            <Route exact path='/home' component={Dashboard} />
                            <Route exact path='/' component={Dashboard} />
                        </Switch>    
                    </div>
                    <ButtonBar onClick={(option) => this.state.bar.show(option)} />
                    {
                        (this.state.showRightBar) ? 
                            <RightBar 
                                catalog={this.state.catalog}
                                option={this.state.rightBarOption}
                                formData={this.state.formData}
                                component={this.state.rightBarComponent} 
                                onClose={() => this.setState({showRightBar: false, rightBarComponent: null})}
                            />:''
                    }
                </div>
            </Theme.Provider>
        );
    }
    
}
export default PrivateLayout;