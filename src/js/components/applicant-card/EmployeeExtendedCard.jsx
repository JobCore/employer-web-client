import './style.scss';
import React from "react";
import PropTypes from 'prop-types';
import {Avatar, Stars, Theme} from '../index';

/**
 * Applican Card
 */
const EmployeeExtendedCard = (props) => {
    const badgesHTML = props.employee.badges.map((b, i) => (<span key={i} className="badge">{b.title}</span>));
    return (<Theme.Consumer>
        {({bar}) => 
            (<li className="aplicantcard aplicantcard-hover">
                <Avatar url={props.employee.profile.picture} />
                <a href="#"><b>{props.employee.profile.user.first_name + " " + props.employee.profile.user.last_name}</b></a>
                <Stars rating={Number(props.employee.rating)} jobCount={props.employee.positions.length}  />
                <p href="#">{badgesHTML}</p>
                
                <div className="btn-group" role="group" aria-label="Basic example">
                    <button type="button" className="btn btn-secondary"
                        onClick={() => bar.show({ slug: "show_single_talent", data: props.employee, title: "Talent Details" })}
                    ><i className="icon icon-favorite icon-xs"></i> <label>Detals</label></button>
                    <button type="button" className="btn btn-secondary"
                        onClick={() => bar.show({ slug: "invite_talent", data: props.employee, title: "Invite Talent" })}
                    ><i className="icon icon-favorite icon-xs"></i> <label>Invite</label></button>
                </div>
            </li>)}
    </Theme.Consumer>);
};
EmployeeExtendedCard.propTypes = {
  employee: PropTypes.object.isRequired
};
export default EmployeeExtendedCard;