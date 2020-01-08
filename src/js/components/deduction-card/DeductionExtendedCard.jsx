import './style.scss';
import React from "react";
import PropTypes from 'prop-types';
import deleteIcon from "../../../img/icons/delete.png";
import editIcon from "../../../img/icons/edit-icon.svg";
import SVG from 'react-svg-inline';

// import Stars from '../stars';
/**
 * Applican Card
 */
const DeductionExtendedCard = ({
    deduction,
    onEditClick,
    onDelete
}) => {
    return (
        <tr>
            <td>
                <b>{deduction.name}</b>
            </td>
            <td>
                <b>{`${deduction.value}%`}</b>
            </td>
            <td>
                <b>{`${!deduction.lock ? "Active" : "Inactive"}`}</b>
            </td>
            <td>
                <div className="deduction-description">
                    <b>{deduction.description ? `${deduction.description}` : ""}</b>
                </div>
            </td>
            <td>
                <div className="btn-group" role="group" aria-label="Basic example">
                    <img
                        onClick={onDelete}
                        src={deleteIcon}
                        className={"delete-icon"}
                    />
                    <SVG className="edit-icon" svg={editIcon} onClick={onEditClick} />
                </div>
            </td>
        </tr>
        );
};
DeductionExtendedCard.propTypes = {
    deduction: PropTypes.object.isRequired,
    onDelete: PropTypes.func,
    onEditClick: PropTypes.func
};
DeductionExtendedCard.defaultProps = {
    deduction: {},
    onDelete: null,
    onEditClick: null
};

export default DeductionExtendedCard;