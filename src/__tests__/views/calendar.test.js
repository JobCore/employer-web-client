import React from 'react';
import { render } from '@testing-library/react';
import { render as EnzymeRender } from 'enzyme';
import { ShiftCalendar } from '../../js/views/calendar';
import { calendarPropsMock } from "../../__mocks__/views/calendarPropsMock";

describe("Testing functions of the 'Favorites' view", () => {

    test("Testing 'ShiftCalendar' function", () => {
        EnzymeRender(
            <ShiftCalendar catalog={calendarPropsMock}
            />
        )
        expect(ShiftCalendar).toHaveLength(1)
    })
})
