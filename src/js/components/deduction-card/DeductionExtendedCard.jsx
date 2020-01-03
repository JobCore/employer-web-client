import './style.scss';
import React from "react";
import PropTypes from 'prop-types';
import Avatar from '../avatar';
import deleteIcon from "../../../img/icons/delete.png";
import editIcon from "../../../img/icons/edit-icon.svg";
import SVG from 'react-svg-inline';

// import Stars from '../stars';
/**
 * Applican Card
 */
const DeductionExtendedCard = ({
    deduction,
    hoverEffect,
    showButtonsOnHover,
    className,
    children,
    onClick,
    onEditClick
}) => {
    // const badgesHTML = props.employee.badges.map((b, i) => (<span key={i} className="badge">{b.title}</span>));
    // const favoriteCount = !Array.isArray(props.employee.favoritelist_set) ? 0 : props.employee.favoritelist_set.length;
    return (
        <li
            className={`deductioncard ${hoverEffect ? "deductioncard-hover" : ""} 
      ${showButtonsOnHover ? "show-hover" : ""} ${className}`}
            onClick={() => (onClick) ? onClick() : false}
        >
            <Avatar url={""} />
            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: "55px" }}>
                <b>{deduction.name}</b>
                <b>{` ${deduction.deduction}%`}</b>
                <b>{` status: ${deduction.active ? "Active" : "Inactive"}`}</b>
            </div>
            {/* <Stars
        rating={Number(props.employee.rating)}
        jobCount={!Array.isArray(props.employee.positions) ? 0 : props.employee.positions.length}
      /> */}
            {/* {(props.showFavlist) ?
                <p href="#">{(favoriteCount > 0)
                    ? <span className="badge badge-warning">
                        <i className="fas fa-star"></i> {favoriteCount} Lists
                    </span> : ''} {badgesHTML}
                </p>
                : ''
            } */}
            <div className="btn-group" role="group" aria-label="Basic example">
                <img
                    src={deleteIcon}
                    className={"delete-icon"}
                />
                <SVG className="edit-icon" svg={editIcon} onClick={onEditClick} />
                {children}
            </div>
            {/* {(children) ?
                <div className="btn-group" role="group" aria-label="Basic example">
                    {children}
                </div>
                : ''
            } */}
        </li>);
};
DeductionExtendedCard.propTypes = {
    deduction: PropTypes.object.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    showFavlist: PropTypes.bool,
    className: PropTypes.string,
    showButtonsOnHover: PropTypes.bool,
    hoverEffect: PropTypes.bool,
    onClick: PropTypes.func,
    onEditClick: PropTypes.func
};
DeductionExtendedCard.defaultProps = {
    showFavlist: true,
    className: '',
    hoverEffect: true,
    showButtonsOnHover: true,
    children: null,
    onClick: null,
    onEditClick: null,
};

export default DeductionExtendedCard;