import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import PropTypes from 'prop-types';
import {store, search, fetchTemporal} from '../actions.js';
import {callback, hasTutorial} from '../utils/tutorial';
import {GenericCard, Avatar, Stars, Theme, Button, Wizard, StarRating} from '../components/index';
import Select from 'react-select';
import queryString from 'query-string';
import {Session} from 'bc-react-session';
import moment from 'moment';

//gets the querystring and creats a formData object to be used when opening the rightbar
export const getRatingInitialFilters = (catalog) => {
    let query = queryString.parse(window.location.search);
    if(typeof query == 'undefined') return {};
    if(!Array.isArray(query.positions)) query.positions = (typeof query.positions == 'undefined') ? [] : [query.positions];
    if(!Array.isArray(query.badges)) query.badges = (typeof query.badges == 'undefined') ? [] : [query.badges];
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
        serialize: function(){

            const newRating = {
                //foo: 'bar'
            };

            return Object.assign(this, newRating);
        },
        unserialize: function(){
            //this.fullName = function() { return (this.user.first_name.length>0) ? this.user.first_name + ' ' + this.user.last_name : 'No name specified'; };

            return this;
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
            const _formRating = {
                id: _entity.id,
                comments: _entity.comments,
                rating: _entity.rating,
                sender: _entity.sender,
                created_at: (moment.isMoment(_entity.created_at) ) ? _entity.created_at : moment(_entity.created_at),
            };
            return _formRating;
        },
        filters: () => {
            const _filters = {
                //positions: _entity.positions.map( item => item.value ),
            };
            for(let key in _entity) if(typeof _entity[key] == 'function') delete _entity[key];
            return Object.assign(_entity, _filters);
        }
    };
};

export class ManageRating extends Flux.DashView {

    constructor(){
        super();
        this.state = {
            ratings: [],
            runTutorial: hasTutorial(),
            steps: [],
            employer: null
        };
    }

    componentDidMount(){

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

    filter(ratings=null){
        search('ratings', window.location.search);
    }

    render() {
        return (<div className="p-1 listcontents">
            <Theme.Consumer>
                {({bar}) => (<span>
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
                            {this.state.ratings.map((rate,i) => (
                                <GenericCard key={i} hover={true} onClick={() => bar.show({ slug: "show_single_rating", data: rate, allowLevels: false })}>
                                    <Avatar url={rate.sender.picture} />
                                    <Stars className="float-left" rating={Number(rate.rating)}  />
                                    <span>{`  on ${rate.created_at.substring(0,10)}`}</span>
                                    <p className="mt-0">{`"${rate.comments}"`}</p>
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
    console.log("RatingDetails props: ", props);
    const { formData } = props;
    return (<Theme.Consumer>
        {({bar}) =>
            (<li className="aplication-details">
                <Avatar url={formData.sender.picture} />
                <p>{formData.sender.user.first_name + ' ' + formData.sender.user.last_name}</p>
                <div>
                    <Stars rating={Number(formData.rating)}  />
                </div>
                <h5 className="mt-3">{'"'}{formData.comments}{'"'}</h5>
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
        {({bar}) =>
            (<li className="aplication-details">
            </li>)}
    </Theme.Consumer>);
};
PendingRatings.propTypes = {
  catalog: PropTypes.object.isRequired,
  formData: PropTypes.object
};


/**
 * Talent Details
 */
export const ReviewTalent = (props) => {
    const shift = props.formData.shift;
    const employee = props.formData.employee;
    const startDate = shift.starting_at.format('ll');
    const startTime = shift.starting_at.format('LT');
    const endTime = shift.ending_at.format('LT');
    return (<Theme.Consumer>
        {({bar}) =>
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
ReviewTalent.propTypes = {
  catalog: PropTypes.object.isRequired,
  formData: PropTypes.object
};