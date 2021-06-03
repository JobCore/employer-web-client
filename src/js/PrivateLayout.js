import React from 'react';
import Flux from '@4geeksacademy/react-flux-dash';
import { Route, Switch, NavLink } from 'react-router-dom';
import { logout, fetchAll, fetchSingle, fetchAllMe, searchMe, store, resendValidationLinkCurrent, fetchTemporal } from './actions';
import Dashboard from './views/dashboard.js';
import ButtonBar from './views/ButtonBar';
import { Session } from 'bc-react-session';
import { Theme, SideBar, LoadBar } from './components/index';
import { ShiftCalendar } from "./views/calendar.js";
import { YourSubscription } from "./views/subscriptions.js";
import {
    ShiftDetails, ManageShifts, FilterShifts, ShiftApplicants, Shift, getShiftInitialFilters, RateShift, ShiftInvites, ShiftEmployees,
    ShiftTalentClockins
} from './views/shifts.js';
import { ManageApplicantions, ApplicationDetails, FilterApplications, getApplicationsInitialFilters } from './views/applications.js';
import { Talent, ShiftInvite, ManageTalents, FilterTalents, getTalentInitialFilters, TalentDetails } from './views/talents.js';
import { PendingInvites, PendingJobcoreInvites, SearchShiftToInviteTalent, InviteTalentToJobcore, SearchTalentToInviteToShift } from './views/invites.js';
import { ManageFavorites, AddFavlistsToTalent, FavlistEmployees, AddTalentToFavlist, Favlist, AddorUpdateFavlist } from './views/favorites.js';
import { ManagePayrates, AddOrEditPayrate, Payrate } from './views/payrates.js';
import { ManageLocations, AddOrEditLocation, Location } from './views/locations.js';
import { ManagePayroll, PayrollPeriodDetails, PayrollReport, SelectTimesheet, EditOrAddExpiredShift, PayrollSettings, PayrollRating } from './views/payroll.js';
import { ManageRating, Rating, RatingDetails, ReviewTalent, ReviewTalentAndShift, RatingEmployees, UnratingEmployees } from './views/ratings.js';
import { PaymentsReport } from "./views/payments-report";
import { DeductionsReport } from "./views/deductions-report";
import { Profile, ManageUsers, InviteUserToCompanyJobcore } from './views/profile.js';
import { NOW } from './components/utils.js';
import { Notifier, Notify } from 'bc-react-notifier';
import log from './utils/log';
import logoURL from '../img/logo1.png';
import loadingURL from '../img/loading2.gif';
import moment from 'moment';
import { EngineComponent } from "./utils/write_engine";
import EmployerBankAccounts from "../js/views/employerBankAccounts";
import { CreateDeduction, Deduction, UpdateDeduction } from "./views/deductions";
import { MakePayment, Payment } from "./views/payments";
import '../styles/_notification.scss';
import 'jquery/dist/jquery.min.js';
import 'bootstrap/dist/js/bootstrap.min.js';

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
            employer: null,
            applications: [],
            catalog: {
                positions: [],
                venues: [],
                applicants: [],
                applicationRestrictions: [
                    { label: "Anyone that qualifies", value: 'ANYONE' },
                    { label: "Only from favorite lists", value: 'FAVORITES' },
                    { label: "Search for specific people", value: 'SPECIFIC_PEOPLE' }
                ],
                employer_role: [
                    { label: "Supervisor", value: 'SUPERVISOR' },
                    { label: "Manager", value: 'MANAGER' },
                    { label: "Admin", value: 'ADMIN' }
                ],
                stars: [
                    { label: "0 Star", value: 0 },
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
                ],
                deductionsTypes: [ 
                    { value: 'PERCENTAGE', label: 'Percentage' },
                    { value: 'AMOUNT', label: 'Amount' }
                ]
            },
            bar: {
                show: (option) => {
                    log.info("Right Bar Action: ", option.slug);
                    switch (option.slug) {
                        case 'create_shift':
                            this.showRightBar(ShiftDetails, option, { formData: Shift(option.data).defaults() });
                            break;
                        case 'create_deduction':
                          option.title = "Create deduction";
                          this.showRightBar(CreateDeduction, option, {formData: Deduction(option.data).defaults()});
                        break;
                       case 'update_deduction':
                        option.title = "Update deduction";
                        this.showRightBar(UpdateDeduction, option, {formData: Deduction(option.data).defaults()});
                        break;
                       case 'make_payment':
                        option.title = "Make payment";
                        this.showRightBar(MakePayment, option, {formData: Payment(option.data).defaults()});
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
                            fetchSingle({ url: 'employers/me/shifts/' + option.data.id, slug: 'shifts' }, option.data.id)
                            .then(shift => this.showRightBar(ShiftDetails, option, { formData: Shift(shift).defaults().unserialize() }));
                            // fetchSingle('shifts', option.data.id);
                            // this.showRightBar(ShiftDetails, option, { formData: Shift(option.data).getFormData() });
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
                            this.showRightBar(InviteTalentToJobcore, option, { formData: { talent: true, include_sms: false } });
                            break;
                        case 'invite_user_to_employer':
                            this.showRightBar(InviteUserToCompanyJobcore, option, {formData: {employer: this.state.employer.id}});
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
                        case 'create_payrate':
                            option.title = "Create New Payrate";
                            this.showRightBar(AddOrEditPayrate, option, { formData: Payrate(option.data).getFormData() });
                            break;
                        case 'update_payrate':
                            option.title = "Update Payrate";
                            this.showRightBar(AddOrEditPayrate, option, { formData: Payrate(option.data).getFormData() });
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
                            this.showRightBar(ReviewTalent, option, {

                                formData: Rating({
                                    comments: '',
                                    employees: option.data.employees,
                                    shift: option.data.shift,
                                    created_at: NOW(),
                                    rating: 0
                                }).getFormData()
                            });
                            break;
                        case 'review_single_talent':
                            option.title = "Review Talent";
                            option.data.employees_to_rate = [{
                                user: option.data.sender.user,
                                id: option.data.sender.employee
                            }];
                            this.showRightBar(ReviewTalent, option, {
                                formData: Rating({
                                    comments: '',
                                    employees: option.data.employees_to_rate,
                                    employees_to_rate: option.data.employees_to_rate,
                                    shift: option.data.shift,
                                    created_at: NOW(),
                                    rating: 0
                                }).getFormData()
                            });
                            break;
                        case 'show_employees_rating': {
                            searchMe('ratings', '?shift=' + option.data.id).then((data) =>
                                this.showRightBar(RatingEmployees, option, {
                                    formData: {
                                        ratings: data,
                                        shift: option.data
                                    }
                                })
                            );
                        } break;
                        case 'show_employees_unrating':
                            this.showRightBar(UnratingEmployees, option, { formData: option.data });
                            break;
                        case 'review_talent_and_shift':
                            option.title = "Review Talent";
                            this.showRightBar(ReviewTalentAndShift, option, { formData: Rating(option.data).getFormData() });
                            break;
                        case 'payroll_by_timesheet': {

                            const payrollPeriods = store.getState('payroll-periods');
                            if (!Array.isArray(payrollPeriods) || payrollPeriods.length === 0) searchMe(`payroll-periods`, `?end=${moment().format('YYYY-MM-DD')}&start=${moment().subtract(1, 'months').format('YYYY-MM-DD')}`).then((periods) =>
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
                label: itm.title || itm.label || itm.user.first_name + ' ' + itm.user.last_name,
                value: itm.id || itm.value
            });
        });

        const users = store.getState('users');
        this.subscribe(store, 'users', (users) => {
            if(session.payload){
                const user = users.find(u => u.email == session.payload.user.username);
                if(user) this.setState({profileStatus: user.profile.status});
            }
        });
        if (users){
            if(session.payload){
                const user = users.find(u => u.email == session.payload.user.username);
                if(user) this.setState({profileStatus: user.profile.status});
            }
        }
        else searchMe('users');

        this.subscribe(store, 'current_employer', (employer) => this.setState({ employer }));
        fetchTemporal('employers/me', 'current_employer');
        fetchAll([
            { slug: 'positions', url: 'catalog/' + 'positions' }, { slug: 'badges', url: 'catalog/' + 'badges' }, 'jobcore-invites']);
        this.subscribe(store, 'jobcore-invites', (jcInvites) => this.setCatalog({ jcInvites: jcInvites || [] }));
        this.subscribe(store, 'invites', (invites) => this.setCatalog({ invites }));
        this.subscribe(store, 'venues', (venues) => this.setCatalog({ venues: reduce(venues) }));
        this.subscribe(store, 'positions', (positions) => this.setCatalog({ positions: reduce(positions) }));
        this.subscribe(store, 'badges', (badges) => this.setCatalog({ badges: reduce(badges) }));
        this.subscribe(store, 'applications', (applications) => {if(applications)this.setState({applications:applications});
        else searchMe('applications').then((res) => this.setState({applications: res})); });
        searchMe('clockins', `?updated=True`).then((res) => this.setState({applications: this.state.applications.concat(res)}));

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

    showPayroll(){
        if(this.state.user){
            if(this.state.user.profile.employer_role == "SUPERVISOR"){
                return(<li className="mt-2" style={{cursor: "pointer"}}onClick={() => Notify.error("Only admins and managers are allowed to use the payroll system.")
            }><i id="payroll" className="icon icon-shifts"></i>Payroll</li>);
            }else return <li><NavLink to="/payroll"><i id="payroll" className="icon icon-shifts"></i>Payroll</NavLink></li>;
        }
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
                            {this.showPayroll()}
                            <li><NavLink to="/profile" id="profilelink"><i className="icon icon-companyprofile"></i>Your Profile</NavLink></li>
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
                            <li style={{paddingTop: "9.19px"}}><a href="https://jobcore.co/contact" target="_blank" rel="noopener noreferrer"><i className="fas fa-question" style={{fontSize: "40px", color:"#D4EBF1"}}></i><br/>Help</a></li>

                        </ul>
                    </div>
                    <div className="right_pane bc-scrollbar">
                        {this.state.profileStatus == 'PENDING_EMAIL_VALIDATION' && <div className="alert alert-warning p-2 text-center mb-0" style={{ marginLeft: "-15px" }}>You need to validate your email to receive notifications
                            <button className="btn btn-success btn-sm ml-2" onClick={() => resendValidationLinkCurrent(this.state.user.email)}>
                                {/* <button className="btn btn-success btn-sm ml-2" onClick={() => resendValidationLinkCurrent(this.state.user.email, this.state.employer.id)}> */}
                                Resend validation link
                            </button>
                        </div>
                        }
                        {
                            this.state.employer && this.state.employer.active_subscription && !this.state.employer.active_subscription && 
                                <div className="alert alert-warning p-2 text-center mb-0" style={{ marginLeft: "-15px" }}>You are currently on a limited free plan
                                    <button className="btn btn-success btn-sm ml-2" onClick={() => this.props.history.push('/profile/subscription')}>
                                        Upgrade my plan
                                    </button>
                                </div>
                        }
                        <Notifier />
                        <div className="row">
                            <div className="col-6">
                                <Logo />
                                {this.state.employer ? (
                                    <div className="row no-gutters mb-4">        
                                        <div className="col-xs-6">
                                            {this.state.employer.picture ? <div style={{ height:"75px", borderRadius: "50%", border: "1px solid #BDBDBD", backgroundSize: "cover", width: "75px", backgroundImage: `url(${this.state.employer.picture})` }}/>: ""}
                                        </div>
                                        <div className="col-xs-6 pl-4 my-auto" >
                                            <h1><u>{this.state.employer? this.state.employer.title.toUpperCase(): ""}</u></h1>
                                            <span>Company ID: {this.state.employer && this.state.employer.id}</span>
                                        </div>
                                    </div>
                                ): null}
            
                            </div>
                            <div className="col-2 pt-3 mx-auto">
                                
                                <div className="panel panel-default">
                                    <div className="panel-body">
                                        <div className="btn-group pull-right top-head-dropdown">
                                            <button type="button" style={{
                                                border:"none",
                                                outline: "none",
                                                backgroundColor:"transparent",
                                                color:"#27666F"
                                            }}  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={() => {
                                                // searchMe('applications').then((res) => this.setState({applications: res}));
                                            }}>
                                                <i className="fas fa-bell" style={{fontSize: '26px'}}></i>
                                            </button>
                                            {this.state.applications.length > 0 && (
                                                <span style={{
                                                        padding: "3px 5px 2px",
                                                        position: "absolute",
                                                        top: "1px",
                                                        right: "-6px",
                                                        display: "inline-block",
                                                        minWidth: "10px",
                                                        fontSize: "12px",
                                                        fontWeight: "bold",
                                                        color: "#ffffff",
                                                        lineHeight: "1",
                                                        verticalAlign: "baseline",
                                                        whiteSpace: "nowrap",
                                                        textAlign: "center",
                                                        borderRadius: "10px",
                                                        backgroundColor:"#db5565"
                                                }}>{this.state.applications.length}</span>
                                            )}
                                            {this.state.applications.length > 0 ? (

                                                <ul className="dropdown-menu dropdown-menu-right">
                                                    {this.state.applications.sort((a,b) => (b.updated_at < a.updated_at) ? -1 : ((b.updated_at > a.updated_at) ? 1 : 0)).map((emp,i) => {
                                                        return(
                                                            <li key={i}>
                                                                <a href="#" className="top-text-block" onClick={()=> this.state.bar && this.state.bar.show({ slug: "shift_details", data: emp.shift, title: "Shift Details" })}>
                                                                    <div className="row mb-1">
                                                                        <div className="col-2 my-auto pl-2 pr-0">
                                                                            <div className="top-text-heading">{emp.employee.user.profile.picture ? (
                                                                                <div style={{
                                                                                    width:"35px",
                                                                                    height:"35px",
                                                                                    backgroundRepeat:"no-repeat",
                                                                                    backgroundPosition:"center",
                                                                                    backgroundColor: "#eaffe6",
                                                                                    backgroundSize: "cover",
                                                                                    backgroundImage: `url(${emp.employee.user.profile.picture})`,
                                                                                    borderRadius: "100%"
                                                                                }}/>

                                                                            ) : (
                                                                                <div style={{
                                                                                    width:"35px",
                                                                                    height:"35px",
                                                                                    backgroundRepeat:"no-repeat",
                                                                                    backgroundPosition:"center",
                                                                                    backgroundColor: "#eaffe6",
                                                                                    backgroundSize: "cover",
                                                                                    backgroundImage: `url(${'https://res.cloudinary.com/hq02xjols/image/upload/v1560365062/static/default_profile2.png'})`,
                                                                                    borderRadius: "100%"
                                                                                }}/>
                                                                            )
                                                                            }
                                                                        
                                                                            
                                                                            </div>

                                                                        </div>
                                                                        {emp.author ? (
                                                                            <div className="col pl-0 my-auto">
                                                                                <span style={{fontSize:"12px"}}>{" " + emp.employee.user.first_name + " " + emp.employee.user.last_name} <b>{emp.ended_at ? "clocked out at " + moment(emp.ended_at).format('MM/DD/YYYY, hh:mm A') : "clocked in at " + moment(emp.started_at).format('MM/DD/YYYY, hh:mm A')}</b> to shift <span style={{color:"#B3519E"}}>{emp.shift.position.title}</span> @ {emp.shift.venue.title} {moment(emp.shift.starting_at).format('ll')} from {moment(emp.shift.starting_at).format('LT')} to {moment(emp.shift.ending_at).format('LT')}  {
                                                                                    (typeof emp.shift.price == 'string') ?
                                                                                        <span className="shift-price"> ${emp.shift.price}</span>
                                                                                        :
                                                                                        <span className="shift-price"> {"$"}{emp.shift.minimum_hourly_rate}</span>
                                                                                }
                                                                                </span>

                                                                            </div>
                                                                        ): (
                                                                            <div className="col pl-0 my-auto">
                                                                                <span style={{fontSize:"12px"}}>{" " + emp.employee.user.first_name + " " + emp.employee.user.last_name} <b>applied</b> to shift <span style={{color:"#B3519E"}}>{emp.shift.position.title}</span> @ {emp.shift.venue.title} {moment(emp.shift.starting_at).format('ll')} from {moment(emp.shift.starting_at).format('LT')} to {moment(emp.shift.ending_at).format('LT')}  {
                                                                                    (typeof emp.shift.price == 'string') ?
                                                                                        <span className="shift-price"> ${emp.shift.price}</span>
                                                                                        :
                                                                                        <span className="shift-price"> {"$"}{emp.shift.minimum_hourly_rate}</span>
                                                                                }
                                                                                </span>

                                                                            </div>

                                                                        )}
                                                                    </div>
                                                                    <div className="top-text-light">{moment(emp.created_at).fromNow()}</div>
                                                                </a> 
                                                            </li>
                                                        );
                                                    })}
                                                
                                                </ul>
                                            ): (
                                            
                                                <ul className="dropdown-menu dropdown-menu-right" style={{height:"50px", paddingTop: "0", paddingBottom:"0"}}>
                                                    <li style={{height:"100%"}}>
                                                        <div className="row text-center justify-content-center mt-2">
                                                            <div className="col my-auto">
                                                                <span style={{verticalAlign:"middle",color:"#999"}}>There is no activity at the moment.</span>
                                                            </div>
                                                        </div>
                                                    </li>
                                             
                                                </ul>
                                            )
                                            
                                            }
                                        </div>
                                    </div>
                                </div>  

                            </div>
                        </div>
                        <Switch>
                            <Route exact path='/calendar' render={() => <ShiftCalendar {...this.props} catalog={this.state.catalog} />} />
                            <Route exact path='/shifts' component={ManageShifts} />
                            <Route exact path='/applicants' component={ManageApplicantions} />
                            <Route exact path='/talents' component={ManageTalents} />
                            <Route exact path='/favorites' component={ManageFavorites} />
                            <Route exact path='/payrates' component={ManagePayrates} />
                            <Route exact path='/payroll-settings' component={PayrollSettings} />
                            <Route exact path='/profile' component={Profile} />
                            <Route exact path='/profile/subscription' component={YourSubscription} />
                            <Route exact path='/profile/locations' component={ManageLocations} />
                            <Route exact path='/profile/users' component={ManageUsers} />
                            <Route exact path='/profile/ratings' component={ManageRating} />
                            <Route exact path='/profile/bank-accounts' component={EmployerBankAccounts} />
                            <Route exact path='/payroll' recomponent={ManagePayroll} />
                            <Route exact path='/payroll/settings' component={PayrollSettings} />
                            <Route exact path='/payroll/period/:period_id' component={PayrollPeriodDetails} />
                            <Route exact path='/payroll/report/:period_id' component={PayrollReport} />
                            <Route exact path='/payroll/payments-report' component={PaymentsReport} />
                            <Route exact path='/payroll/deductions-report' component={DeductionsReport} />
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
