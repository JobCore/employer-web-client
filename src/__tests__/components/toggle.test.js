import React from "react";
import { mount } from 'enzyme';
import Toggle from "../../js/components/toggle/Toggle.jsx";

describe('<Toggle/>', () => {

    test('Rendering of Toggle component', () => {
        const toggle = mount(<Toggle onClick={() => this.submithandler()}/>);
        expect(toggle.length).toEqual(1);
    });

});