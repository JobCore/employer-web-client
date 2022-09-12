
import React from 'react';
import '@testing-library/jest-dom';
import { userMock } from '../../__mocks__/views/userMock';
import { Session } from 'bc-react-session';
import { render } from '@testing-library/react';
import { render as EnzymeRender } from "enzyme";
import { hasTutorial, callback } from '../../js/utils/tutorial';
//import { employerDataMock } from "../../__mocks__/views/employerDataMock";

const data = {
    "action": "start",
    "controlled": false,
    "index": 0,
    "lifecycle": "init",
    "size": 0,
    "status": "waiting",
    "step": null,
    "type": "tour:status"
}

describe("Testing functions of the 'Tutorial' util", () => {

    beforeEach(() => {
        Session.start({
            payload: userMock
        });
    })

    afterEach(() => {
        Session.destroy();
    })

    test("Testing 'hasTutorial' function", () => {
        expect(hasTutorial()).toBeFalsy()
    })

})