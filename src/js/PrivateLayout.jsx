import React from 'react';
import Flux from '@4geeksacademy/react-flux-dash';
import { Route, Switch, Link } from 'react-router-dom';
import {logout, fetchAll} from './actions';
import Home from './views/Home';
import RightBar from './components/RightBar';
import ButtonBar from './components/ButtonBar';
import {AddShift, ManageShifts, FilterShifts, ShiftApplicants} from './components/shifts';
import {store, PrivateProvider} from './actions';
import {Notifier} from './utils/notifier';
import logoURL from '../img/logo.png';

const logoStyles = {
    backgroundImage: `url(${logoURL})`
};

class PrivateLayout extends Flux.DashView{
    
    constructor(){
        super();
        this.state = {
            showRightBar: false,
            showButtonBar: true,
            rightBarComponent: null,
            catalog:{
                positions: [],
                venues: [],
                applicants: []
            },
            bar: {
                show: (option) => {
                    switch (option.slug) {
                        case 'create_shift':
                            this.showRightBar(AddShift, option);
                        break;
                        case 'filter_shift':
                            this.showRightBar(FilterShifts, option);
                        break;
                        case 'show_shift_applicants':
                            this.showRightBar(ShiftApplicants, option, {applicants: option.data.candidates});
                        break;
                        default:
                            this.history.push(option.to);
                        break;
                    }
                }
            }
        };
    }
    
    componentDidMount(){
        fetchAll(['shifts','positions','venues']);
        this.subscribe(store, 'venues', (venues) => this.setCatalog({venues}));
        this.subscribe(store, 'positions', (positions) => this.setCatalog({positions}));
        //this.showRightBar(AddShift);
    }
    
    showRightBar(component, option, incomingCatalog={}){
        const catalog = Object.assign(this.state.catalog, incomingCatalog);
        this.setState({
            showRightBar: true,
            rightBarComponent: component,
            rightBarOption: option,
            catalog
        });
    }
    
    setCatalog(incomingCatalog){
        const catalog = Object.assign(this.state.catalog, incomingCatalog);
        this.setState({catalog});
    }
    
    render() {
        const Logo = () => (<span className="svg_img" style={logoStyles} />);
        return (
            <PrivateProvider value={{bar: this.state.bar}}>
                <div className="row sidebar">
                    <div className="left_pane">
                        <ul>
                            <li><Link to="/home">HOME</Link></li>
                            <li><Link to="/favorites"><i className="icon icon-favorite"></i>Favorites</Link></li>
                            <li><Link to="/profile"><i className="icon icon-companyprofile"></i>Company Profile</Link></li>
                            <li><Link to="/applications"><i className="icon icon-applications"></i>Applications</Link></li>
                            <li><Link to="/shifts"><i className="icon icon-shifts"></i>Shifts</Link></li>
                            <li><Link to="/talents"><i className="icon icon-talents"></i>Talents</Link></li>
                            <li><Link to="/dashboard"><i className="icon icon-dashboard"></i>Dashboard</Link></li>
                            <li><button className="btn" onClick={()=>logout()}><i className="icon icon-logout icon-sm"></i>Logout</button></li>
                        </ul>
                    </div>
                    <div className="right_pane">
                        <Notifier />
                        <div className="row">
                            <div className="col-12">
                                <Logo />
                            </div>
                        </div>
                        <Switch>
                            <Route exact path='/shifts' component={ManageShifts} />
                            <Route exact path='/favorites' component={Home} />
                            <Route exact path='/home' component={Home} />
                            <Route exact path='/' component={Home} />
                        </Switch>    
                    </div>
                    <ButtonBar onClick={(option) => this.state.bar.show(option)} />
                    {
                        (this.state.showRightBar) ? 
                            <RightBar 
                                catalog={this.state.catalog}
                                option={this.state.rightBarOption}
                                component={this.state.rightBarComponent} 
                                onClose={() => this.setState({showRightBar: false, rightBarComponent: null})}
                            />:''
                    }
                </div>
            </PrivateProvider>
        );
    }
    
}
export default PrivateLayout;