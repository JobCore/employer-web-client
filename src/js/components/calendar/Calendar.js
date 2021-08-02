import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { HorizontalDay } from "./HorizontalDay";
import { DayBlock } from "./DayBlock";
import moment from "moment";

export const CalendarContext = React.createContext(null);

// Create a <Title> react component that renders an <h1> which is
// centered, palevioletred and sized at 1.5em
const layoutStyles = (direction) => ({
  boxSizing: "border-box",
  width: "100%",
  overflowY: "auto",
  display: "flex",
  justifyContent: "space-evenly",
  flexDirection: direction == "horizontal" ? "row" : "column"
});
const Layout = ({ direction, children }) => <div style={layoutStyles(direction)}>{children}</div>;
Layout.propTypes = {
    children: PropTypes.node,
    direction: PropTypes.string
};

const timeStyles = (props) => ({
    fontSize: "12px",
    background: "#b1b1b1"
});
const Time = (props) => <tr style={timeStyles(props)}>{props.children}</tr>;
Time.propTypes = {
    children: PropTypes.node
};

const generateAxis = (events, viewMode) => {
  let axis = [];
  if(typeof(events) !== "object") throw new Error('The events property must be an object');

  for (let key in events) {
    validateEvents(events[key]);
    axis.push({
      label: key,
      events: events[key].map((e, i) => {
        e.axisSlug = key;
        e.index = key + i;
        e.blockLevel = null; //Number from 0 to X,  blockLevel avoids visual collition of events, if 2 evens collide they will be at different blockLevels
        e.duration = moment.duration(e.end.diff(e.start)).asMinutes();
        e.isMultiday = !e.start.isSame(e.end, 'day');
        return e;
      })
    });
  }

  return axis;
};

const validateEvents = (events) => {
    const total = events.length;
    for(let i = 0; i<total; i++){
        const c = events[i];
        if(!moment(c.start).isValid()) throw new Error("Every event must have a 'start' property with the starting date of the event");
        if(!moment(c.end).isValid()) throw new Error("Every event must have a 'end' property with the ending date of the event");
        if(typeof c.label !== "string" && typeof c.label !== "object" ){
            console.error(c);
            throw new Error("Every event must have a label (string)");
        } 
    }
    return true;
};

const Calendar = ({ daysToShow, events, onChange, ...rest }) => {

    //calendar active date
    const activeDate = rest.activeDate ? rest.activeDate : moment().startOf("day");

    const [calendarEvents, setCalendarEvents] = useState(null);
    const [dragMode, setDragMode] = useState(false);
    const [yAxis, setYAxis] = useState([]);
    const [direction, setDirection] = useState({
        days: rest.dayDirection,
        time: rest.timeDirection
    });
    if(rest.timeDirection != direction.time) setDirection({
        days: rest.dayDirection,
        time: rest.timeDirection
    });
    const previousEventsRef = useRef(events);
    console.log(rest);
    useEffect(() => {
        if(previousEventsRef.current !== events || calendarEvents === null){
            previousEventsRef.current = events;
            if (Array.isArray(events)) {

                if (events.length > 0 && typeof events[0].index === 'undefined')
                    validateEvents(events);
                    setCalendarEvents(events.map((e, i) => ({
                        index: i,
                        blockLevel: null,  // Number from 0 to X, blockLevel avoids visual collition of events, if 2 evens collide they will be at different blockLevels
                        duration: moment.duration(e.end.diff(e.start)).asMinutes(),
                        ...e
                    })));
            } else {
                //The timeDirection set to horizontal because the events came as an object
                // if (direction.days !== "vertical" || direction.time !== "horizontal")
                // setDirection({ days: "vertical", time: "horizontal" });
                // console.log("Calendar events", events);
                setYAxis(generateAxis(events));
            }
        }

    }, [ events ]);

    const times = [...Array(Math.round((60 * 24) / rest.timeBlockMinutes))].map((n, i) => {
        const start = moment().startOf("day").add(i * rest.timeBlockMinutes, "minutes");
        let end = moment(start).add(rest.timeBlockMinutes, "minutes");
        return {
            startTime: start,
            endTime: end
        };
    });

    const weeksCount = (rest.viewMode === "month" ? daysToShow.length / 7 : 1);

    if (!daysToShow) return "Loading...";
    return (
        <Layout direction={direction.days}>
            <DndProvider backend={HTML5Backend}>
                <CalendarContext.Provider
                    value={{
                        ...rest,
                        yAxis,
                        timeDirection: direction.time,
                        activeDate,
                        dragMode,
                        toggleDragMode: (value=null) => value ? setDragMode(value) : setDragMode(!dragMode),
                        updateEvent: uEv => {
                            const newEvents = yAxis.length === 0 ?
                                calendarEvents.map(e => e.index === uEv.index ? { ...e, ...uEv } : e)
                                :
                                (() => {
                                    let newEvents = {};
                                    yAxis.forEach(key => {
                                        newEvents[key.label] = key.events.map(e => e.index === uEv.index ? { ...e, ...uEv } : e);
                                    });
                                    return newEvents;
                                })();
                            //console.log("Update event", uEv);
                            if (onChange) onChange(uEv);
                            else{
                                setCalendarEvents(newEvents);
                                setYAxis(generateAxis(newEvents));
                            }
                        }
                }}>
                    {Array.isArray(calendarEvents) ? (
                        <div className="vertical-day"><DayBlock timesToShow={times} days={daysToShow} events={calendarEvents} /></div>)
                        :
                        (<div>
                            {/* Show the day labelS */}

                            {  rest.dayHeader && <div className="d-flex" style={{ padding: rest.viewMode === "month" ? 0 : `0 0 0 ${rest.yAxisWidth}px`}}>
                                    {daysToShow.filter((d,i) => i < 7).map((d,i) =>
                                        <div style={{ flexGrow: 1 }} key={i}>
                                            {rest.dayHeader(d, moment(activeDate).add(1, "day").isSame(d))}
                                        </div>
                                    )}
                                </div>
                            }
                            <table style={{
                                    borderLeft: "1px solid #b1b1b1", width: rest.viewMode === "day" ? ((60 * 24) / rest.timeBlockMinutes * rest.blockPixelSize) + 2 : `calc(100%)`,
                                    display: rest.viewMode === "day" ? "block" : "inline-table",
                                    ...rest.tableStyles
                            }}>
                                {/* Build the header with the times */}
                                { rest.viewMode === "day" &&
                                    <Time yAxisWidth={rest.yAxisWidth} width={(60 * 24) / rest.timeBlockMinutes * rest.blockPixelSize}>
                                        <td colSpan={2} style={{padding: `0 0 0 ${rest.yAxisWidth}px`}}>
                                            {times.map((t, i) =>
                                                <div className="time_header" key={i} style={{
                                                    width: rest.blockPixelSize+"px",
                                                    display: "inline-block",
                                                    listStyle: "none"
                                                }}>
                                                    {t.startTime.minutes() === 0 && t.startTime.format('ha')}
                                                </div>
                                            )}
                                        </td>
                                    </Time>
                                }

                                { Array.apply(null, Array(weeksCount)).map((x,weekNumber) => {

                                    const showFrom = weekNumber * 7;
                                    const showTo = showFrom + 7;
                                    const totalDays = daysToShow.length;

                                    return <HorizontalDay
                                        key={weekNumber}
                                        days={daysToShow.slice(showFrom, totalDays < showTo ? totalDays : showTo)}
                                        timesToShow={times}
                                        events={calendarEvents}
                                        yAxis={rest.viewMode !== "month" ? yAxis : [yAxis.reduce((axis, current) => Object.assign(axis, { events: axis.events.concat(current.events) }), { events: [] })]}
                                        width={(60 * 24) / rest.timeBlockMinutes * rest.blockPixelSize + 0.5}
                                    />;
                                })}
                            </table>
                        </div>
                    )}
                </CalendarContext.Provider>
            </DndProvider>
        </Layout>
    );
};

Calendar.propTypes = {
  timeDirection: PropTypes.string,
  dayDirection: PropTypes.string,
  blockPixelSize: PropTypes.number,
  onChange: PropTypes.func,
  allowResize: PropTypes.bool,
  blockHoverIcon: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node
  ]),
  showLeftSidebar: PropTypes.bool,
  daysToShow: PropTypes.array,
  viewMode: PropTypes.oneOf(['day', 'week', 'month']),
  activeDate: PropTypes.object,
  eventOffset: PropTypes.number, //small margin to separete event from the edge (it makes easier drag&droping on ver busy schedules)
  events: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  timeBlockMinutes: PropTypes.number,
  dayWidth: PropTypes.string,
  yAxisWidth: PropTypes.number,
  showFrom: PropTypes.number,
  showUntil: PropTypes.number,
  blockHeight: PropTypes.number,
  blockLabel: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node
  ]),
  dayLabel: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node
  ]),

  timeBlockStyles: PropTypes.object,
  tableStyles: PropTypes.object,
  dayBlockStyles: PropTypes.object
};

Calendar.defaultProps = {
  timeDirection: "horizontal",
  dayDirection: "vertical",
  onChange: null,
  viewMode: "day",
  dayWidth: "100%",
  activeDate: null,
  blockPixelSize: 30,
  events: [],
  daysToShow: [],
  timeBlockMinutes: 30,
  yAxisWidth: 40,
  dayLabel: null,
  blockLabel: null,
  eventOffset: 0,
  allowResize: true,
  blockHoverIcon: null,
  showLeftSidebar: true,

  //only for horizontal calendar
  blockHeight: 30,
  timeBlockStyles: {},
  dayBlockStyles: {},
  tableStyles: {}
};

export default Calendar;