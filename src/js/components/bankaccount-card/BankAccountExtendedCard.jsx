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
        <tr>
            <td>
                <b>{account.institution_name}</b>
            </td>
            <td>
                <b>{account.name}</b>
            </td>
            <td>
                <img
                    onClick={() => onDelete(account)}
                    src={deleteIcon}
                    className={"delete-icon"}
                />
            </td>
        </tr>);
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