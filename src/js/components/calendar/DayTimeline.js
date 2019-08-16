import React, { useContext } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { TimeBlock } from "./TimeBlock";
import { Event } from "./Event";
import { CalendarContext } from "./Calendar";

export const ItemTypes = {
  EVENT: "event"
};

const dayStyles = (props) => ({
    boxSizing: "border-box",
    fontSize: "10px",
    borderRight: "1px solid grey",
    display: "flex",
    position: "relative",
    width: props.width,
    flexDirection: props.direction === "horizontal" ? "row" : "column"
});
const Day = (props) => <div style={dayStyles(props)}>{props.children}</div>;
Day.propTypes = {
  children: PropTypes.node,
  width: PropTypes.string,
  direction: PropTypes.string,
};

const getCollidingEvents = (originalEv, events) => events.filter(
            e =>
            e.start.isBetween(originalEv.start, originalEv.end) ||
            (e.start.isBefore(originalEv.start) && e.end.isAfter(originalEv.end)) ||
            e.end.isBetween(originalEv.start, originalEv.end)
        );
export const DayTimeline = ({ events, date, isActive, width, timesToShow }) => {
    const { timeDirection, dayLabel, blockHeight, eventOffset } = useContext(CalendarContext);
    let maxDayOccupancy = 1;
    events.forEach(e => {
        if(!e.blockLevel){
            e.blockLevel = 0;
            const colliding = getCollidingEvents(e, events);
            colliding.forEach((collider, i) => {
                if(!collider.blockLevel) collider.blockLevel = i + 1;
            });
        }
    });
    const times = timesToShow.map(({ startTime,  endTime, ...rest }, i) => {
        const start = moment(date).set({ h: startTime.hours(), m: startTime.minutes() });
        let end = moment(date).set({ h: endTime.hours(), m: endTime.minutes() });
        let occupancy = events.filter(
                e =>
                e.start.isBetween(start, end) ||
                (e.start.isBefore(start) && e.end.isAfter(end)) ||
                e.end.isBetween(start, end)
            );
        if(occupancy.length > maxDayOccupancy) maxDayOccupancy = occupancy.length;
        return {
            start,
            end,
            index: i,
            events: events.filter(
                e => e.start.isBetween(start, end) || e.start.isSame(start)
            ),
            occupancy
        };
    });

    if (!date) return "Loading...";
    return (
        <Day width={width} active={isActive} direction={timeDirection}>
            {timeDirection === "vertical" && dayLabel && dayLabel(date)}
            {times.map(t => (
                <TimeBlock
                    key={t.index}
                    label={t.label}
                    start={t.start}
                    end={t.end}
                    occupancy={t.occupancy}
                    blockHeight={(maxDayOccupancy * blockHeight) + eventOffset}
                >
                    {t.events.map(({ blockLevel, ...rest}, i) => (
                        <Event key={i} offset={eventOffset + (blockHeight*blockLevel)}  {...rest} />
                    ))}
                </TimeBlock>
            ))}
        </Day>
    );
};

DayTimeline.propTypes = {
  children: PropTypes.node,
  width: PropTypes.string,
  events: PropTypes.array,
  timesToShow: PropTypes.array,
  isActive: PropTypes.bool,
  date: PropTypes.object
};

DayTimeline.defaultProps = {
  isActive: false,
  date: null,
  events: []
};