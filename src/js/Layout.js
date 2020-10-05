import React from 'react';
import Flux from '@4geeksacademy/react-flux-dash';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import {Login, Signup, Forgot, Invite, ResetPassword, Admin} from './views/auth.js';
import PrivateLayout from './PrivateLayout.js';
import {PrivateRoute} from 'bc-react-session';

class Layout extends Flux.View{

    render() {
        return (
            <div className="layout">

                <BrowserRouter>
                    <div>
                        <Switch>
                            <Route exact path='/login' component={Login} />
                            <Route exact path='/signup' component={Signup} />
                            <Route exact path='/login/admin' component={Admin} />
                            <Route exact path='/forgot' component={Forgot} />
                            <Route exact path='/reset_password' component={ResetPassword} />
                            <Route extact path="/invite" component={Invite} />
                            <Route extact path="/shift/:shift_id/invite" component={Invite} />
                            <PrivateRoute exact path='/' component={PrivateLayout} />
                            <PrivateRoute exact path='/favorites' component={PrivateLayout} />
                            <PrivateRoute exact path='/rate' component={PrivateLayout} />
                            <PrivateRoute exact path='/applicants' component={PrivateLayout} />
                            <PrivateRoute exact path='/calendar' component={PrivateLayout} />
                            <PrivateRoute exact path='/shifts' component={PrivateLayout} />
                            <PrivateRoute exact path='/talents' component={PrivateLayout} />
                            <PrivateRoute path='/profile' component={PrivateLayout} />
                            <PrivateRoute path='/payrates' component={PrivateLayout} />
                            <PrivateRoute path='/payroll' component={PrivateLayout} />
                            <PrivateRoute exact path='/home' component={PrivateLayout} />
                            <Route render={() => (<p className="text-center mt-5">Not found</p>)} />
                        </Switch>
                    </div>
                </BrowserRouter>
            </div>
        );
    }

}
export default Layout;
