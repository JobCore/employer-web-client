import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
class ButtonBar extends React.Component {
    
    constructor(){
        super();
        this.state = {
            buttonBarActions: {
                home: [
                    { slug: "create_shift", title: 'Create shifts', to: 'shifts'},
                    { slug: "invite_talent_to_jobcore", title: 'Invite Talent to JobCore', to: 'talents'}
                ],
                shifts: [
                    { slug: "create_shift", title: 'Create shifts', to: 'shifts'},
                    { slug: "filter_shift", title: 'Filter shifts', to: 'shifts'}
                ],
                applicants: [
                    { slug: "filter_applicants", title: 'Filter Applicants', to: 'applicants'}
                ],
                talents: [
                    { slug: "filter_talent", title: 'Filter Talents', to: 'talents'},
                    { slug: "show_pending_jobcore_invites", title: 'Invite New Talent', to: 'talents'}
                ],
                favorites: [
                    { slug: "create_favlist", title: 'Create Favorite List', to: 'favorites'},
                    { slug: "invite_talent_to_jobcore", title: 'Invite New Talent', to: 'favorites'}
                ]
            },
            currentButtons: []
        };
        this.removeHistoryListener = null;
    }
    
    componentDidMount(){
        let key = this.props.history.location.pathname.replace('/','');
        if(key=='') key='home';
        this.setState({currentButtons: this.state.buttonBarActions[key] || [] });
        this.removeHistoryListener = this.props.history.listen((data) => {
            let key = data.pathname.replace('/','').replace('#','');
            this.setState({currentButtons: this.state.buttonBarActions[key] || [] });
        });
    }
    
    componentWillUnmount(){
        if(this.removeHistoryListener) this.removeHistoryListener();
    }

    render(){
        const buttons = this.state.currentButtons.map((btn,i) => (<li key={i}>
            <button id={btn.slug} className="btn btn-primary mb-3"
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