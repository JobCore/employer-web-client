import React from 'react';
import Flux from '@4geeksacademy/react-flux-dash';
import { Route, Switch, NavLink } from 'react-router-dom';
import { logout, fetchAll, fetchSingle, fetchAllMe, searchMe, store, resendValidationLink, fetchTemporal } from './actions';
import Dashboard from './views/dashboard.js';
import ButtonBar from './views/ButtonBar';
import { Session } from 'bc-react-session';
import { Theme, SideBar, LoadBar } from './components/index';
import { ShiftCalendar } from "./views/calendar.js";
import {
    ShiftDetails, ManageShifts, FilterShifts, ShiftApplicants, Shift, getShiftInitialFilters, RateShift, ShiftInvites, ShiftEmployees,
    ShiftTalentClockins
} from './views/shifts.js';
import { ManageApplicantions, ApplicationDetails, FilterApplications, getApplicationsInitialFilters } from './views/applications.js';
import { Talent, ShiftInvite, ManageTalents, FilterTalents, getTalentInitialFilters, TalentDetails } from './views/talents.js';
import { PendingInvites, PendingJobcoreInvites, SearchShiftToInviteTalent, InviteTalentToJobcore, SearchTalentToInviteToShift } from './views/invites.js';
import { ManageFavorites, AddFavlistsToTalent, FavlistEmployees, AddTalentToFavlist, Favlist, AddorUpdateFavlist } from './views/favorites.js';
import { ManageLocations, AddOrEditLocation, Location } from './views/locations.js';
import { ManagePayroll, PayrollReport, PayrollRating, SelectTimesheet, EditOrAddExpiredShift } from './views/payroll.js';
import { ManageRating, Rating, RatingDetails, ReviewTalent, ReviewTalentAndShift } from './views/ratings.js';
import { Profile, PayrollSettings, ManageUsers, InviteUserToCompanyJobcore } from './views/profile.js';
import { NOW } from './components/utils.js';
import { Notifier, Notify } from 'bc-react-notifier';
import log from './utils/log';
import logoURL from '../img/logo.png';
import loadingURL from '../img/loading2.gif';
import moment from 'moment';
import { EngineComponent } from "./utils/write_engine";

class PrivateLayout extends Flux.DashView {

    constructor() {
        super();
        this.currentPath = null;
        this.removeHistoryListener = null;
        this.state = {
            showRightBar: 0,
            showButtonBar: true,
            loading: true,
            userStatus: null,
            sideBarLevels: [],
            catalog: {
                positions: [],
                venues: [],
                applicants: [],
                applicationRestrictions: [
                    { label: "Anyone that qualifies", value: 'ANYONE' },
                    { label: "Only from favorite lists", value: 'FAVORITES' },
                    { label: "Search for specific seople", value: 'SPECIFIC_PEOPLE' }
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
                    { label: 'Completed', value: 'EXPIRED' },
                    { label: 'Paid', value: 'COMPLETED' }
                ]
            },
            bar: {
                show: (option) => {
                    log.info("Right Bar Action: ", option.slug);
                    switch (option.slug) {
                        case 'create_shift':
                            //console.log('create_shift', option.data);
                            this.showRightBar(ShiftDetails, option, { formData: Shift(option.data).defaults() });
                            break;
                        case 'create_expired_shift': {
                            this.showRightBar(EditOrAddExpiredShift, option, { formData: Shift({ ...option.data }).defaults() });
                        } break;
                        case 'filter_talent':
                            this.showRightBar(FilterTalents, option, { formData: getTalentInitialFilters(this.state.catalog) });
                            break;
                        case 'filter_shift':
                            this.showRightBar(FilterShifts, option, { formData: getShiftInitialFilters(this.state.catalog) });
                            break;
                        case 'filter_applications':
                            this.showRightBar(FilterApplications, option, { formData: getApplicationsInitialFilters(this.state.catalog) });
                            break;
                        case 'show_shift_applications': {
                            fetchAllMe(['applications']).then(() => {
                                this.showRightBar(ShiftApplicants, option, {
                                    applicants: option.data.candidates,
                                    shift: option.data
                                });
                            });
                        } break;
                        case 'show_shift_employees': {
                            this.showRightBar(ShiftEmployees, option, { shift: option.data });
                        } break;
                        case 'show_single_applicant':
                            this.showRightBar(ApplicationDetails, option, { applicant: option.data });
                            break;
                        case 'shift_details':
                            fetchSingle('shifts', option.data.id);
                            this.showRightBar(ShiftDetails, option, { formData: Shift(option.data).getFormData() });
                            break;
                        case 'review_shift_invites':
                            searchMe('invites', '?shift=' + option.data.id).then((data) =>
                                this.showRightBar(ShiftInvites, option, {
                                    formData: {
                                        invites: data,
                                        shift: option.data
                                    }
                                })
                            );
                            break;
                        case 'talent_shift_clockins':
                            searchMe('clockins', `?shift=${option.data.shift.id}&employee=${option.data.employee.id}`).then((data) =>
                                this.showRightBar(ShiftTalentClockins, option, {
                                    formData: {
                                        employee: option.data.employee,
                                        clockins: data,
                                        shift: option.data.shift
                                    }
                                })
                            );
                            break;
                        case 'favlist_employees':
                            option.title = "List Details";
                            this.showRightBar(FavlistEmployees, option, { formData: Favlist(option.data).getFormData() });
                            break;
                        case 'invite_talent_to_shift':
                            option.title = "Invite Talent";
                            this.showRightBar(SearchShiftToInviteTalent, option, { formData: ShiftInvite(option.data).getFormData() });
                            break;
                        case 'search_talent_and_invite_to_shift':
                            option.title = "Invite Talent";
                            this.showRightBar(SearchTalentToInviteToShift, option, { formData: ShiftInvite(option.data).getFormData() });
                            break;
                        case 'invite_talent_to_jobcore':
                            this.showRightBar(InviteTalentToJobcore, option, { formData: { include_sms: false } });
                            break;
                        case 'invite_user_to_employer':
                            this.showRightBar(InviteUserToCompanyJobcore, option);
                            break;
                        case 'show_pending_jobcore_invites':
                            this.showRightBar(PendingJobcoreInvites, option);
                            break;
                        case 'show_talent_shift_invites':
                            searchMe('invites', '?status=PENDING&employee=' + option.data.id).then((data) =>
                                this.showRightBar(PendingInvites, option, {
                                    formData: {
                                        invites: data,
                                        talent: option.data
                                    }
                                })
                            );
                            break;
                        case 'show_single_talent':
                            option.title = "Talent Details";
                            fetchSingle({ url: 'employees/' + option.data.id, slug: 'employees' }, option.data.id)
                                .then(talent => this.showRightBar(TalentDetails, option, { employee: Talent(talent).defaults().unserialize() }));
                            break;
                        case 'add_to_favlist':
                            option.title = "Add to favorite lists";
                            this.showRightBar(AddFavlistsToTalent, option, { formData: Talent(option.data).getFormData() });
                            break;
                        case 'create_favlist':
                            option.title = "Create Favorite List";
                            this.showRightBar(AddorUpdateFavlist, option, { formData: Favlist(option.data).getFormData() });
                            break;
                        case 'update_favlist':
                            option.title = "Update list";
                            this.showRightBar(AddorUpdateFavlist, option, { formData: Favlist(option.data).getFormData() });
                            break;
                        case 'create_location':
                            option.title = "Create New Venue";
                            this.showRightBar(AddOrEditLocation, option, { formData: Location(option.data).getFormData() });
                            break;
                        case 'update_location':
                            option.title = "Update Venue";
                            this.showRightBar(AddOrEditLocation, option, { formData: Location(option.data).getFormData() });
                            break;
                        case 'add_talent_to_favlist':
                            option.title = "Search for the talent";
                            this.showRightBar(AddTalentToFavlist, option, { formData: Favlist(option.data).getFormData() });
                            break;
                        case 'show_single_rating':
                            option.title = "Rating";
                            fetchSingle('ratings', option.data.id)
                                .then(rating => this.showRightBar(RatingDetails, option, { formData: Rating(rating).getFormData() }));
                            break;
                        case 'review_talent':
                            option.title = "Review Talent";
                            this.showRightBar(ReviewTalent, option, { formData: Rating(option.data).getFormData() });
                            break;
                        case 'review_talent_and_shift':
                            option.title = "Review Talent";
                            this.showRightBar(ReviewTalentAndShift, option, { formData: Rating(option.data).getFormData() });
                            break;
                        case 'payroll_by_timesheet': {

                            const payrollPeriods = store.getState('payroll-periods');
                            if (!payrollPeriods) searchMe('payroll-periods').then((periods) =>
                                this.showRightBar(SelectTimesheet, option, { formData: { periods } })
                            );
                            else this.showRightBar(SelectTimesheet, option, { formData: { periods: payrollPeriods } });
                        }
                            break;
                        case 'filter_timesheet':
                            this.showRightBar(SelectTimesheet, option, { formData: option.data });
                            break;
                        default:
                            if (typeof option.to == 'string') this.props.history.push(option.to);
                            else log.error("Option slug not found: " + option.slug);
                            break;
                    }
                },
                close: () => this.closeRightBar()
            }
        };
        this.watchers = [];
    }


    componentDidMount() {

        const session = Session.get();
        if (typeof session == 'undefined' || typeof session.active == 'undefined' || session.active == false) this.props.history.push('/login');
        else this.setState({ userStatus: session.payload.user.profile.status, user: session.payload.user });

        const reduce = (list) => list.map(itm => {
            return ({
                label: itm.title || itm.user.first_name + ' ' + itm.user.last_name,
                value: itm.id
            });
        });


        fetchTemporal('employers/me', 'current_employer');
        fetchAll(['positions', 'badges', 'jobcore-invites']);
        this.subscribe(store, 'jobcore-invites', (jcInvites) => this.setCatalog({ jcInvites: jcInvites || [] }));
        this.subscribe(store, 'invites', (invites) => this.setCatalog({ invites }));
        this.subscribe(store, 'venues', (venues) => this.setCatalog({ venues: reduce(venues) }));
        this.subscribe(store, 'positions', (positions) => this.setCatalog({ positions: reduce(positions) }));
        this.subscribe(store, 'badges', (badges) => this.setCatalog({ badges: reduce(badges) }));
        this.subscribe(store, 'favlists', (favlists) => {

            let favoriteEmployees = [];
            let favoriteEmployeesIds = [];
            if (Array.isArray(favlists)) {
                favlists.forEach((favlist) => {
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
            if (this.state.showRightBar && this.state.rightBarOption) {
                if (this.state.rightBarOption.slug == 'show_shift_applicants') {
                    const newRightBarOpt = Object.assign(this.state.rightBarOption, {
                        data: store.get('shifts', this.state.rightBarOption.data.id)
                    });
                    this.state.bar.show(newRightBarOpt);
                }
            }
        });
        this.currentPath = this.props.history.location.pathname;
        this.removeHistoryListener = this.props.history.listen((e) => {
            if (this.currentPath != e.pathname) this.closeRightBar('all');
            this.currentPath = e.pathname;
        });
        //this.showRightBar(AddShift);
    }

    componentWillUnmount() {
        if (this.removeHistoryListener) this.removeHistoryListener();
    }

    showRightBar(component, option, incomingCatalog = {}, watcherScopes = []) {
        const catalog = Object.assign(this.state.catalog, incomingCatalog);

        // const watchers = watcherScopes.map(eventName => store.subscribe(eventName, (state) => {

        // }));
        const newLevel = [{ component, option, formData: incomingCatalog.formData || null }];
        const levels = (option.allowLevels) ? this.state.sideBarLevels.concat(newLevel) : newLevel;
        this.setState({
            showRightBar: levels.length,
            sideBarLevels: levels,
            catalog
        });
    }
    closeRightBar(level = 'last') {
        level = level == 'all' ? 0 : level == 'last' ? this.state.sideBarLevels.length - 1 : parseInt(level, 10);
        // const lastLevel = this.state.sideBarLevels[this.state.sideBarLevels.length-1];
        // if(Array.isArray(lastLevel.watchers)) lastLevel.watchers.forEach((w) => w.unsubscribe());
        const newLevels = this.state.sideBarLevels.filter((e, i) => i < level);
        this.setState({
            showRightBar: level,
            sideBarLevels: newLevels
        });
    }

    setCatalog(incomingCatalog) {
        const catalog = Object.assign(this.state.catalog, incomingCatalog);
        this.setState({ catalog });
    }

    render() {
        const Logo = () => (<span className="svg_img" style={{ backgroundImage: `url(${logoURL})` }} />);
        return (
            <Theme.Provider value={{ bar: this.state.bar }}>
                <LoadBar component={() => <img src={loadingURL} />} style={{ position: "fixed", left: "50vw", top: "50vh" }} />
                <div className="row sidebar">
                    <div className="left_pane">
                        <ul>
                            <li><NavLink to="/home"><i className="icon icon-dashboard"></i>Dashboard</NavLink></li>
                            <li><NavLink to="/talents"><i className="icon icon-talents"></i>Talent Search</NavLink></li>
                            <li><NavLink to="/favorites"><i className="icon icon-favorite"></i>Favorites</NavLink></li>
                            <li><NavLink to="/applicants"><i className="icon icon-applications"></i>Applicants</NavLink></li>
                            <li><NavLink to="/payroll"><i className="icon icon-shifts"></i>Payroll</NavLink></li>
                            <li><NavLink to="/profile"><i className="icon icon-companyprofile"></i>Your Profile</NavLink></li>
                            <li>
                                <a
                                    href="#"
                                    onClick={() => {
                                        const noty = Notify.error("Hey! Are you sure?", (answer) => {
                                            if (answer) {
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
                        {this.state.userStatus === 'PENDING_EMAIL_VALIDATION' && <div className="alert alert-warning p-2 text-center" style={{ marginLeft: "-15px" }}>You need to validate your email to receive notifications
                            <button className="btn btn-success btn-sm ml-2" onClick={() => resendValidationLink(this.state.user.email)}>
                                Resend validation link
                            </button>
                        </div>
                        }
                        <Notifier />
                        <div className="row">
                            <div className="col-12">
                                <Logo />
                            </div>
                        </div>
                        <Switch>
                            <Route exact path='/calendar' render={() => <ShiftCalendar {...this.props} catalog={this.state.catalog} />} />
                            <Route exact path='/shifts' component={ManageShifts} />
                            <Route exact path='/applicants' component={ManageApplicantions} />
                            <Route exact path='/talents' component={ManageTalents} />
                            <Route exact path='/favorites' component={ManageFavorites} />
                            <Route exact path='/profile' component={Profile} />
                            <Route exact path='/profile/locations' component={ManageLocations} />
                            <Route exact path='/profile/users' component={ManageUsers} />
                            <Route exact path='/profile/ratings' component={ManageRating} />
                            <Route exact path='/payroll' component={ManagePayroll} />
                            <Route exact path='/payroll/settings' component={PayrollSettings} />
                            <Route exact path='/payroll/period/:period_id' component={ManagePayroll} />
                            <Route exact path='/payroll/report/:period_id' component={PayrollReport} />
                            <Route exact path='/payroll/rating/:period_id' component={PayrollRating} />
                            <Route exact path='/rate' component={RateShift} />
                            <Route exact path='/home' component={Dashboard} />
                            <Route exact path='/' component={Dashboard} />
                        </Switch>
                    </div>
                    <EngineComponent />
                    <ButtonBar onClick={(option) => this.state.bar.show(option)} />
                    {
                        (this.state.showRightBar) ?
                            <SideBar
                                sideBarLevels={this.state.sideBarLevels}
                                catalog={this.state.catalog}
                                onClose={() => this.closeRightBar()}
                                onBackdropClick={() => this.closeRightBar()}
                            /> : ''
                    }
                </div>
            </Theme.Provider>
        );
    }

}
export default PrivateLayout;