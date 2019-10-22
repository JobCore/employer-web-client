import React, { useContext } from "react";
import { DayTimeline } from "./DayTimeline";
import moment from "moment";
import { CalendarContext } from "./Calendar";

export const DayBlock = ({ days, events, timesToShow, width, yAxisLabel }) => {
    const { dayDirection, viewMode, activeDate } = useContext(
        CalendarContext
    );
    return days.map((d, i) =>  (
        <DayTimeline
            key={i}
            date={d}
            yAxisLabel={yAxisLabel}
            timesToShow={timesToShow}
            width={width}
            isActive={d.diff(activeDate.startOf("day")) === 0}
            events={events.filter(e => e.start.isBetween(d, moment(d).add(1, "day")) || e.start.isSame(d) || e.end.isBetween(d, moment(d).add(1, "day")))}
        />
    ));
};