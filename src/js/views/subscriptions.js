import React, { useState, useEffect } from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import PropTypes from 'prop-types';
import {store, createSubscription, searchMe } from '../actions.js';
import { Button } from '../components/index';
import {Notify} from 'bc-react-notifier';
import { GET } from "../utils/api_wrapper.js";

import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap_white.css';

//gets the queryst
export const Subscription = (data) => {

    const _defaults = {
        id: '',
        title: '',
        unique_name: '',
        serialize: function(){

            const newLocation = {
//                status: (this.status == 'UNDEFINED') ? 'DRAFT' : this.status,
            };

            return Object.assign(this, newLocation);
        }
    };

    let _location = Object.assign(_defaults, data);
    return {
        validate: () => {
            //if(validator.isEmpty(_location.title)) throw new ValidationError('The location title cannot be empty');
            return _location;
        },
        defaults: () => {
            return _defaults;
        },
        getFormData: () => {
            const _formShift = {
                //title: _location.title,
            };
            return _formShift;
        }
    };
};

/**
 * YourSubscription
 */
const FeatureIndicator = ({fixed, additional, className, boolean}) => <div className={`m-0 ${className}`}>
    { boolean !== null ?
        <div>{boolean ? "Yes" : "No"}</div>
        :
        <div>
            {fixed > 9999 ? "Unlimited" : fixed > 0 && `${fixed} / mo.`}
            {fixed === 0 && additional > 0 ? 
                "$" + additional + "/each"
                : !additional || additional <=0 ? 
                    '' 
                    :
                    <Tooltip placement="top" trigger={['hover']} overlay={<span>
                        {fixed > 0 && fixed < 9999 && additional > 0 && " Plus "}
                        {additional > 0 && "$" + additional + "/each"}
                        {fixed > 0 && fixed < 9999 && additional > 0 && ` after the ${fixed} limit has been reached `}
                    </span>}>
                        <i className="fas fa-plus-circle ml-1"></i>
                    </Tooltip>
            }
        </div>
    }
</div>;
FeatureIndicator.propTypes = {
  className: PropTypes.string,
  boolean: PropTypes.bool,
  fixed: PropTypes.number,
  additional: PropTypes.number
};
FeatureIndicator.defaultProps = {
  className: '',
  fixed: 0,
  boolean: null,
  additional: 0
};
export const YourSubscription = (props) => {

    const [ employer, setEmployer ] = useState(store.getState('current_employer'));
    const [ plans, setPlans ] = useState([]);
    const [ customer, setCustomer ] = useState('');
    const [ subscription, setSubscription ] = useState('');

    useEffect(() => {

        const employerSubscription = store.subscribe('current_employer', (_employer) => setEmployer(_employer));
        GET('subscriptions').then(subs => setPlans(subs));

        searchMe('subscription').then(res => {
            if(Array.isArray(res) && res[1 - res.length]){
               
                const cus = res[1 - res.length]['stripe_cus'];
                const sub = res[1 - res.length]['stripe_sub'];

                if(cus){
                    setCustomer(res[1 - res.length]['stripe_cus']);
                }
                if(sub){
                    setSubscription(res[1 - res.length]['stripe_sub']);
                }
            }
        });

        return () => {
            employerSubscription.unsubscribe();
        };
    }, []);
    
    
    
    if(!employer) return "Loading";
    return (<div>
        <div className="row">
            <div className="col-12">
                Hello {employer.title}
                <p>Current subscription: {employer.active_subscription ? employer.active_subscription.title : "No active subscription"}</p>
            </div>
        </div>
        <div className="row">
            <div className="col-3 text-center">
                <h2>Features</h2>
                <p className="m-0">Base Price</p>
                <p className="m-0">Job Postings /mo.</p>
                <p className="m-0">Maximum active employees / mo.</p>
                <p className="m-0">Maximum Clock In/Out / mo.</p>
                <p className="m-0">Talent Search	</p>
                <p className="m-0">Rate Talent</p>
                <p className="m-0">Invite Talent Manually</p>
                <p className="m-0">Geo Clock In/Out report</p>
                <p className="m-0">Payroll Reports</p>
                <p className="m-0">Create favorite employees list size	</p>
                <p className="m-0">Smart Calendar Features</p>
                <p className="m-0">Pre Approved Trusted Talent</p>
                <p className="m-0">On-line Payments</p>
                <p className="m-0">Pre calculated deductions</p>
                {/* <p className="m-0">QuickBooks Integration</p> */}
            </div>
            {plans.map(p => 
                <div key={p.id} className="col-2 text-center">
                    <h2>{p.title}</h2>
                    <p className="m-0">${p.price_month}/month</p>
                    <FeatureIndicator fixed={p.feature_max_shifts} additional={p.price_per_shifts} />
                    <FeatureIndicator fixed={p.feature_max_active_employees} additional={p.price_per_active_employees} />
                    <FeatureIndicator fixed={p.feature_max_clockins} additional={p.price_per_active_employees} />
                    <FeatureIndicator boolean={p.feature_talent_search} />
                    <FeatureIndicator boolean={true} />
                    <FeatureIndicator fixed={p.feature_max_invites} additional={p.price_per_invites} />
                    <FeatureIndicator boolean={true} />
                    <FeatureIndicator boolean={p.feature_payroll_report} />
                    <FeatureIndicator fixed={p.feature_max_favorite_list_size} />
                    <FeatureIndicator boolean={p.feature_smart_calendar} />
                    <FeatureIndicator boolean={p.feature_trusted_talents} />
                    <FeatureIndicator boolean={p.feature_ach_payments} />
                    <FeatureIndicator boolean={p.feature_calculate_deductions} />
                    {/* <FeatureIndicator boolean={p.feature_quickbooks_integration} /> */}
                    { (!employer.active_subscription || employer.active_subscription.id !== p.id) &&
                        <Button className="w-100 mt-2" onClick={() => {
                            const noti = Notify.info("Are you sure? You will lose any other subscription you may have", (answer) => {
                                if (answer) createSubscription({ subscription: p.id, stripe_cus: customer, stripe_sub: subscription }, props.history);
                                noti.remove();
                            });
                        }}>Apply</Button>
                    }
                </div>
            )}
        </div>
        <div className="mt-4 pt-4">
            <em>If you wish to cancel your subscription please contact us at support@jobcore.co</em>
        </div>
    </div>);
};
YourSubscription.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  formData: PropTypes.object,
  catalog: PropTypes.object //contains the data needed for the form to load
};
