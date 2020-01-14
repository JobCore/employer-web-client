import './style.scss';
import React from "react";
import PropTypes from 'prop-types';
import Avatar from '../avatar';
import Stars from '../stars';
/**
 * Applican Card
 */
const EmployeeExtendedCard = (props) => {
    const badgesHTML = !props.employee.badges ? [] : props.employee.badges.map((b, i) => (<span key={i} className="badge">{b.title}</span>));
    const favoriteCount = !Array.isArray(props.employee.favoritelist_set) ? 0 :props.employee.favoritelist_set.length;
    return (<li className={`aplicantcard ${props.hoverEffect ? "aplicantcard-hover":""} ${props.showButtonsOnHover ? "show-hover":""} ${props.className}`} onClick={() => (props.onClick) ? props.onClick() : false}>
        <Avatar url={props.employee.user.profile.picture} />
        <a href="#"><b>{props.employee.user.first_name + ' ' + props.employee.user.last_name}</b></a>
        <Stars rating={Number(props.employee.rating)} jobCount={!Array.isArray(props.employee.positions) ? 0 : props.employee.positions.length}  />
        { (props.showFavlist) ?
            <p href="#">{ (favoriteCount > 0) ? <span className="badge badge-warning"><i className="fas fa-star"></i> {favoriteCount} Lists</span> : '' } {badgesHTML}</p>
            :''
        }
        {(props.children) ?
            <div className="btn-group" role="group" aria-label="Basic example">
                {props.children}
            </div>
            :''
        }
    </li>);
};
EmployeeExtendedCard.propTypes = {
  employee: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  showFavlist: PropTypes.bool,
  className: PropTypes.string,
  showButtonsOnHover: PropTypes.bool,
  hoverEffect: PropTypes.bool,
  onClick: PropTypes.func
};
EmployeeExtendedCard.defaultProps = {
  showFavlist: true,
  className:'',
  hoverEffect: true,
  showButtonsOnHover: true,
  children: null,
  onClick: null
};

export default EmployeeExtendedCard;