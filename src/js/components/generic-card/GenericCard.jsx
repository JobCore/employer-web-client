import React from "react";
import PropTypes from 'prop-types';
import './style.scss';
import Theme from '../theme';
import AcceptReject from '../accept-reject';
/**
 * Applican Card
 */
const GenericCard = (props) => {
    return (<Theme.Consumer>
        {({bar}) =>
            (<li className={"generic-card"+(props.hover ? " show-hover":"")} onClick={() => props.onClick()}>
                {props.children}
                { props.onAccept ?
                    <AcceptReject
                        onAccept={() => props.onAccept()}
                        onReject={() => props.onReject()}
                    />:''
                }
            </li>)}
    </Theme.Consumer>);
};
GenericCard.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  hover: PropTypes.boolean,
  onAccept: PropTypes.func,
  onReject: PropTypes.func
};

GenericCard.defaultProps = {
  hover: false,
  children: null,
  onAccept: null,
  onReject: null
};
export default GenericCard;