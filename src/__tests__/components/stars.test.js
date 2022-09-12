import React from "react";
import { mount } from 'enzyme';
import Stars from "../../js/components/stars/Stars.jsx";

describe('<Stars/>', () => {

    test('Rendering of Stars component', () => {
        const stars = mount(<Stars rating={5}/>);
        expect(stars.length).toEqual(1);
    });

});