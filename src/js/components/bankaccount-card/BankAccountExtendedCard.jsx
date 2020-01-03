import './style.scss';
import React from "react";
import PropTypes from 'prop-types';
import Avatar from '../avatar';
import deleteIcon from "../../../img/icons/delete.png";

// import Stars from '../stars';
/**
 * Applican Card
 */
const BankAccountExtendedCard = ({
    account,
    hoverEffect,
    showButtonsOnHover,
    className,
    children,
    onClick,
    onDelete,
}) => {
    // const badgesHTML = props.employee.badges.map((b, i) => (<span key={i} className="badge">{b.title}</span>));
    // const favoriteCount = !Array.isArray(props.employee.favoritelist_set) ? 0 : props.employee.favoritelist_set.length;
    return (
        <li
            className={`bankAccountcard ${hoverEffect ? "bankAccountcard-hover" : ""} 
      ${showButtonsOnHover ? "show-hover" : ""} ${className}`}
            onClick={() => (onClick) ? onClick() : false}
        >
            <Avatar url={""} />
            <div style={{ display: "flex", flexDirection: "column", marginLeft: "55px" }}>
                <b style={{ marginTop: "13px"}}>{account.name}</b>
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
                    onClick={() => onDelete(account)}
                    src={deleteIcon}
                    className={"delete-icon"}
                />
                {children}
            </div>
        </li>);
};
BankAccountExtendedCard.propTypes = {
    account: PropTypes.object.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    showFavlist: PropTypes.bool,
    className: PropTypes.string,
    showButtonsOnHover: PropTypes.bool,
    hoverEffect: PropTypes.bool,
    onClick: PropTypes.func,
    onDelete: PropTypes.func
};
BankAccountExtendedCard.defaultProps = {
    showFavlist: true,
    className: '',
    hoverEffect: true,
    showButtonsOnHover: true,
    children: null,
    onClick: null,
    onDelete: null,
};

export default BankAccountExtendedCard;