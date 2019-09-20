import React, { useContext } from "react";
import PropTypes from "prop-types";
import { CalendarContext } from "./Calendar";
import { useDrop } from "react-dnd";
import moment from "moment";
import { ItemTypes } from "./Event";

const blockStyles = (props) => ({
    boxSizing: "border-box",
    fontSize: "10px",
    display: "inline-block",
    position: "relative",
    margin: 0,
    background: props.isOver ? "pink" : props.style.background || "none",
    minWidth: props.timeDirection === "horizontal" ? props.size : "inherit",
    width: props.timeBlockMinutes === 1439 ? "100%" : props.timeDirection === "horizontal" ? props.size : props.style.background || "inherit",
    height: props.timeDirection !== "horizontal" ? props.size : `${props.blockHeight}px`
});
const Block = React.forwardRef((props, ref) => <div className="time-block" ref={ref} onClick={(e) => props.onClick(e)} style={{...blockStyles(props), ...props.style}}>{props.children}</div>);

const calculateNewEvent = (blockTime, minutesDelta, item, { EVENT, HORIZON_TOP, HORIZON_BOTTOM }) => {

    let start = (item.type === EVENT) ? moment(blockTime.start) : moment(item.start);
    let end = (item.type === EVENT) ? moment(blockTime.end) : moment(item.end);

    if(HORIZON_TOP === item.type) start.set({ h: moment(item.start).add(minutesDelta, "minutes").hour(), m: moment(item.start).add(minutesDelta, "minutes").minutes() });
    else if(HORIZON_BOTTOM === item.type) end.set({ h: moment(item.end).add(minutesDelta, "minutes").hour(), m: moment(item.end).add(minutesDelta, "minutes").minutes() });
    else{
        start.set({ h: moment(item.start).add(minutesDelta, "minutes").hour(), m: moment(item.start).add(minutesDelta, "minutes").minutes() });
        end.set({ h: moment(item.end).add(minutesDelta, "minutes").hour(), m: moment(item.end).add(minutesDelta, "minutes").minutes() });
    }

    return {
        start, end,
        duration: moment.duration(end.diff(start)).asMinutes()
    };
};

export const TimeBlock = ({ children, yAxis, events, occupancy, start, end, blockHeight }) => {
    const { timeDirection, timeBlockMinutes, blockPixelSize, showPreview, updateEvent, dragMode, toggleDragMode, blockLabel, onClick, timeBlockStyles } = useContext(CalendarContext);
    const [{ isOver }, drop] = useDrop({
        accept: [ ItemTypes.EVENT, ItemTypes.HORIZON_TOP, ItemTypes.HORIZON_BOTTOM ],
        drop: (item, monitor) => {
            let coord = monitor.getDifferenceFromInitialOffset();
            const minutesDelta = timeDirection === "horizontal" ? Math.round(coord.x / blockPixelSize) * timeBlockMinutes : Math.round(coord.y / blockPixelSize) * timeBlockMinutes;
            const newEvent = calculateNewEvent({ start, end }, minutesDelta, item, ItemTypes);
            const blockLevel = occupancy.length;
            let updatedEvent = { index: item.index, start: newEvent.start, end: newEvent.end, duration: newEvent.duration, data: item.data, blockLevel };

            if(showPreview) toggleDragMode(false);
            updateEvent(updatedEvent);
        },
        collect: monitor => ({
            isOver: !!monitor.isOver()
        })
    });

    return (
        <Block
            ref={drop}
            timeDirection={timeDirection}
            isOver={isOver}
            style={timeBlockStyles}
            timeBlockMinutes={timeBlockMinutes}
            dragMode={dragMode}
            onClick={e => onClick({ start, end, events, occupancy, yAxis })}
            size={`${blockPixelSize}px`}
            blockHeight={blockHeight}
            ocupied={occupancy.length}
        >
            {blockLabel && blockLabel(start, end, events, occupancy)}
            {children}
        </Block>
    );
};
TimeBlock.propTypes = {
  events: PropTypes.array,
  occupancy: PropTypes.array,
  children: PropTypes.node,
  label: PropTypes.string,
  yAxis: PropTypes.string,
  blockHeight: PropTypes.number,
  end: PropTypes.object.isRequired,
  start: PropTypes.object.isRequired,
};

TimeBlock.defaultProps = {
  events: null,
  yAxis: null,
  occupancy: []
};
