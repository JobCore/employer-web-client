import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';

class ButtonBar extends React.Component {

    constructor(){
        super();
        this.state = {
            buttonBarActions: {
                "home": [
                    { slug: "create_shift", title: 'Create shifts', to: 'shifts'},
                    { slug: "invite_talent_to_jobcore", title: 'Invite Talent to JobCore', to: 'talents'}
                ],
                "locations": [
                    { slug: "profile", title: 'Back to company profile', to: '/profile'},
                    { slug: "create_location", title: 'Create a location', to: '/profile/locations'}
                ],
                "shifts": [
                    { slug: "create_shift", title: 'Create shifts', to: 'shifts'},
                    { slug: "filter_shift", title: 'Filter shifts', to: 'shifts'}
                ],
                "applicants": [
                    { slug: "filter_applications", title: 'Filter Applications', to: 'applicants'}
                ],
                "talents": [
                    { slug: "filter_talent", title: 'Filter Talents', to: 'talents'},
                    { slug: "invite_talent_to_jobcore", title: 'Invite New Talent', to: 'talents'}
                ],
                "favorites": [
                    { slug: "create_favlist", title: 'Create Favorite List', to: 'favorites'},
                    { slug: "invite_talent_to_jobcore", title: 'Invite New Talent', to: 'favorites'}
                    // { slug: "manage_payrate", title: 'Manage Payrates', to: 'payrates'}
                ],
                "payrates": [
                    { slug: "manage_favorites", title: 'Manage Favorite List', to: 'favorites'},
                    { slug: "create_payrate", title: 'Create Payrate', to: 'payrates'}
                ],
                "payroll/*": [
                    { slug: "payroll_by_timesheet", title: 'Search by Timesheet', to: '/payroll'},
                    { slug: "payroll_settings", title: 'Payroll Settings', to: '/payroll/settings'},
                    { slug: "payroll_payments_report", title: 'Payments Report', to: '/payroll/payments-report'},
                    { slug: "payroll_deductions_report", title: 'Deductions Report', to: '/payroll/deductions-report'}
                    // { slug: "payroll_by_shift", title: 'Search by Shift', to: 'payroll'},
                ],
                "profile/*": [
                    { slug: "manage_locations", title: 'Company Locations', to: '/profile/locations'},
                    { slug: "my_ratings", title: 'Company Ratings', to: '/profile/ratings'},
                  {slug: "employer_bank_accounts", title: 'Employer bank accounts', to: '/profile/bank-accounts'},
                    { slug: "company_users", title: 'Company Users', to: '/profile/users'}
                ],
                "calendar": [
                    { slug: "create_shift", title: 'Create shifts', to: 'shifts'}
                ]
            },
            currentButtons: []
        };
        this.removeHistoryListener = null;
    }

    getMatchingExpression(path, actions){
        if(path == '/') return "home";

        for(let expression in actions)
            if(path.match(expression))
                return expression;

        return null;
    }

    componentDidMount(){

        const key = this.getMatchingExpression(this.props.history.location.pathname, this.state.buttonBarActions);

        this.setState({ currentButtons:  this.state.buttonBarActions[key] });
        this.removeHistoryListener = this.props.history.listen((data) => {
            const key = this.getMatchingExpression(data.pathname, this.state.buttonBarActions);
            this.setState({currentButtons: this.state.buttonBarActions[key] || [] });
        });
    }

    componentWillUnmount(){
        if(this.removeHistoryListener) this.removeHistoryListener();
    }

    render(){
        const buttons = this.state.currentButtons.map((btn,i) => (<li key={i}>
            <button id={btn.slug} className="btn btn-primary mb-3" style={{fontSize: "14px", fontWeight: "700"}}
                onClick={() => this.props.onClick(btn)}>{btn.title}</button></li>
        ));
        return (<div className="buttonbar">
            <ul>{buttons}</ul>
        </div>);
    }
}

export default withRouter(ButtonBar);

ButtonBar.propTypes = {
    history: PropTypes.object,
    onClick: PropTypes.func.isRequired
};
