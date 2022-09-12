// import React from "react";
// import { mount } from "enzyme";
// import { TimeBlock } from "../../../js/components/calendar/TimeBlock.js";

// describe("<TimeBlock/>", () => {

//     test("Rendering of TimeBlock component", () => {
//         const timeBlock = mount(<TimeBlock start={{}} end={{}} />);
//         expect(timeBlock.length).toEqual(1)
//     });
// });

/*

TypeError: Cannot read properties of null (reading 'timeDirection')

      48 |
      49 | export const TimeBlock = ({ children, yAxis, events, occupancy, start, end, blockHeight }) => {
    > 50 |     const { timeDirection, timeBlockMinutes, blockPixelSize, showPreview, updateEvent, dragMode, toggleDragMode, blockLabel, onClick, timeBlockStyles, blockHoverIcon } = useContext(CalendarContext);
         |             ^
      51 |     const BlockHoverIcon = blockHoverIcon;
      52 |     const [hovered, setHovered] = useState(false);
      53 |     const [{ isOver }, drop] = useDrop({

*/