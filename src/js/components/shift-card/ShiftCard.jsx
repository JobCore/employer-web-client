import React from 'react';
import PropTypes from 'prop-types';
import Theme from '../theme';
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
        const openVacancys = this.props.shift.maximum_allowed_employees;
        const startDate = this.props.shift.starting_at.format('ll');
        const startTime = this.props.shift.starting_at.format('LT');
        const endTime = this.props.shift.ending_at.format('LT');
        return (<Theme.Consumer>
            {({bar}) => 
                (<li className={"shiftcard "+this.state.hoveredClass} onMouseOver={() => {
                        if(this.props.hoverEffect){
                            this.setState({ hoveredClass: 'shiftcard-hovered', hasMousedOut: false });
                            setTimeout(() => {
                                if(this.state.hasMousedOut) this.setState({hoveredClass: ''});
                            }, 250);
                        }
                    }}
                    onMouseOut={() => this.setState({ hasMousedOut: true })}
                    onClick={() => bar.show({ slug: "update_shift", data: this.props.shift, title: "Shift Details" })}
                >
                    <div className="shift-details">
                        {
                            (!this.props.showStatus) ? '':
                                (this.props.shift.status == 'DRAFT') ? 
                                    <span href="#" className="badge badge-secondary">D</span> :
                                        (openVacancys == totalEmployees) ? 
                                            <span href="#" className="badge">{totalEmployees}/{openVacancys}</span> :
                                            <span href="#" className="badge badge-danger">{totalEmployees}/{openVacancys}</span>
                        }
                        <a href="#" className="shift-position">{this.props.shift.position.title}</a> @ 
                        <a href="#" className="shift-location"> {this.props.shift.venue.title}</a> 
                        <span className="shift-date"> {startDate} from {startTime} to {endTime} </span>
                        {
                            (typeof this.props.shift.price == 'string') ? 
                                <span className="shift-price"> ${this.props.shift.price}</span>
                            :
                                <span className="shift-price"> {this.props.shift.price.currencySymbol}{this.props.shift.price.amount}</span>
                        }
                        <div className="btn-group" role="group" aria-label="Basic example">
                            <button type="button" className="btn btn-secondary"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    bar.show({ slug: "show_shift_applications", data: this.props.shift, title: "Shift Applicants" });
                                }}
                            ><i className="icon icon-favorite icon-xs"></i> <label>Applicants</label></button>
                            <button type="button" className="btn btn-secondary"><i className="icon icon-favorite icon-xs"></i> <label>Detais</label></button>
                        </div>
                    </div>
                </li>)}
        </Theme.Consumer>);
    }
}
ShiftCard.propTypes = {
    shift: PropTypes.object.isRequired,
    hoverEffect: PropTypes.bool.isRequired,
    clickForDetails: PropTypes.bool,
    showStatus: PropTypes.bool
};
ShiftCard.defaultProps = {
  hoverEffect: false,
  clickForDetails: true,
  showStatus: false
};