import React from "react";
import { mount } from 'enzyme';
import Button from "../../js/components/button/Button.jsx";

describe('<Button/>', () => {

    test('Rendering of Button component', () => {
        const button = mount(<Button onClick={() => this.submithandler()} />);
        expect(button.length).toEqual(1);
    });

});