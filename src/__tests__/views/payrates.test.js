import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { render as EnzymeRender } from 'enzyme';
import { Payrate } from "../../js/views/payrates"
import { userMock } from '../../__mocks__/views/userMock';
import { Session } from 'bc-react-session';

describe("Testing the 'Payrates' view", () => {
    beforeEach(() => {
        Session.start({
            payload: userMock
        });
    })

    afterEach(() => {
        Session.destroy();
    })
    test("Testing 'Payrate' function", () => {
        expect(Payrate({})).toHaveProperty("defaults")
        expect(Payrate({})).toHaveProperty("validate")
    });
})