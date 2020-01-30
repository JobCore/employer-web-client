import React, { useContext, useState, useEffect } from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import PropTypes from 'prop-types';
import { store, search, fetchTemporal, create, GET } from '../actions.js';
import { callback, hasTutorial } from '../utils/tutorial';
import { GenericCard, Avatar, Stars, Theme, Button, Wizard, StarRating, SearchCatalogSelect, ShiftOption, ShiftOptionSelected, EmployeeExtendedCard } from '../components/index';
import Select from 'react-select';
import queryString from 'query-string';
import { Session } from 'bc-react-session';
import moment from 'moment';
import { Notify } from 'bc-react-notifier';
import { NOW } from "../components/utils.js";
import { Talent } from '../views/talents.js';

//gets the querystring and creats a formData object to be used when opening the rightbar
export const getRatingInitialFilters = (catalog) => {
    let query = queryString.parse(window.location.search);
    if (typeof query == 'undefined') return {};
    if (!Array.isArray(query.positions)) query.positions = (typeof query.positions == 'undefined') ? [] : [query.positions];
    if (!Array.isArray(query.badges)) query.badges = (typeof query.badges == 'undefined') ? [] : [query.badges];
    return {
        positions: query.positions.map(pId => catalog.positions.find(pos => pos.value == pId)),
        badges: query.badges.map(bId => catalog.badges.find(b => b.value == bId)),
        rating: catalog.stars.find(rate => rate.value == query.rating)
    };
};

export const Rating = (data) => {

    const session = Session.getPayload();
    const _defaults = {
        //foo: 'bar',
        serialize: function () {

            const newRating = {
                comments: '',
                rating: 5,
                sender: null,
                shift: null,
                created_at: NOW()
            };

            return Object.assign(this, newRating);
        },
        unserialize: function () {
            //this.fullName = function() { return (this.user.first_name.length>0) ? this.user.first_name + ' ' + this.user.last_name : 'No name specified'; };
            let shift = null;
            if (this.shift) {
                shift = {
                    ...this.shift,
                    starting_at: moment(this.shift.starting_at),
                    ending_at: moment(this.shift.ending_at)
                };
            }

            return { ...this, shift };
        }

    };

    let _entity = Object.assign(_defaults, data);
    console.log('entidad ', _entity);
    return {
        validate: () => {

            return _entity;
        },
        defaults: () => {
            return _defaults;
        },
        getFormData: () => {
            const _formRating = {
                id: _entity.id,
                comments: _entity.comments,
                rating: _entity.rating,
                employee: _entity.employee,

                // if more than one employee will be rated for the same shift
                employees_to_rate: _entity ? _entity.employees : [],

                sender: _entity.sender,
                shift: _entity.shift ?
                    {
                        ..._entity.shift,
                        starting_at: moment(_entity.shift.starting_at),
                        ending_at: moment(_entity.shift.ending_at)
                    }
                    : null,
                created_at: (moment.isMoment(_entity.created_at)) ? _entity.created_at : moment(_entity.created_at)
            };
            return _formRating;
        },
        filters: () => {
            const _filters = {
                //positions: _entity.positions.map( item => item.value ),
            };
            for (let key in _entity) if (typeof _entity[key] == 'function') delete _entity[key];
            return Object.assign(_entity, _filters);
        }
    };
};

export class ManageRating extends Flux.DashView {

    constructor() {
        super();
        this.state = {
            ratings: [],
            runTutorial: hasTutorial(),
            steps: [],
            employer: null
        };
    }

    componentDidMount() {

        this.filter();
        this.subscribe(store, 'ratings', (ratings) => {
            this.setState({ ratings });
        });

        this.props.history.listen(() => {
            this.filter();
            this.setState({ firstSearch: false });
        });
        this.setState({ runTutorial: true });

        fetchTemporal('employers/me', 'current_employer');
        this.subscribe(store, 'current_employer', (employer) => {
            this.setState({ employer });
        });
    }

    filter(ratings = null) {
        search('ratings', window.location.search);
    }

    render() {
        return (<div className="p-1 listcontents">
            <Theme.Consumer>
                {({ bar }) => (<span>
                    <Wizard continuous
                        steps={this.state.steps}
                        run={this.state.runTutorial}
                        callback={callback}
                    />
                    <h2>Company Ratings</h2>
                    <div className="row mt-2">
                        <div className="col-6">
                            <label>Total Ratings</label>
                            <p>You have been rated <span className="text-success">{this.state.employer ? this.state.employer.total_ratings : "0"} times.</span></p>
                        </div>
                        <div className="col-6">
                            <label>Rating</label>
                            <p>Talents rated you with <span className="text-success">{this.state.employer ? this.state.employer.rating : "0"} points avg.</span></p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <h3>Recent Ratings</h3>
                            {this.state.ratings.map((rate, i) => (
                                <GenericCard key={i} hover={true} onClick={() => bar.show({ slug: "show_single_rating", data: rate, allowLevels: false })}>
                                    <Avatar url={rate.sender.picture} />
                                    <Stars className="float-left" rating={Number(rate.rating)} />
                                    <span>{`  on ${rate.created_at.substring(0, 10)}`}</span>
                                    <p className="mt-0">{rate.comments !== '' ? `"${rate.comments}"` : `The talent didn't provide any comments for this rating.`}</p>
                                </GenericCard>
                            ))}
                        </div>
                    </div>
                </span>)}
            </Theme.Consumer>
        </div>);
    }
}


/**
 * Talent Details
 */
export const RatingDetails = (props) => {
    const { formData } = props;
    const { shift } = formData;

    return (<Theme.Consumer>
        {({ bar }) =>
            (<li className="aplication-details">
                <Avatar url={formData.sender.picture} />
                <p>{formData.sender.user.first_name + ' ' + formData.sender.user.last_name}</p>
                <div>
                    <Stars rating={Number(formData.rating)} />
                </div>
                <h5 className="mt-3">
                    {formData.comments !== '' ? `"${formData.comments}"` : `${formData.sender.user.first_name} didn't provide any comments for this rating.`}
                </h5>
                {!shift || typeof shift.position === 'undefined' ?
                    'Loading shift information...' :
                    <div>
                        <a href="#" className="shift-position">{shift.position.title}</a> @
                        <a href="#" className="shift-location"> {shift.venue.title}</a>
                        <span className="shift-date"> {shift.starting_at.format('ll')} from {shift.starting_at.format('LT')} to {shift.ending_at.format('LT')} </span>
                    </div>
                }
                <Button color="primary" onClick={() => bar.show({ slug: "review_talent", data: formData.sender, allowLevels: false })}>Rate talent back</Button>
            </li>)}
    </Theme.Consumer>);
};
RatingDetails.propTypes = {
    catalog: PropTypes.object.isRequired,
    formData: PropTypes.object
};


/**
 * Talent Details
 */
export const PendingRatings = (props) => {
    return (<Theme.Consumer>
        {({ bar }) =>
            (<li className="aplication-details">
            </li>)}
    </Theme.Consumer>);
};
PendingRatings.propTypes = {
    catalog: PropTypes.object.isRequired,
    formData: PropTypes.object
};


/**
 * Revire Talent for a specific shift
 */
export const ReviewTalentAndShift = (props) => {
    const shift = props.formData.shift;
    const employee = props.formData.employee;
    const startDate = shift.starting_at.format('ll');
    const startTime = shift.starting_at.format('LT');
    const endTime = shift.ending_at.format('LT');
    return (<Theme.Consumer>
        {({ bar }) =>
            (<li className="aplication-details">
                <h4>How satisfied are you with {employee.user.first_name}{"'"}s performance during this shift?</h4>
                <p className="mb-3">
                    <Avatar url={employee.user.profile.picture} />
                </p>
                <a href="#" className="shift-position">{shift.position.title}</a> @
                <a href="#" className="shift-location"> {shift.venue.title}</a>
                <span className="shift-date"> {startDate} from {startTime} to {endTime} </span>
                {
                    (typeof shift.price == 'string') ?
                        <span className="shift-price"> ${shift.price}</span>
                        :
                        <span className="shift-price"> {shift.price.currencySymbol}{shift.price.amount}</span>
                }
                <StarRating
                    placeholderRating={Number(employee.rating ? employee.rating : 1)}
                    emptySymbol="fa fa-star-o fa-2x"
                    fullSymbol="fa fa-star fa-2x"
                    placeholderSymbol={"fa fa-star fa-2x"}
                />
                <textarea className="form-control mt-3" placeholder={`Please describe further your experiences with ${employee.user.first_name}`}>
                </textarea>
                <div className="btn-bar">
                    <Button color="secondary" onClick={() => bar.close()}>Cancel</Button>
                    <Button color="primary" onClick={() => null}>Send</Button>
                </div>
            </li>)}
    </Theme.Consumer>);
};
ReviewTalentAndShift.propTypes = {
    catalog: PropTypes.object.isRequired,
    formData: PropTypes.object
};


/**
 * Review Talent in general
 */
export const RatingEmployees = (props) => {
    const [possibleRatings, setPossibleShifts] = useState(null);


    useEffect(() => {
        let subs = store.subscribe('ratings', (_ratings) => {
            console.log(_ratings);
            const _possibleRatings = _ratings;
            setPossibleShifts(_possibleRatings);
        });

        return () => {
            if (subs) subs.unsubscribe();
        };

    }, []);
    const { onCancel, onSave, catalog, formData } = props;

    const shiftEmployees = formData.shift.employees.map((e) => {
        if (formData.ratings.find(rated => rated.employee == e.id)) {
            var ratedEmployee = Object.assign({}, e);
            ratedEmployee.rating = formData.ratings.find(rated => rated.employee == e.id).rating;
            ratedEmployee.created_at = formData.ratings.find(rated => rated.employee == e.id).created_at;
            return ratedEmployee;
        } else {
            return e;
        }
    });

    console.log(shiftEmployees);
    console.log(formData.ratings);
    return (<Theme.Consumer>
        {({ bar }) => (<div className="sidebar-applicants">
            {shiftEmployees.find(e => !e.rating) ? (
                <div className="top-bar">
                    <button type="button" className="btn btn-primary btn-sm"
                        onClick={() => bar.show({ slug: "review_talent", data: { shift: formData.shift, employees: shiftEmployees.filter(e => !e.rating) }, allowLevels: true })}

                    >
                        Rate employee
                    </button>
                </div>
            ) : (
                    null
                )}


            <h3>Shift Ratings:</h3>
            <ul style={{ overflowY: "auto", maxHeight: "75vh" }}>
                {
                    shiftEmployees.length > 0 ?
                        shiftEmployees.map((tal, i) => (
                            <GenericCard key={i} hover={true}>
                                <Avatar url={tal.user.profile.picture} />
                                <a href="#"><b>{tal.user.first_name + ' ' + tal.user.last_name}</b></a>

                                <Stars rating={Number(tal.rating)} noRatingLabel="Not yet rated for this shift" />
                                {
                                    tal.rating ? null : (
                                        <div className="btn-group" role="group" aria-label="Basic example">
                                            <Button
                                                className="mt-0 text-white" label="Rate"
                                                notePosition="left" note="Rate Employee"
                                                onClick={() => bar.show({ slug: "review_talent", data: { shift: formData.shift, employees: [tal] }, allowLevels: true })}
                                            >
                                                Rate
                                            </Button>

                                        </div>

                                    )
                                }
                            </GenericCard>

                        ))
                        :
                        <li>No ratings were found for this shift</li>
                }
            </ul>
        </div>)}
    </Theme.Consumer>);
};
RatingEmployees.propTypes = {
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    catalog: PropTypes.object, //contains the data needed for the form to load
    formData: PropTypes.object, //contains the data needed for the form to load
    context: PropTypes.object //contact any additional data for context purposes
};
export const UnratingEmployees = (props) => {

    console.log(props);
    const { onCancel, onSave, catalog, formData } = props;
    const unrated_employees = formData.employees.filter(e => !e.rating);
    return (<Theme.Consumer>
        {({ bar }) => (<div className="sidebar-applicants">

            <div className="top-bar">
                <button type="button" className="btn btn-primary btn-sm"
                    onClick={() => bar.show({ slug: "review_talent", data: catalog.shift, allowLevels: true })}

                >
                    Rate employee
                </button>
            </div>

            <h3>Shift Ratings:</h3>
            <ul style={{ overflowY: "auto", maxHeight: "75vh" }}>
                {
                    unrated_employees.length > 0 ?
                        unrated_employees.map((tal, i) => (
                            <EmployeeExtendedCard
                                key={i}
                                employee={tal}
                                hover={false}
                                showFavlist={false}
                            >

                            </EmployeeExtendedCard>)
                        )
                        :
                        <li>No ratings were found for this shift</li>
                }
            </ul>
        </div>)}
    </Theme.Consumer>);
};
UnratingEmployees.propTypes = {
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    catalog: PropTypes.object, //contains the data needed for the form to load
    formData: PropTypes.object, //contains the data needed for the form to load
    context: PropTypes.object //contact any additional data for context purposes
};


export const ReviewTalent = ({ onSave, onCancel, onChange, catalog, formData, error }) => {
    const [shifts, setShifts] = useState([]);
    const [rating, setRating] = useState('');
    const [comments, setComments] = useState('');
    const [employeesToRate, setEmployeesToRate] = useState(formData.employees_to_rate.map(e => (
        {
            label: e.user.first_name + " " + e.user.last_name,
            value: e.id
        }
    )));

    return (<Theme.Consumer>
        {({ bar }) => (
            < form >
                <div className="row">
                    <div className="col-12">
                        <label>Who worked on this shift?</label>

                        <Select
                            isMulti
                            value={employeesToRate}
                            onChange={(employees) => setEmployeesToRate(employees)}
                            options={formData.employees_to_rate.map(e => ({
                                label: e.user.first_name + " " + e.user.last_name,
                                value: e.id
                            }))}

                        />

                    </div>
                </div>
                {/* <div className="row">
                    <div className="col-12">

                        <label>What shift was it working?</label>
                        <Select
                            value={{ value: formData.shift }}
                            components={{ Option: ShiftOption, SingleValue: ShiftOptionSelected({ multi: false }) }}
                            onChange={(selection) => onChange({ shift: selection.value.toString() })}
                            options={[]}
                        />
                    </div>
                </div> */}
                <div className="row">
                    <div className="col-12">
                        <label>How was his performance during the shift</label>
                        <StarRating
                            onClick={(e) =>
                                setRating(e)
                            }
                            onHover={() => null}
                            direction="right"
                            fractions={2}
                            quiet={false}
                            readonly={false}
                            totalSymbols={5}
                            value={rating}
                            placeholderValue={0}
                            placeholderRating={Number(0)}
                            emptySymbol="far fa-star md"
                            fullSymbol="fas fa-star"
                            placeholderSymbol={"fas fa-star"}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <label>Any comments?</label>
                        <textarea className="form-control" onChange={e => setComments(e.target.value)}></textarea>
                    </div>
                </div>
                <div className="btn-bar">
                    <Button color="success"
                        onClick={() => create('ratings',
                            // {
                            //     employee: formData.employees_to_rate.map(e => e.id),
                            //     shifts: formData.shift.id,
                            //     rating: rating,
                            //     comments: comments
                            // }
                            formData.employees_to_rate.map(e => ({
                                employee: e.id,
                                shift: formData.shift.id,
                                rating: rating,
                                comments: comments
                            }))
                        ).then((res) => bar.close("last"))
                            .catch(e => Notify.error(e.message || e))}>Send Review</Button>
                </div>
            </form>
        )}
    </Theme.Consumer>
    );
};
ReviewTalent.propTypes = {
    error: PropTypes.string,
    bar: PropTypes.object,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    formData: PropTypes.object,
    catalog: PropTypes.object //contains the data needed for the form to load
};
ReviewTalent.defaultProps = {
    oldShift: null
};