// import React from "react";
// import { mount } from 'enzyme';
// import RightSideBar from "../../js/components/right-sidebar/RightSideBar.js";

// describe('<RightSideBar/>', () => {

//     test('Rendering of RightSideBar component', () => {
//         const rightSideBar = mount(<RightSideBar />);
//         expect(rightSideBar.length).toEqual(1);
//     });

// });

/*

   Warning: React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
    
    Check the render method of `RightSideBar`.
        in RightSideBar (created by WrapperComponent)
        in WrapperComponent

      17 |
      18 |     return <div>
    > 19 |         <ButtonBar onClick={(option) => {
         |         ^
      20 |             this.state.bar.show(option)
      21 |             }} />
      22 |         


    Warning: Failed prop type: The prop `catalog` is marked as required in `SideBar`, but its value is `undefined`.
        in SideBar (created by RightSideBar)
        in RightSideBar (created by WrapperComponent)
        in WrapperComponent

      22 |         
      23 |         <div>{children}</div>;
    > 24 |         {!hidden && <SideBar
         |                     ^
      25 |             sideBarLevels={sideBarLevels}
      26 |             catalog={catalog}
      27 |             onClose={() => closeRightBar()}

      Invariant Violation: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

    Check the render method of `RightSideBar`.

       6 |
       7 |     test('Rendering of RightSideBar component', () => {
    >  8 |         const rightSideBar = mount(<RightSideBar />);
         |                              ^
       9 |         expect(rightSideBar.length).toEqual(1);
      10 |     });
      11 |

*/