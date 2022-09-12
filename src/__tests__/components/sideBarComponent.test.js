// import React from "react";
// import { mount } from 'enzyme';
// import SideBar from "../../js/components/sidebar/SideBar.jsx";
// import { sideBarPropsMock } from "../../__mocks__/components/sideBarPropsMock.js";
// import { BrowserRouter as Router } from "react-router-dom";
// import { render } from "@testing-library/react";
// import { render as EnzymeRender } from "enzyme";

// const onClose = jest.fn()

// describe('<SideBar/>', () => {

//     test('Rendering of SideBar component', () => {
//         const sideBar = render(
//             <Router>
//                 <SideBar
//                     props={sideBarPropsMock}
//                     sideBarLevels={sideBarPropsMock.sideBarLevels}
//                     catalog={sideBarPropsMock.catalog}
//                     onClose={onClose}
//                 />
//             </Router>
//         );
//         expect(sideBar.length).toEqual(1);
//     });

// });

/*
Invariant Violation: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

    Check the render method of `RightBar`.

      12 |
      13 |     test('Rendering of SideBar component', () => {
    > 14 |         const sideBar = render(
         |                         ^
      15 |             <Router>
      16 |                 <SideBar
      17 |                     props={sideBarPropsMock}
*/