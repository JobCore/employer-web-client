import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import * as actions from '../actions';
import {Notifier} from 'bc-react-notifier';
import loginBanner from '../../img/login-banner.png';

export class Login extends React.Component{
    constructor(){
        super();
        this.state = { email: 'aalejo@gmail.com', password: '1234', company: '', loading: false };
    }
    render(){
        return (
            <div className="public_view login_view">
                <img className="banner" src={loginBanner} />
                <Notifier />
                <form className="col-10 col-sm-5 col-md-4 col-lg-3 mx-auto"
                    onSubmit={(e)=> {
                        e.preventDefault();
                        this.setState({loading: true});
                        actions.login(this.state.email, this.state.password, this.props.history)
                            .then(() => this.setState({loading: false}))
                            .catch(() => this.setState({loading: false}));
                    }}
                >
                    <div className="form-group">
                        <input type="email" className="form-control rounded" aria-describedby="emailHelp" placeholder="Email"
                            value={this.state.email}
                            onChange={(e) => this.setState({email: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <input type="password" className="form-control rounded" id="exampleInputPassword1" placeholder="Password"
                             onChange={(e) => this.setState({password: e.target.value})} value={this.state.password}
                        />
                    </div>
                    {(this.state.loading) ?
                        <button type="submit" className="btn btn-default form-control" disabled>Loading...</button>
                    :
                        <button type="submit" className="btn btn-primary form-control">Sign In</button>
                    }
                    <div className="extra-actions">
                        <Link to="/signup" className="float-left ml-4 mt-2">Sign Up</Link>
                        <Link to="/forgot" className="float-right mr-4 mt-2">Forgot Password</Link>
                    </div>
                </form>
            </div>
        );
    }
}
Login.propTypes = {
    history: PropTypes.object
};
export class Signup extends React.Component{
    constructor(){
        super();
        this.state = { email: 'aalejo@gmail.com', password: '', company: 1, loading: false };
    }
    render(){
        return (
            <div className="public_view login_view">
                <img className="banner" src={loginBanner} />
                <Notifier />
                <form className="col-10 col-sm-8 col-md-4 col-lg-4 mx-auto"
                    onSubmit={(e)=> {
                        this.setState({loading: true});
                        e.preventDefault();
                        actions.signup({
                                email: this.state.email,
                                password: this.state.password,
                                company: this.state.company,
                                account_type: 'employer'
                            }, this.props.history)
                            .then(() => this.setState({loading: false}))
                            .catch(() => this.setState({loading: false}));
                    }}
                >
                    <div className="form-group">
                        <input type="text" className="form-control rounded" aria-describedby="emailHelp" placeholder="Company Name"
                            value="Fetes & Events" readOnly={true}
                        />
                    </div>
                    <div className="form-group">
                        <input type="email" className="form-control rounded" aria-describedby="emailHelp" placeholder="Email"
                            value={this.state.email}
                            onChange={(e) => this.setState({email: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <input type="password" className="form-control rounded" id="exampleInputPassword1" placeholder="Password"
                             onChange={(e) => this.setState({password: e.target.value})} value={this.state.password}
                        />
                    </div>
                    {(this.state.loading) ?
                        <button type="submit" className="btn btn-default form-control" disabled>Loading...</button>
                    :
                        <button type="submit" className="btn btn-primary form-control">Sign Up</button>
                    }
                    <div className="extra-actions">
                        <Link to="/login" className="float-left ml-4 mt-2">Log In</Link>
                        <Link to="/forgot" className="float-right mr-4 mt-2">Forgot Password</Link>
                    </div>
                </form>
            </div>
        );
    }
}
Signup.propTypes = {
    history: PropTypes.object
};
export class Forgot extends React.Component{
    constructor(){
        super();
        this.state = { email: 'aalejo@gmail.com', loading: false };
    }
    render(){
        return (
            <div className="public_view login_view">
                <img className="banner" src={loginBanner} />
                <Notifier />
                <form className="col-10 col-sm-5 col-md-4 col-lg-3 mx-auto"
                    onSubmit={(e)=> {
                        e.preventDefault();
                        this.setState({ loading: true });
                        actions.remind(this.state.email, this.props.history)
                            .then(() => this.setState({loading: false}))
                            .catch(() => this.setState({loading: false}));
                    }}
                >
                    <div className="form-group">
                        <input type="email" className="form-control rounded" aria-describedby="emailHelp" placeholder="Email"
                            value={this.state.email}
                            onChange={(e) => this.setState({email: e.target.value})}
                        />
                    </div>
                    {(this.state.loading) ?
                        <button type="submit" className="btn btn-default form-control" disabled>Loading...</button>
                    :
                        <button type="submit" className="btn btn-primary form-control">Send remind link</button>
                    }
                    <div className="extra-actions">
                        <Link to="/login" className="float-left ml-4 mt-2">Back to login</Link>
                    </div>
                </form>
            </div>
        );
    }
}
Forgot.propTypes = {
    history: PropTypes.object
};

export class Invite extends React.Component{
    constructor(){
        super();
        this.state = { 
            email: '', 
            password: '', 
            first_name: '',
            last_name: '' 
        };
    }
    render(){
        return (
            <div className="row mt-5">
                <div className="col-12 col-sm-10 col-md-9 col-lg-8 col-xl-6 mx-auto">
                    <img className="banner w-100" src={loginBanner} />
                    <h2 className="my-4 text-center">The company Fetes Events LLC wants to hire you for an event and its inviting you to apply, please fill the following form to complete your application:</h2>
                    <form className="col-12 col-lg-10 mx-auto"
                        onSubmit={(e)=> {
                            e.preventDefault();
                            actions.signup({
                                email: this.state.email,
                                password: this.state.password,
                                first_name: this.state.first_name,
                                last_name: this.state.last_name,
                                account_type: 'employee'
                            }, this.props.history)
                                .then(() => this.setState({loading: false}))
                                .catch(() => this.setState({loading: false}));
                        }}
                    >
                        <div className="form-group">
                            <input type="text" className="form-control rounded" aria-describedby="emailHelp" placeholder="First Name"
                                onChange={(e) => this.setState({first_name: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control rounded" aria-describedby="emailHelp" placeholder="Last Name"
                                onChange={(e) => this.setState({last_name: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <input type="email" className="form-control rounded" aria-describedby="emailHelp" placeholder="Email"
                                value={this.state.email}
                                onChange={(e) => this.setState({email: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <input type="password" className="form-control rounded" id="exampleInputPassword1" placeholder="Password"
                                 onChange={(e) => this.setState({password: e.target.value})} value={this.state.password}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary form-control">Sign Up</button>
                    </form>
                </div>
            </div>
        );
    }
}
Invite.propTypes = {
    history: PropTypes.object
};