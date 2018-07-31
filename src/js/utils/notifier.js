import React from 'react';
import Flux from '@4geeksacademy/react-flux-dash';
import PropTypes from 'prop-types';

const remove = (id) =>{
    let notifications = store.getState('notifications').filter(noti => noti.id != id);
    Flux.dispatchEvent("notifications", notifications);
};

const add = (type, message, confirm=null, timout=6000) =>{
    
    let state = store.getState('notifications');
    if(!state) state = [];
    let notification = {
        id: Math.floor(Math.random() * 100000000000),
        msg: message,
        type: type,
        onConfirm: confirm,
        timout: timout,
        remove: () => remove(notification.id)
    };
    let notifications = state.concat([notification]);
    
    Flux.dispatchEvent("notifications", notifications);
    
    if(!timout) timout = 99999999999999999;
    setTimeout(() => {
        remove(notification.id);
    },timout);
    
    return notification;
};

const success = (msg, conf, timout=6000) => add('success', msg, conf, timout);
const error = (msg, conf, timout=6000) => add('error', msg, conf, timout);
const info = (msg, conf, timout=6000) => add('info', msg, conf, timout);
const clean = () => Flux.dispatchEvent("notifications", []);

export const Notify = {success, error, info, clean, add, remove};

/**
 *      Components
 **/

let Message = (props) => { 
    const Msg = props.noti.msg;
    return (
        <li className={'alert '+props.typeClass}
            style={{
                height: (confirm) ? 'inherit' : '0'
            }}
        >
            { (typeof Msg !== 'string') ? <Msg onConfirm={props.noti.onConfirm} /> : props.noti.msg }
            { (props.confirm && typeof Msg === 'string') ? 
                (<p>
                    <button className="btn btn-light" onClick={() => props.noti.onConfirm(false)}>Cancel</button>
                    <button className="btn btn-success ml-2" onClick={() => props.noti.onConfirm(true)}>Confirm</button>
                </p>)
                : ''
            }
        </li>
    );
};
Message.propTypes = {
  noti: PropTypes.object.isRequired,
  onConfirm: PropTypes.func,
  confirm: PropTypes.bool,
  typeClass: PropTypes.string
};

export class Notifier extends React.Component{

    constructor(){
      super();
      this.state = {
        notifications: [],
        typeClasses: {
          error: 'alert-danger',
          success: 'alert-success',
          info: 'alert-info',
          warning: 'alert-warning'
        }
      };
    }
    
    componentDidMount(){
        this.notiSubs = store.subscribe("notifications", 
            (notifications) => this.setState({ notifications })
        );
    }
    
    componentWillUnmount(){
      this.notiSubs.unsubscribe();
    }
    
    render(){
        const notifications = this.state.notifications.map((noti, i) => {
          if(typeof noti.msg === 'undefined') return '';
          if(typeof noti.onConfirm === 'function') return <Message key={i} noti={noti} confirm={true} typeClass={this.state.typeClasses[noti.type]} />;
          return (<Message key={i} noti={noti} confirm={false} typeClass={this.state.typeClasses[noti.type]} />);
        });
        
        return(<ul className={"bcnotifier "+this.props.className}>{notifications}</ul>);
    }
}
Notifier.propTypes = {
  // You can declare that a prop is a specific JS primitive. By default, these
  // are all optional.
  className: PropTypes.string
};
Notifier.defaultProps = {
  className: ''
};

/**
 *      Store
 **/
class NotificationStore extends Flux.DashStore{
    constructor(){
        super();
        this.state = {
            notifications: []
        };
        this.addEvent("notifications", this._notificationsTransformer.bind(this));
    }
    
    _notificationsTransformer(notifications){
        if(Array.isArray(notifications)) return notifications;
        else return [];
    }
    
    getAllNotifications(){
        return this.state.notifications;
    }
}
const store = new NotificationStore();