import React, { useContext } from "react";
import { DayBlock } from "./DayBlock";
import { CalendarContext } from "./Calendar";
import PropTypes from "prop-types";

const Day = (props) => <tr className="horizontal-day" style={{
  boxSizing: "border-box",
  width: "100%"
}}>{props.children}</tr>;
Day.propTypes = {
  children: PropTypes.node
};

const HorizontalLabel = (props) => <td style={{
    background: "#f1f1f1",
    padding: "5px",
    minWidth: `${props.width}px`,
    width: `${props.width}px`,
    maxWidth: `${props.width}px`
}}>{props.children}</td>;
HorizontalLabel.propTypes = {
  children: PropTypes.node,
  width: PropTypes.number
};


export const HorizontalDay = ({ events, days, yAxis, timesToShow, width, showRow }) => {
    const { yAxisWidth } = useContext(CalendarContext);
    return yAxis.map((row, i) => (
        <Day key={i}>
            { (yAxisWidth > 0) && <HorizontalLabel width={yAxisWidth}>{row.label}</HorizontalLabel> }
            <DayBlock
                timesToShow={timesToShow}
                key={row.index}
                days={days}
                yAxisLabel={row.label}
                width={width}
                events={row.events}
            />
        </Day>
    ));
};
HorizontalDay.propTypes = {
    events: PropTypes.oneOfType([ PropTypes.array, PropTypes.object ]),
    children: PropTypes.node,
    minWidth: PropTypes.number,
    showRow: PropTypes.bool
};
HorizontalDay.defaultProps = {
  showRow: true
};