import React from "react";
import { mount } from 'enzyme';
import ButtonIcon from "../../../js/components/shipping-address/ButtonIcon";

describe('<ButtonIcon/>', () => {

    test('Rendering of ButtonIcon component', () => {
        const buttonIcon = mount(<ButtonIcon/>);
        expect(buttonIcon.length).toEqual(1);
    });

});