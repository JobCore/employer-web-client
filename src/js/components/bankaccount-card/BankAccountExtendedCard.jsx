import './style.scss';
import React from "react";
import PropTypes from 'prop-types';
import deleteIcon from "../../../img/icons/delete.png";

const BankAccountExtendedCard = ({
    account,
    onDelete,
}) => {
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
    onDelete: PropTypes.func
};
BankAccountExtendedCard.defaultProps = {
    account: {},
    onDelete: null,
};

export default BankAccountExtendedCard;