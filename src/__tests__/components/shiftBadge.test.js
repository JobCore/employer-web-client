import React from "react";
import { mount } from 'enzyme';
import ShiftBadge from "../../js/components/shift-badge/ShiftBadge.js";

describe('<ShiftBadge/>', () => {

    test('Rendering of ShiftBadge component', () => {
        const shiftBadge = mount(<ShiftBadge />);
        expect(shiftBadge.length).toEqual(1);
    });

});