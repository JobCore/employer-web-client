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

const getDaysOfMonth = activeDate => {
    const start = moment(activeDate).startOf("month");
    const startWithOffset = moment(start).startOf("week");
    const end = moment(activeDate).endOf("month");
    const endWithOffset = moment(end).endOf("week");
    let days = [startWithOffset];
    let current = moment(startWithOffset).add(1, "day");
    while (current.isBefore(endWithOffset)) {
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
const getVal = (_default, value) => (_default === null || _default === undefined) ? value : _default;
const _modes = {
    day: {
        _timeBlockMinutes: 30,
        _yAxisWidth: 120,
        _dayDirection: 'vertical',
        _timeDirection: 'horizontal',
        _blockHeight: 50,
        _blockPixelSize: 20,
        _allowResize: true,
        _timeBlockStyles: {
            borderRight: "1px solid #e3e3e3",
        },
        _dayHeader: (day, active) => <h2 style={{ backgroundColor: active ? "yellow" : "inherit" }}>{day.diff(moment()) && "Today: "} {day.format("MMM Do YYYY")}</h2>
    },
    week: {
        _timeBlockMinutes: 1439,
        _yAxisWidth: 120,
        _dayDirection: 'horizontal',
        _timeDirection: 'horizontal',
        _blockHeight: 50,
        _blockPixelSize: 100,
        _allowResize: false,
        _dayHeader: (day, active) => <h2 style={{ backgroundColor: active ? "yellow" : "inherit", padding: "5px" }}>{day.format("ddd Do")}</h2>
    },
    month: {
        _timeBlockMinutes: 1439,
        _yAxisWidth: 0,
        _dayDirection: 'horizontal',
        _timeDirection: 'horizontal',
        _blockHeight: 50,
        _blockPixelSize: 100,
        _allowResize: false,
        _dayHeader: (day) => <h2 style={{ padding: "5px" }}>{day.format("dddd")}</h2>,
        _dayLabel: (day, active) => <span style={{ position: "absolute", top: 0, left: 0, color: active ? "#a90089" : "inherit", fontWeight: 900 }}>{day.format("MMM DD")} {active && "(active)"}</span>
    }
};
const DayPicker = (props) => <div style={datePickerStyles}>{props.children}</div>;
DayPicker.propTypes = {
    children: PropTypes.node,
};

const CalendarView = ({
  events,
  ToolbarComponent,
  timeDirection,
  dayDirection,
  timeBlockMinutes,
  blockPixelSize,
  onChange,
  viewMode,
  dayLabel,
  dayHeader,
  blockLabel,
  yAxisWidth,
  activeDate,
  eventBoxStyles,
  timeBlockStyles,
  dayBlockStyles,
  onClick,
  blockHeight,
  allowResize
}) => {
    let daysToShow = [];

    const [ currentDate, setCurrentDate ] = useState(activeDate ? activeDate : moment().startOf("day"));
    const [ _viewMode, setViewMode ] = useState(viewMode);
    if(viewMode !== _viewMode) setViewMode(viewMode);

    if (_viewMode === "day"){
        daysToShow = [currentDate];
    }
    else if (_viewMode === "week"){
        daysToShow = getDaysOfWeek(currentDate);
    }
    else if (_viewMode === "month"){
        daysToShow = getDaysOfMonth(currentDate);
    }
    const { _timeBlockMinutes, _yAxisWidth, _dayDirection, _timeDirection, _blockHeight, _blockPixelSize, _allowResize, _dayHeader, _dayLabel, _timeBlockStyles } = _modes[_viewMode];
    return (
        <div>
            {
                ToolbarComponent ?
                    <ToolbarComponent currentDate={currentDate} setCurrentDate={setCurrentDate} setViewMode={setViewMode} />
                    :
                    <DayPicker>
                        <button onClick={() => setCurrentDate(moment(currentDate).add(-1,_viewMode))}>{'<<'}</button>
                        <button onClick={() => setViewMode('day')}>Day</button>
                        <button onClick={() => setViewMode('week')}>Week</button>
                        <button onClick={() => setViewMode('month')}>Month</button>
                        <button onClick={() => setCurrentDate(moment(currentDate).add(1,_viewMode))}>{'>>'}</button>
                    </DayPicker>
            }
            <Calendar
                timeDirection={getVal(timeDirection,_timeDirection)}
                dayDirection={getVal(dayDirection,_dayDirection)}
                yAxisWidth={getVal(yAxisWidth,_yAxisWidth)}
                blockHeight={getVal(blockHeight,_blockHeight)}//only applies when its horizontal calendar
                timeBlockMinutes={getVal(timeBlockMinutes,_timeBlockMinutes)}
                blockPixelSize={getVal(blockPixelSize ,_blockPixelSize)}
                allowResize={getVal(allowResize,_allowResize)}
                dayHeader={getVal(dayHeader,_dayHeader)}
                dayLabel={getVal(dayLabel,_dayLabel)}

                events={events}
                daysToShow={daysToShow}
                onChange={event => onChange && onChange(event)}
                viewMode={_viewMode}
                activeDate={currentDate}
                blockLabel={blockLabel}
                showFrom={5}
                showUntil={24}
                eventOffset={5}

                //events related props
                onClick={(e) => onClick && onClick(e)}

                //styling related props
                eventBoxStyles={eventBoxStyles}
                timeBlockStyles={timeBlockStyles || _timeBlockStyles || ({})}
                dayBlockStyles={dayBlockStyles}
            />
        </div>
    );
};

CalendarView.propTypes = {
    children: PropTypes.node,
    ToolbarComponent: PropTypes.node,
    viewMode: PropTypes.oneOf(['day', 'week', 'month']),
    dayDirection: PropTypes.string,
    timeDirection: PropTypes.string,
    onChange: PropTypes.func,
    allowResize: PropTypes.bool,
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
    dayHeader: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.node
    ]),
    activeDate: PropTypes.object,

    //event-related props
    onClick: PropTypes.func,

    //styling properties
    eventBoxStyles: PropTypes.object,
    timeBlockStyles: PropTypes.object,
    dayBlockStyles: PropTypes.object,
    blockPixelSize: PropTypes.number,
    blockHeight: PropTypes.number//only applies when its horizontal calendar
};

CalendarView.defaultProps = {
  viewMode: "day",
  ToolbarComponent: null,
  onChange: null,
  activeDate: null,
  events: [],
  blockLabel: null,
  onClick: null,

  dayLabel: null,
  dayHeader: null,
  timeDirection: null,
  dayDirection: null,
  yAxisWidth: null,
  timeBlockMinutes: null,
  blockHeight: null,
  blockPixelSize: null,

  dayBlockStyles: {},
  timeBlockStyles: null
};

export default CalendarView;