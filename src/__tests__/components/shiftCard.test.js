import React from "react";
import { mount } from 'enzyme';
import ShiftCard from "../../js/components/shift-card/ShiftCard.jsx";
import { shiftCardDataMock } from "../../__mocks__/components/shiftCardDataMock.js";

describe('<ShiftCard/>', () => {

    test('Rendering of ShiftCard component', () => {
        const shiftCard = mount(<ShiftCard shift={shiftCardDataMock}/>);
        expect(shiftCard.length).toEqual(1);
    });

});