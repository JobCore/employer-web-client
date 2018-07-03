import React from 'react';
import Flux from '@4geeksacademy/react-flux-dash';
import { Route, Switch, Link } from 'react-router-dom';
import {logout, fetchAll} from './actions';
import Home from './views/Home';
import {RightBar} from './components/RightBar';
import {AddShift} from './views/Shifts';

class PrivateLayout extends Flux.View{
    
    constructor(){
        super();
        this.state = {
            showRightBar: false,
            rightBarComponent: null
        };
    }
    
    componentDidMount(){
        fetchAll(['shifts','positions']);
        this.showRightBar(AddShift);
    }
    
    showRightBar(component){
        this.setState({
            showRightBar: true,
            rightBarComponent: component
        });
    }
    
    render() {
        return (
            <div className="row sidebar">
                <div className="left_pane">
                    <ul>
                        <li><Link to="/home">HOME</Link></li>
                        <li><Link to="/favorites"><i className="icon icon-server"></i>Favorites</Link></li>
                        <li><Link to="/profile"><i className="icon icon-server"></i>Company Profile</Link></li>
                        <li><Link to="/applications"><i className="icon icon-server"></i>Applications</Link></li>
                        <li><Link to="/shifts"><i className="icon icon-server"></i>Shifts</Link></li>
                        <li><Link to="/talents"><i className="icon icon-server"></i>Talents</Link></li>
                        <li><Link to="/dashboard"><i className="icon icon-server"></i>Dashboard</Link></li>
                        <li><button className="btn" onClick={()=>logout()}><i className="icon icon-server icon-sm"></i>Logout</button></li>
                    </ul>
                </div>
                <div className="right_pane">
                    <Switch>
                        <Route exact path='/favorites' component={Home} />
                        <Route exact path='/home' component={Home} />
                        <Route exact path='/' component={Home} />
                    </Switch>    
                </div>
                {
                    (this.state.showRightBar) ? 
                        <RightBar 
                            component={this.state.rightBarComponent} 
                            onClose={() => this.setState({showRightBar: false, rightBarComponent: null})}
                        />:''
                }
            </div>
        );
    }
    
}
export default PrivateLayout;