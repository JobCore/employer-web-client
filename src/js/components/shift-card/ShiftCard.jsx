import React from 'react';
import PropTypes from 'prop-types';
import Theme from '../theme';
import ShiftBadge from '../shift-badge';
import './style.scss';
/**
 * ShiftCard
 */
export default class ShiftCard extends React.Component{
    constructor(){
        super();
        this.state = {
            hoveredClass: ''
        };
        this.hasMousedOut = false;
    }
    render(){
        const totalCandidates = (Array.isArray(this.props.shift.candidates)) ? this.props.shift.candidates.length : 0;
        const totalEmployees = (Array.isArray(this.props.shift.employees)) ? this.props.shift.employees.length : 0;
        const openVacancys = this.props.shift.maximum_allowed_employees - totalEmployees;
        const startDate = this.props.shift.starting_at.format('ll');
        const startTime = this.props.shift.starting_at.format('LT');
        const endTime = this.props.shift.ending_at.format('LT');

        if(!this.props.shift.position) return "Invalid shift, missin position";
        if(!this.props.shift.venue) return "Invalid shift, missin venue";
        return (<Theme.Consumer>
            {({bar}) =>
                (<li className={"shiftcard "+this.state.hoveredClass+" "+this.props.className} onMouseOver={() => {
                        if(this.props.hoverEffect){
                            this.setState({ hoveredClass: 'shiftcard-hovered', hasMousedOut: false });
                            setTimeout(() => {
                                if(this.state.hasMousedOut) this.setState({hoveredClass: ''});
                            }, 250);
                        }
                    }}
                    onMouseOut={() => this.setState({ hasMousedOut: true })}
                    onClick={() => this.props.onClick ? this.props.onClick() : bar.show({ slug: "shift_details", data: this.props.shift, title: "Shift Details" })}
                >
                    <div className="shift-details">
                        { this.props.showStatus && <ShiftBadge {...this.props.shift} />}
                        <span className="shift-position">{this.props.shift.position.title}</span> @
                        <span className="shift-location"> {this.props.shift.venue.title}</span>
                        <span className="shift-date"> {startDate} from {startTime} to {endTime} </span>
                        {
                            (typeof this.props.shift.price == 'string') ?
                                (this.props.shift.price === '0.0') ? '': <span className="shift-price"> ${this.props.shift.price}</span>
                            :
                                <span className="shift-price"> {this.props.shift.price.currencySymbol}{this.props.shift.price.amount}</span>
                        }
                        <div className="btn-group" role="group" aria-label="Basic example">
                            {this.props.children}
                        </div>
                    </div>
                </li>)}
        </Theme.Consumer>);
    }
}
ShiftCard.propTypes = {
    shift: PropTypes.object.isRequired,
    hoverEffect: PropTypes.bool.isRequired,
    onClick: PropTypes.func,
    showStatus: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string
};
ShiftCard.defaultProps = {
  hoverEffect: false,
  showStatus: false,
  children: null,
  onClick: null,
  className: ''
};