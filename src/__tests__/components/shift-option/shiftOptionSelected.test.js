import React from "react";
import { mount } from 'enzyme';
import ShiftOptionSelected from "../../../js/components/shift-option/ShiftOptionSelected.jsx";
import { SOSPropsMock } from "../../../__mocks__/components/SOSPropsMock"

describe('<ShiftOptionSelected/>', () => {

    test('Rendering of ShiftOptionSelected component', () => {
        const shiftOptionSelected = mount(<ShiftOptionSelected props={SOSPropsMock}/>);
        expect(shiftOptionSelected.length).toEqual(1);
    });

});

/*

  console.error
    Warning: Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.
        in ShiftOptionSelected (created by WrapperComponent)
        in WrapperComponent

*/