// import React from "react";
// import { mount } from "enzyme";
// import { DayTimeline } from "../../../js/components/calendar/DayTimeline.js";

// describe("<DayTimeline/>", () => {

//     test("Rendering of DayTimeline component", () => {
//         const dayTimeline = mount(<DayTimeline />);
//         expect(dayTimeline.length).toEqual(1)
//     });
// });

/* 
    TypeError: Cannot read properties of null (reading 'timeDirection')

        35 |         );
        36 | export const DayTimeline = ({ events, date, isActive, width, timesToShow, yAxisLabel }) => {
        > 37 |     const { timeDirection, dayLabel, blockHeight, eventOffset, dayBlockStyles } = useContext(CalendarContext);
            |             ^
        38 |     events.forEach(e => {
        39 |         if(!e.blockLevel){
        40 |             e.blockLevel = 0;

*/