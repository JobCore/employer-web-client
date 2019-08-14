import React, { useContext } from "react";
import { DayBlock } from "./DayBlock";
import { CalendarContext } from "./Calendar";
import PropTypes from "prop-types";

const Day = (props) => <div style={{
  boxSizing: "border-box",
  width: "100%",
  display: "flex",
  justifyContent: "left"
}}>{props.children}</div>;
Day.propTypes = {
  children: PropTypes.node,
};

const HorizontalLabel = (props) => <div style={{
    boxSizing: "border-box",
    display: "block",
    background: "#f1f1f1",
    padding: "5px",
    overflow: "hidden",
    minWidth: `${props.minWidth}px`
}}>{props.children}</div>;
HorizontalLabel.propTypes = {
  children: PropTypes.node,
  minWidth: PropTypes.number
};


export const HorizontalDay = ({ events, days, yAxis, timesToShow }) => {
    const { yAxisWidth } = useContext(CalendarContext);
    return yAxis.map((row, i) => (
        <Day key={i}>
            <HorizontalLabel minWidth={yAxisWidth}>{row.label}</HorizontalLabel>
            <DayBlock
                timesToShow={timesToShow}
                key={row.index}
                days={days}
                events={row.events}
            />
        </Day>
    ));
};
HorizontalDay.propTypes = {
    events: PropTypes.oneOfType([ PropTypes.array, PropTypes.object ]),
    children: PropTypes.node,
    minWidth: PropTypes.number,
};