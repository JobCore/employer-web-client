import React from 'react';
import {Link} from 'react-router-dom';
import * as actions from '../actions';
import {Notifier} from 'bc-react-notifier';
import loginBanner from '../../img/login-banner.png';

export class Login extends React.Component{
    constructor(){
        super();
        this.state = { email: 'aalejo@gmail.com', password: 'zl3hfu8y', company: '' };
    }
    render(){
        return (
            <div className="public_view login_view">
                <img className="banner" src={loginBanner} />
                <Notifier />
                <form className="col-10 col-sm-5 col-md-4 col-lg-3 mx-auto"
                    onSubmit={(e)=> {
                        e.preventDefault();
                        actions.login(this.state.email, this.state.password);
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
                    <button type="submit" className="btn btn-primary form-control">Sign In</button>
                    <div className="extra-actions">
                        <Link to="/signup" className="float-left ml-4 mt-2">Sign Up</Link>
                        <Link to="/forgot" className="float-right mr-4 mt-2">Forgot Password</Link>
                    </div>
                </form>
            </div>
        );
    }
}

export class Signup extends React.Component{
    constructor(){
        super();
        this.state = { email: 'aalejo@gmail.com', password: 'zl3hfu8y', company: '' };
    }
    render(){
        return (
            <div className="public_view login_view">
                <img className="banner" src={loginBanner} />
                <Notifier />
                <form className="col-10 col-sm-8 col-md-4 col-lg-4 mx-auto"
                    onSubmit={(e)=> {
                        e.preventDefault();
                        actions.signup(this.state.email, this.state.password, this.state.company);
                    }}
                >
                    <div className="form-group">
                        <input type="text" className="form-control rounded" aria-describedby="emailHelp" placeholder="Company Name"
                            onChange={(e) => this.setState({company: e.target.value})}
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
                    <button type="submit" className="btn btn-primary form-control">Sign Un</button>
                    <div className="extra-actions">
                        <Link to="/login" className="float-left ml-4 mt-2">Log In</Link>
                        <Link to="/forgot" className="float-right mr-4 mt-2">Forgot Password</Link>
                    </div>
                </form>
            </div>
        );
    }
}

export class Forgot extends React.Component{
    constructor(){
        super();
        this.state = { email: 'aalejo@gmail.com', password: 'zl3hfu8y', company: '' };
    }
    render(){
        return (
            <div className="public_view login_view">
                <img className="banner" src={loginBanner} />
                <Notifier />
                <form className="col-10 col-sm-5 col-md-4 col-lg-3 mx-auto"
                    onSubmit={(e)=> {
                        e.preventDefault();
                        actions.remind(this.state.email, this.state.password);
                    }}
                >
                    <div className="form-group">
                        <input type="email" className="form-control rounded" aria-describedby="emailHelp" placeholder="Email"
                            value={this.state.email}
                            onChange={(e) => this.setState({email: e.target.value})}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary form-control">Sign Un</button>
                    <div className="extra-actions">
                        <Link to="/login" className="float-left ml-4 mt-2">Back to login</Link>
                    </div>
                </form>
            </div>
        );
    }
}