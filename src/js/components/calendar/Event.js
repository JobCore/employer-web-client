import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { CalendarContext } from "./Calendar";
import { useDrag } from "react-dnd";
import { log } from "./utils.js";
export const ItemTypes = {
  EVENT: "event",
  HORIZON_TOP: "event-horizon-top",
  HORIZON_BOTTOM: "event-horizon-bottom",
};

const eventBlockStyles = (props) => {
  return {
    backgroundColor: props.isHover
      ? "rgb(112, 148, 152)"
      : "rgb(195, 240, 245)",
    // border: "1px solid black",
    position: "absolute",
    top: 0,
    left: 0,
    borderRadius: "5%",
    cursor: "pointer",
    zIndex: props.isPreview ? -1 : props.isHover ? 11 : 10,
    marginLeft: `${props.index * 2}px`,
    marginTop: `${props.offset}px`,
    overflow: props.isHover && !props.isDragging ? "initial" : "hidden",
    opacity: props.isDragging ? 0.4 : 0.95,
    width:
      props.timeBlockMinutes === 1439
        ? "100%"
        : props.direction === "horizontal"
        ? props.size
        : "90%",
    height:
      props.direction !== "horizontal" ? props.size : `${props.blockHeight}px`,
  };
};

const EventBlock = React.forwardRef((props, ref) => (
  <div
    className="event-block"
    onClick={(e) => props.onClick(e)}
    ref={ref}
    style={{ ...eventBlockStyles(props), ...props.style }}
    onMouseEnter={() => (props.onMouseEnter ? props.onMouseEnter(true) : null)}
    onMouseLeave={() => (props.onMouseLeave ? props.onMouseLeave(false) : null)}
  >
    {props.children}
  </div>
));
EventBlock.propTypes = {
  children: PropTypes.node,
  index: PropTypes.string,
  offset: PropTypes.number,
  isDragging: PropTypes.bool,
  isHover: PropTypes.bool,
  style: PropTypes.object,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  siblingCount: PropTypes.number,
  direction: PropTypes.string,
  blockHeight: PropTypes.number,
};
EventBlock.defaultProps = {
  siblingCount: 0,
  offset: 0,
};

const EventLabel = (props) => (
  <label
    style={{
      fontSize: "14px",
      width: "max-content",
      position: "absolute",
      left: 0,
      top: 0,
      cursor: "pointer",
      padding: "2px 5px",
      background: props.isHover ? "rgb(112, 148, 152)" : "rgb(195, 240, 245)",
      height:
        props.direction !== "horizontal"
          ? props.size
          : `${props.blockHeight}px`,
      zIndex: 10,
    }}
  >
    {props.children}
  </label>
);
EventLabel.propTypes = {
  children: PropTypes.node,
  direction: PropTypes.string,
  isHover: PropTypes.bool,
  blockHeight: PropTypes.number,
  size: PropTypes.string,
};

const Invisible = (props) => (
  <div
    style={{
      position: "relative",
      width: "100%",
      height: "100%",
    }}
  >
    {props.children}
  </div>
);
Invisible.propTypes = {
  children: PropTypes.node,
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
    height: !["top", "bottom"].includes(props.orientation)
      ? props.blockHeight
      : "10px",
    transform: `rotate(${
      ["top", "bottom"].includes(props.orientation) ? "0" : "90"
    }deg)`,
    cursor: ["top", "bottom"].includes(props.orientation)
      ? "ns-resize"
      : "ew-resize",
    //background: "black",
    //opacity: 0.2,
  };
  const deltas = {
    right: "5px",
    left: "-10px",
    bottom: "5px",
    top: "-10px",
  };
  result[props.orientation] = deltas[props.orientation];
  return result;
};
const Horizon = ({
  className,
  orientation,
  eventStart,
  eventEnd,
  duration,
  index,
  data,
}) => {
  const { toggleDragMode, blockHeight } = useContext(CalendarContext);
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
      duration,
    },
    begin: (monitor) => toggleDragMode(true),
  });
  return (
    <div
      ref={drag}
      style={horizonStyles({ orientation, blockHeight })}
      className={className}
    >
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
  data: PropTypes.object,
};

export const Event = ({
  label,
  start,
  end,
  duration,
  index,
  isPreview,
  offset,
  data,
  allowResizeStart,
  allowResizeEnd,
}) => {
  const {
    timeDirection,
    blockPixelSize,
    timeBlockMinutes,
    toggleDragMode,
    eventBoxStyles,
    blockHeight,
    onClick,
    allowResize,
  } = useContext(CalendarContext);
  const [hovered, setHovered] = useState(false);
  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.EVENT, index, duration, start, end, data },
    collect: (monitor) => {
      return {
        isDragging: !!monitor.isDragging(),
      };
    },
    begin: (monitor) => log("Begin dragging") || toggleDragMode(true),
  });
  return (
    <EventBlock
      ref={drag}
      isDragging={isDragging}
      isHover={hovered}
      isPreview={isPreview}
      offset={offset}
      onClick={(e) => {
        e.stopPropagation();
        onClick({ start, end, duration, index, data });
      }}
      style={eventBoxStyles}
      direction={timeDirection}
      blockHeight={blockHeight}
      size={`${Math.floor((duration / timeBlockMinutes) * blockPixelSize)}px`}
      index={index}
      timeBlockMinutes={timeBlockMinutes}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {!isPreview && (
        <Invisible>
          {allowResize && allowResizeStart && (
            <Horizon
              index={index}
              orientation={timeDirection === "vertical" ? "top" : "left"}
              eventStart={start}
              data={data}
              duration={duration}
              eventEnd={end}
            />
          )}
          <EventLabel
            direction={timeDirection}
            isHover={hovered}
            blockHeight={blockHeight}
            size={`${Math.floor(
              (duration / timeBlockMinutes) * blockPixelSize
            )}px`}
          >
            {label}
          </EventLabel>
          {allowResize && allowResizeEnd && (
            <Horizon
              index={index}
              orientation={timeDirection === "vertical" ? "bottom" : "right"}
              eventStart={start}
              data={data}
              duration={duration}
              eventEnd={end}
            />
          )}
        </Invisible>
      )}
    </EventBlock>
  );
};

Event.propTypes = {
  index: PropTypes.string.isRequired,
  start: PropTypes.object,
  end: PropTypes.object,
  duration: PropTypes.number,
  isPreview: PropTypes.bool,
  offset: PropTypes.number,
  data: PropTypes.object,

  label: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),

  allowResizeStart: PropTypes.bool,
  allowResizeEnd: PropTypes.bool,
};

Event.defaultProps = {
  label: null,
  index: "0",
  data: null,
  allowResizeStart: true,
  allowResizeEnd: true,
};
