import React from "react";
import { mount } from 'enzyme';
import Wizard from "../../js/components/wizard/Wizard.jsx";

describe('<Wizard/>', () => {

    test('Rendering of Wizard component', () => {
        const wizard = mount(<Wizard onClick={() => this.submithandler()}/>);
        expect(wizard.length).toEqual(1);
    });

});