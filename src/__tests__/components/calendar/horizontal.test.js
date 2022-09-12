// import React from "react";
// import { mount } from "enzyme";
// import { HorizontalDay } from "../../../js/components/calendar/HorizontalDay.js";

// describe("<HorizontalDay/>", () => {

//     test("Rendering of HorizontalDay component", () => {
//         const horizontalDay = mount(<HorizontalDay />);
//         expect(horizontalDay.length).toEqual(1)
//     });
// });

/*

   TypeError: Cannot read properties of null (reading 'yAxisWidth')

      45 |   showRow,
      46 | }) => {
    > 47 |   const { yAxisWidth } = useContext(CalendarContext);
         |           ^
      48 |   return yAxis.map((row, i) => (
      49 |     <Day key={i}>
      50 |       {yAxisWidth > 0 && (

*/