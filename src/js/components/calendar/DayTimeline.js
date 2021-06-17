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
    fontSize: "10px",
    padding: "0",
    overflow: "hidden",
    borderRight: "none",
    position: "relative",
    minWidth: props.width,
    maxWidth: props.width
});
const Day = (props) => <td className="day-block" style={{...dayStyles(props), ...props.style}}>{props.children}</td>;
Day.propTypes = {
  children: PropTypes.node,
  width: PropTypes.string,
  style: PropTypes.object,
  direction: PropTypes.string
};

const getCollidingEvents = (originalEv, events) => events.filter(
            e =>
            e.start.isBetween(originalEv.start, originalEv.end) ||
            (e.start.isBefore(originalEv.start) && e.end.isAfter(originalEv.end)) ||
            e.end.isBetween(originalEv.start, originalEv.end) ||
            (e.start.isSame(originalEv.start) && e.end.isSame(originalEv.end))
        );
export const DayTimeline = ({ events, date, isActive, width, timesToShow, yAxisLabel }) => {
    const { timeDirection, dayLabel, blockHeight, eventOffset, dayBlockStyles } = useContext(CalendarContext);
    events.forEach(e => {
        if(!e.blockLevel){
            e.blockLevel = 0;
            const colliding = getCollidingEvents(e, events);
            colliding.forEach((collider, i) => {
                let proposedLevel = 0;
                let collidingOnNewLevel = null;
                while(collidingOnNewLevel === null || collidingOnNewLevel.length > 0){
                    collidingOnNewLevel = colliding.filter(c => c.blockLevel === proposedLevel);
                    e.blockLevel = proposedLevel;
                    proposedLevel++;
                }
            });
        }
    });
    const maxDayOccupancy = events.reduce((total,e) => total < e.blockLevel ? e.blockLevel : total, 1) + 1;
    //calculate the real day begginign and end based on the blocks
    const dayStart = moment(date).set({ h: timesToShow[0].startTime.hours(), m: timesToShow[0].startTime.minutes() });
    const dayEnd = moment(date).add(1,'days').set({ h: timesToShow[timesToShow.length-1].endTime.hours(), m: timesToShow[timesToShow.length-1].endTime.minutes()-1 });

    const times = timesToShow.map(({ startTime,  endTime, ...rest }, i) => {
        const start = moment(date).set({ h: startTime.hours(), m: startTime.minutes() });
        let end = moment(date).set({ h: endTime.hours(), m: endTime.minutes() });
        let occupancy = events.filter(
                e =>
                e.start.isBetween(start, end) ||
                (e.start.isBefore(start) && e.end.isAfter(end)) ||
                e.end.isBetween(start, end) ||
                (e.start.isSame(start) && e.end.isSame(end))
            );
        //console.log("Occupancy for "+start.format('MM Do, h:mm')+" and "+end.format('MM Do, h:mm'), events.map(e => e.start.format('MMMM Do, h:mm')));
        return {
            start,
            yAxis: yAxisLabel,
            end,
            index: i,
            events: events.filter(
                e => e.start.isBetween(start, end) || e.start.isSame(start) ||
                //if this is the first timeblock of the day, and there are any multiday event coming
                (i == 0 && e.isMultiday && (e.end.isSame(end) || (e.start.isBefore(start) && e.end.isAfter(end))))
            ),
            occupancy
        };
    });

    if (!date) return "Loading...";
    return (
        <Day width={width} style={dayBlockStyles} active={isActive} direction={timeDirection}>
            { dayLabel && dayLabel(date, isActive)}
            {times.map(t => (
                <TimeBlock
                    key={t.index}
                    label={t.label}
                    start={t.start}
                    yAxis={yAxisLabel}
                    end={t.end}
                    occupancy={t.occupancy}
                    blockHeight={(maxDayOccupancy * blockHeight) + eventOffset}
                >
                    {t.events.map(({ blockLevel, ...rest}, i) => (
                        <Event key={i} allowResizeStart={dayStart.isBefore(rest.start)} allowResizeEnd={dayEnd.isAfter(rest.end)} offset={eventOffset + (blockHeight*blockLevel)} {...rest} />
                    ))}
                </TimeBlock>
            ))}
        </Day>
    );
};

DayTimeline.propTypes = {
  children: PropTypes.node,
  width: PropTypes.string,
  yAxisLabel: PropTypes.string,
  events: PropTypes.array,
  timesToShow: PropTypes.array,
  isActive: PropTypes.bool,
  date: PropTypes.object
};

DayTimeline.defaultProps = {
  isActive: false,
  date: null,
  yAxisLabel: null,
  events: []
};
