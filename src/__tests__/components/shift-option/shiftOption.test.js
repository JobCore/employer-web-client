import React from "react";
import { mount } from 'enzyme';
import ShiftOption from "../../../js/components/shift-option/ShiftOption.jsx";
import { shiftOptionDataMock } from "../../../__mocks__/components/shiftOptionDataMock";

describe('<ShiftOption/>', () => {

    test('Rendering of ShiftOption component', () => {
        const shiftOption = mount(
            <ShiftOption
                data={shiftOptionDataMock}
                innerProps={{}} />
        );
        expect(shiftOption.length).toEqual(1);
    });

});