import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Calendar from "./Calendar.js";
import moment from "moment";

const getDaysOfWeek = activeDate => {
  const start = moment(activeDate).startOf("week");
  const end = moment(activeDate).endOf("week");
  let days = [start];
  let current = moment(start).add(1, "day");
  while (current.isBefore(end)) {
    days.push(current);
    current = moment(current).add(1, "day");
  }
  return days;
};

const datePickerStyles = {
    boxSizing: "border-box",
    fontSize: "10px",
    display: "flex",
    position: "relative",
    flexDirection: "row"
};
const DayPicker = (props) => <div style={datePickerStyles}>{props.children}</div>;
DayPicker.propTypes = {
    children: PropTypes.node,
};

const CalendarView = ({
  events,
  timeDirection,
  dayDirection,
  onChange,
  viewMode,
  dayLabel,
  blockLabel,
  yAxisWidth,
  activeDate,
  eventBoxStyles,
  timeBlockStyles,
  onClick,
  blockHeight,
}) => {
    let daysToShow = [];

    const [ currentDate, setCurrentDate ] = useState(activeDate ? activeDate : moment().startOf("day"));
    const [ _viewMode, setViewMode ] = useState(viewMode);

    if (_viewMode === "day") daysToShow = [currentDate];
    else if (_viewMode === "week") daysToShow = getDaysOfWeek(currentDate);

    return (
        <div>
            <DayPicker>
                <button onClick={() => setCurrentDate(moment(currentDate).add(-1,'days'))}>{'<<'}</button>
                <button onClick={() => setViewMode('day')}>Day</button>
                <button onClick={() => setViewMode('week')}>Week</button>
                <button onClick={() => setCurrentDate(moment(currentDate).add(1,'days'))}>{'>>'}</button>
            </DayPicker>
            <Calendar
                events={events}
                daysToShow={daysToShow}
                timeDirection={timeDirection}
                dayDirection={dayDirection}
                blockPixelSize={40}
                onChange={event => onChange && onChange(event)}
                viewMode={_viewMode}
                dayLabel={dayLabel}
                activeDate={currentDate}
                yAxisWidth={yAxisWidth}
                blockLabel={blockLabel}
                showFrom={5}
                showUntil={24}
                eventOffset={5}

                //events related props
                onClick={(e) => onClick && onClick(e)}

                //styling related props
                eventBoxStyles={eventBoxStyles}
                timeBlockStyles={timeBlockStyles}
                blockHeight={blockHeight}//only applies when its horizontal calendar
            />
        </div>
    );
};

CalendarView.propTypes = {
    children: PropTypes.node,
    viewMode: PropTypes.string,
    timeDirection: PropTypes.string,
    dayDirection: PropTypes.string,
    onChange: PropTypes.func,
    showPreview: PropTypes.bool,
    events: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    timeBlockMinutes: PropTypes.number,
    yAxisWidth: PropTypes.number,
    blockLabel: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.node
    ]),
    dayLabel: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.node
    ]),
    activeDate: PropTypes.object,

    //event-related props
    onClick: PropTypes.func,

    //styling properties
    eventBoxStyles: PropTypes.object,
    timeBlockStyles: PropTypes.object,
    blockHeight: PropTypes.number,//only applies when its horizontal calendar
};

CalendarView.defaultProps = {
  viewMode: "day",
  onChange: null,
  activeDate: null,
  events: [],
  dayLabel: null,
  blockLabel: null,
  yAxisWidth: 40,
  timeBlockMinutes: 30,


  onClick: null,

  blockHeight: 30
};

export default CalendarView;