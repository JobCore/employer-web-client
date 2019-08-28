import React, { useContext } from "react";
import PropTypes from "prop-types";
import { CalendarContext } from "./Calendar";
import { useDrag } from "react-dnd";
import { log } from "./utils.js";
export const ItemTypes = {
  EVENT: "event",
  HORIZON_TOP: "event-horizon-top",
  HORIZON_BOTTOM: "event-horizon-bottom"
};

const eventBlockStyles = (props) => ({
    background: "blue",
    border: "1px solid black",
    position: "absolute",
    top: 0,
    left: 0,
    cursor: "pointer",
    zIndex: props.isPreview ? -1 : 10,
    marginLeft: `${props.index * 2}px`,
    marginTop: `${props.offset}px`,
    opacity: props.isDragging ? 0.4 : 0.95,
    width: props.direction === "horizontal" ? props.size : "90%",
    height: props.direction !== "horizontal" ? props.size : `${props.blockHeight}px`,
});
const EventBlock = React.forwardRef((props, ref) => <div onClick={e => props.onClick(e)} ref={ref} style={{...eventBlockStyles(props), ...props.style}}>{props.children}</div>);
EventBlock.propTypes = {
  children: PropTypes.node,
  direction: PropTypes.string,
  index: PropTypes.string,
  offset: PropTypes.number,
  isDragging: PropTypes.bool,
  style: PropTypes.object,
  onClick: PropTypes.func,
  siblingCount: PropTypes.number,
  blockHeight: PropTypes.number
};
EventBlock.defaultProps = {
  siblingCount: 0,
  offset: 0
};


const EventLabel = (props) => <label style={{
        float: "left",
        margin: "5px",
        fontSize: "12px",
        zIndex: 10
    }}>{props.children}</label>;
EventLabel.propTypes = {
  children: PropTypes.node
};

const Invisible = (props) => <div style={{
  position: "relative",
  width: "100%",
  height: "100%"
}}>{props.children}</div>;
Invisible.propTypes = {
  children: PropTypes.node
};

const horizonStyles = (props) => {
    let result = {
        position: "absolute",
        zIndex: 9,
        fontSize: "10px",
        fontWeight: 900,
        textAlign: "center",
        margin: "auto",
        width: ["top", "bottom"].includes(props.orientation) ? "100%" : "10px",
        height: !["top", "bottom"].includes(props.orientation) ? "auto" : "10px",
        transform: `rotate(${["top", "bottom"].includes(props.orientation) ? "0" : "90"}deg)`,
		cursor: ["top", "bottom"].includes(props.orientation) ? "ns-resize": "ew-resize",
        //background: "black",
        //opacity: 0.2,
    };
    result[props.orientation] = "0px";
    return result;
};
const Horizon = ({ className, orientation, eventStart, eventEnd, duration, index, data }) => {
    const { toggleDragMode } = useContext(CalendarContext);
    const [props, drag] = useDrag({
        item: {
            type: ["top", "left"].includes(orientation)
                ? ItemTypes.HORIZON_TOP
                    : ItemTypes.HORIZON_BOTTOM,
            orientation,
            index,
            start: eventStart,
            end: eventEnd,
            data,
            duration
        },
        begin: monitor => toggleDragMode(true)
    });
    return (
        <div ref={drag} style={horizonStyles({orientation})} className={className}>
            <i>{"="}</i>
        </div>
    );
};
Horizon.propTypes = {
  children: PropTypes.node,
  orientation: PropTypes.string,
  className: PropTypes.string,
  eventStart: PropTypes.object,
  eventEnd: PropTypes.object,
  duration: PropTypes.number,
  index: PropTypes.string,
  data: PropTypes.object
};

export const Event = ({ label, start, end, duration, index, isPreview, offset, data }) => {
    const { timeDirection, blockPixelSize, timeBlockMinutes, toggleDragMode, eventBoxStyles, blockHeight, onClick } = useContext(CalendarContext);
    const [{ isDragging }, drag ] = useDrag({
        item: { type: ItemTypes.EVENT, index, duration, start, end, data },
        collect: monitor => {
            return ({
                isDragging: !!monitor.isDragging()
            });
        },
        begin: monitor => log("Begin dragging") || toggleDragMode(true)
    });

    return (
        <EventBlock
            ref={drag}
            isDragging={isDragging}
            isPreview={isPreview}
            offset={offset}
            onClick={(e) => {
                e.stopPropagation();
                onClick({ start, end, duration, index, data });
            }}
            style={eventBoxStyles}
            direction={timeDirection}
            blockHeight={blockHeight}
            index={index}
            size={`${Math.floor((duration / timeBlockMinutes) * blockPixelSize)}px`}
        >
            { !isPreview &&
                <Invisible>
                    <Horizon
                        index={index}
                        orientation={timeDirection === "vertical" ? "top" : "left"}
                        eventStart={start}
                        data={data}
                        duration={duration}
                        eventEnd={end}
                    />
                    <EventLabel>{label}</EventLabel>
                    <Horizon
                        index={index}
                        orientation={timeDirection === "vertical" ? "bottom" : "right"}
                        eventStart={start}
                        data={data}
                        duration={duration}
                        eventEnd={end}
                    />
                </Invisible>
            }
        </EventBlock>
    );
};

Event.propTypes = {
    index: PropTypes.string.isRequired,
    label: PropTypes.string,
    start: PropTypes.object,
    end: PropTypes.object,
    duration: PropTypes.number,
    isPreview: PropTypes.bool,
    offset: PropTypes.number,
    data: PropTypes.object
};

Event.defaultProps = {
  label: "",
  index: "0",
  data: null
};
