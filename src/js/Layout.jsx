import React from 'react';
import Flux from '@4geeksacademy/react-flux-dash';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import {Login, Signup, Forgot} from './views/Auth';
import PrivateLayout from './PrivateLayout';
import {PrivateRoute} from './utils/session';

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
                            <PrivateRoute exact path='/' component={PrivateLayout} />
                            <PrivateRoute exact path='/favorites' component={PrivateLayout} />
                            <PrivateRoute exact path='/profile' component={PrivateLayout} />
                            <PrivateRoute exact path='/applicants' component={PrivateLayout} />
                            <PrivateRoute exact path='/shifts' component={PrivateLayout} />
                            <PrivateRoute exact path='/talents' component={PrivateLayout} />
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