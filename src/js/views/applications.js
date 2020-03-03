import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import PropTypes from 'prop-types';
import Select from 'react-select';
import { AcceptReject, Avatar, Stars, Theme, Wizard } from '../components/index';
import { store, rejectCandidate, acceptCandidate, fetchAllMe } from '../actions.js';
import queryString from 'query-string';
import { TIME_FORMAT, DATE_FORMAT } from '../components/utils.js';
import moment from 'moment';
import { callback, hasTutorial } from '../utils/tutorial';
//gets the querystring and creats a formData object to be used when opening the rightbar
export const getApplicationsInitialFilters = (catalog) => {
    let query = queryString.parse(window.location.search);
    if (typeof query == 'undefined') return {};
    if (!Array.isArray(query.positions)) query.positions = (typeof query.positions == 'undefined') ? [] : [query.positions];
    if (!Array.isArray(query.venues)) query.venues = (typeof query.venues == 'undefined') ? [] : [query.venues];
    return {
        positions: query.positions.map(pId => catalog.positions.find(pos => pos.value == pId)),
        venues: query.venues.map(bId => catalog.venues.find(b => b.value == bId))
    };
};

export const Application = (data) => {

    const _defaults = {
        //foo: 'bar',
        serialize: function () {

            const newEntity = {
                //foo: 'bar'
                // favoritelist_set: data.favoriteLists.map(fav => fav.value)
            };

            return Object.assign(this, newEntity);
        }
    };

    let _entity = Object.assign(_defaults, data);
    return {
        validate: () => {

            return _entity;
        },
        defaults: () => {
            return _defaults;
        },
        getFormData: () => {
            // const _formShift = {
            //     id: _entity.id,
            //     favoriteLists: _entity.favoriteLists.map(fav => ({ label: fav.title, value: fav.id }))
            // };
            // return _formShift;
        },
        filters: () => {
            const _filters = {
                positions: _entity.positions.map(item => item.value),
                minimum_hourly_rate: _entity.minimum_hourly_rate,
                venues: _entity.venues.map(item => item.value)
            };
            for (let key in _entity) if (typeof _entity[key] == 'function') delete _entity[key];
            return Object.assign(_entity, _filters);
        }
    };
};

export class ManageApplicantions extends Flux.DashView {

    constructor() {
        super();
        this.state = {
            applicants: [],
            runTutorial: hasTutorial(),
            steps: [
                {
                    target: '#applicant_details_header',
                    content: 'Here is everyone that has applied to your shifts but you haven\'t accepted or rejected',
                    placement: 'right'
                },
                {
                    target: '#filter_applicants',
                    content: 'You can also filter this list of applicants by any desired criteria',
                    placement: 'left'
                }
            ]
        };
    }

    componentDidMount() {

        this.filter();
        this.subscribe(store, 'applications', (applicants) => {
            this.filter(applicants);
        });

        this.props.history.listen(() => {
            this.filter();
        });
        this.setState({ runTutorial: true });
        fetchAllMe(['applications']);

    }

    filter(applicants = null) {
        let filters = this.getFilters();
        if (!applicants) applicants = store.getState('applications');
        if (applicants) {
            this.setState({
                applicants: applicants.filter((applicant) => {
                    for (let f in filters) {
                        const matches = filters[f].matches(applicant);
                        if (!matches) return false;
                    }

                    return true;
                }).sort((applicant) => moment().diff(applicant.created_at, 'minutes'))
            });
        }
        else this.setState({ applicant: [] });
    }

    getFilters() {
        let filters = queryString.parse(window.location.search);
        for (let f in filters) {
            switch (f) {
                case "positions":
                    filters[f] = {
                        value: filters[f],
                        matches: (application) => {
                            if (!filters.positions || typeof filters.positions == undefined) return true;
                            else if (!Array.isArray(filters.positions.value)) {
                                return filters.positions.value == application.shift.position.id;
                            }
                            else {
                                if (filters.positions.value.length == 0) return true;
                                return filters.positions.value.find(posId => application.shift.position.id == posId) !== null;
                            }
                        }
                    };
                    break;
                case "minimum_hourly_rate":
                    filters[f] = {
                        value: filters[f],
                        matches: (application) => {
                            if (!filters.minimum_hourly_rate.value) return true;
                            if (isNaN(filters.minimum_hourly_rate.value)) return true;
                            return parseInt(application.shift.minimum_hourly_rate, 10) >= filters.minimum_hourly_rate.value;
                        }
                    };
                    break;
                case "venues":
                    filters[f] = {
                        value: filters[f],
                        matches: (application) => {
                            if (!filters.venues || typeof filters.venues == undefined) return true;
                            else if (!Array.isArray(filters.venues.value)) {
                                return filters.venues.value == application.shift.venue.id;
                            }
                            else {
                                if (filters.venues.value.length == 0) return true;
                                return filters.venues.value.find(posId => application.shift.venue.id == posId) !== null;
                            }
                        }
                    };
                    break;
                case "date":
                    filters[f] = {
                        value: filters[f],
                        matches: (shift) => {
                            const fdate = moment(filters.date.value);
                            return shift.date.diff(fdate, 'days') == 0;
                        }
                    };
                    break;
            }
        }
        return filters;
    }

    render() {
        const applicansHTML = this.state.applicants.map((a, i) => (<ApplicantExtendedCard key={i} applicant={a} shift={a.shift} hover={true} />));
        return (<div className="p-1 listcontents">
            <Theme.Consumer>
                {({ bar }) => (<span>
                    {/* <Wizard continuous
                        steps={this.state.steps}
                        run={this.state.runTutorial}
                        callback={callback}
                    /> */}
                    <h1><span id="applicant_details_header">Applicant Details</span></h1>
                    {
                        (applicansHTML.length == 0) ?
                            <p>No applicants were found</p>
                            :
                            applicansHTML
                    }
                </span>)}
            </Theme.Consumer>
        </div>);
    }
}


/**
 * Applican Card
 */
export const ApplicantExtendedCard = (props) => {
    const startDate = props.shift.starting_at.format('ll');
    const startTime = props.shift.starting_at.format('LT');
    const endTime = props.shift.ending_at.format('LT');
    return (<Theme.Consumer>
        {({ bar }) =>
            (<li className="aplicantcard"
                onClick={() => bar.show({ slug: "show_single_applicant", data: props.applicant.employee, title: "Application Details" })}
            >
                <Avatar url={props.applicant.employee.user.profile.picture} />
                <AcceptReject
                    onAccept={() => acceptCandidate(props.shift.id, props.applicant.employee).then(() => props.onAccept ? props.onAccept() : null)}
                    onReject={() => rejectCandidate(props.shift.id, props.applicant.employee).then(() => props.onReject ? props.onReject() : null)}
                />
                <p>
                    <a href="#" className="shift-position">{props.applicant.employee.user.first_name + " " + props.applicant.employee.user.last_name} </a>
                    is applying for the {props.shift.position.title} position
                    at the <a href="#" className="shift-location"> {props.shift.venue.title}</a>
                    <span className="shift-date"> {startDate} from {startTime} to {endTime} </span>
                    {
                        (typeof props.shift.price == 'string') ?
                            <span className="shift-price"> ${props.shift.price}/hr.</span>
                            :
                            <span className="shift-price"> {props.shift.price.currencySymbol}{props.shift.price.amount}/{props.shift.price.timeframe}.</span>
                    }
                </p>
                <Stars rating={Number(props.applicant.employee.rating)} />
            </li>)}
    </Theme.Consumer>);
};
ApplicantExtendedCard.propTypes = {
    applicant: PropTypes.object.isRequired,
    onAccept: PropTypes.func,
    onReject: PropTypes.func,
    shift: PropTypes.object.isRequired
};
ApplicantExtendedCard.defaultProps = {
    onAccept: null,
    onReject: null
};

/**
 * Application Details
 */
export const ApplicationDetails = (props) => {
    const applicant = props.catalog.applicant.employee || props.catalog.applicant;
    return (<Theme.Consumer>
        {({ bar }) =>
            (<li className="aplication-details">
                <Avatar url={applicant.user.profile.picture} />
                <p>{applicant.user.first_name + " " + applicant.user.last_name}</p>
                <Stars rating={Number(applicant.rating)} />
                <span>Doing 4 jobs</span>
                <p>$ 13 /hr Minimum Rate</p>
                <p>{applicant.user.profile.bio}</p>
            </li>)}
    </Theme.Consumer>);
};
ApplicationDetails.propTypes = {
    onSave: PropTypes.func.isRequired,
    catalog: PropTypes.object.isRequired
};


/**
 * Filter Applications
 */
export const FilterApplications = ({ onSave, onCancel, onChange, catalog, formData }) => {
console.log(catalog);
return(
    <form>
        <div className="row">
            <div className="col">
                <label>Looking for</label>
                <Select isMulti
                    value={formData.positions}
                    options={catalog.positions}
                    onChange={(selection) => onChange({ positions: selection })}
                />
            </div>
        </div>
        <div className="row">
            <div className="col">
                <label>Price / hour</label>
                <input type="number" className="form-control" onChange={(e) => onChange({ minimum_hourly_rate: e.target.value })} value={formData.minimum_hourly_rate} />
            </div>
            <div className="col">
                <label>Date</label>
                <input type="date" className="form-control" onChange={(e) => onChange({ date: e.target.value })} />
            </div>
        </div>
        <div className="row">
            <div className="col">
                <label>Venue</label>
                <Select isMulti
                    value={formData.venues}
                    options={catalog.venues}
                    onChange={(selection) => onChange({ venues: selection })}
                />
            </div>
        </div>
        <div className="btn-bar">
            <button type="button" className="btn btn-primary" onClick={() => onSave()}>Apply Filters</button>
            <button type="button" className="btn btn-secondary" onClick={() => {
                    console.log(formData);
                    formData.venues = [];
                    formData.positions = [];
                    formData.date = '';
                    formData.minimum_hourly_rate = '';
                    onSave(false);
            }}>Clear Filters</button>
        </div>
    </form>
);
};
FilterApplications.propTypes = {
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    formData: PropTypes.object, //contains the data needed for the form to load
    catalog: PropTypes.object //contains the data needed for the form to load
};