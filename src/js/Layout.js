import React from 'react';
import Flux from '@4geeksacademy/react-flux-dash';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import {Login, Signup, Forgot, Invite} from './views/auth.js';
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
                            <Route exact path='/forgot' component={Forgot} />
                            <Route extact path="/invite" component={Invite} />
                            <Route extact path="/shift/:shift_id/invite" component={Invite} />
                            <PrivateRoute exact path='/' component={PrivateLayout} />
                            <PrivateRoute exact path='/favorites' component={PrivateLayout} />
                            <PrivateRoute exact path='/rate' component={PrivateLayout} />
                            <PrivateRoute exact path='/applicants' component={PrivateLayout} />
                            <PrivateRoute exact path='/calendar' component={PrivateLayout} />
                            <PrivateRoute exact path='/shifts' component={PrivateLayout} />
                            <PrivateRoute exact path='/talents' component={PrivateLayout} />
                            <PrivateRoute exact path='/profile' component={PrivateLayout} />
                            <PrivateRoute exact path='/profile/locations' component={PrivateLayout} />
                            <PrivateRoute exact path='/profile/users' component={PrivateLayout} />
                            <PrivateRoute path='/payroll' component={PrivateLayout} />
                            <PrivateRoute exact path='/payroll-settings' component={PrivateLayout} />
                            <PrivateRoute exact path='/home' component={PrivateLayout} />
                            <PrivateRoute exact path='/ratings' component={PrivateLayout} />
                            <Route render={() => (<p className="text-center mt-5">Not found</p>)} />
                        </Switch>
                    </div>
                </BrowserRouter>
            </div>
        );
    }

}
export default Layout;