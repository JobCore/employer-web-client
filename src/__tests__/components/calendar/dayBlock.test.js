// import React from "react";
// import { render as EnzymeRender } from "enzyme";
// import { render } from '@testing-library/react';
// import { mount } from "enzyme";
// import { DayBlock } from "../../../js/components/calendar/DayBlock.js";

// describe("<DayBlock/>", () => {

//     test("Rendering of DayBlock component", () => {
//         const dayBlock = mount(<DayBlock />);
//         expect(dayBlock.length).toEqual(1)
//     });
// });

/* 
    TypeError: Cannot read properties of null (reading 'dayDirection')
        5 |
        6 | export const DayBlock = ({ days, events, timesToShow, width, yAxisLabel }) => {
        >  7 |     const { dayDirection, viewMode, activeDate } = useContext(
            |             ^
        8 |         CalendarContext
        9 |     );
        10 |     return days.map((d, i) =>  (
 
*/