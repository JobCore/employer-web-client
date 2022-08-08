import './style.scss'; 
import React from 'react';
import Theme from '../theme';
import PropTypes from 'prop-types';

const ListCard = (props) => {
    const employeeCount = props.list.employees.length;
    return (<Theme.Consumer>
        {({bar}) => 
            (<li className="list-card" onClick={() => (props.onClick) ? props.onClick() : null}>
                <a href="#" className="shift-position">{props.list.title}</a>
                <p href="#"> <span className="badge badge-primary">{employeeCount} talents</span></p>
                <div className="btn-group" role="group" aria-label="Basic example">
                    {(props.children) ? props.children : null}
                </div>
            </li>)}
    </Theme.Consumer>);
};
ListCard.propTypes = {
  list: PropTypes.object.isRequired,
  children: PropTypes.object,
  onClick: PropTypes.func
};
ListCard.defaultProps = {
    children: null,
    onClick: null
};
export default ListCard;