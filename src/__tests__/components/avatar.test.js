import React from "react";
import { mount } from 'enzyme';
import Avatar from "../../js/components/avatar/Avatar.jsx";

describe('<Avatar/>', () => {

    test('Rendering of Avatar component', () => {
        const avatar = mount(<Avatar />);
        expect(avatar.length).toEqual(1);
    }); 

});
