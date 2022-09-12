import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { employerDataMock } from "../../__mocks__/views/employerDataMock";
import { Employer, InviteUserToCompanyJobcore } from "../../js/views/profile";
import { IUTCJCformData, IUTCJCcatalog } from "../../__mocks__/views/IUTCJCPropsMock";
import { userMock } from '../../__mocks__/views/userMock';
import { Session } from 'bc-react-session';

const onSave = jest.fn()
const onCancel = jest.fn()
const onChange = jest.fn()

describe("Testing functions of the 'Profile' view", () => {

    beforeEach(() => {
        Session.start({
            payload: userMock
        });
    })

    afterEach(() => {
        Session.destroy();
    })


    test("Testing 'Employer' function", () => {
        expect(Employer(employerDataMock).defaults()).toMatchObject(employerDataMock)
    })

    test("Testing 'InviteUserToCompanyJobcore New User' function", () => {
        render(
            <InviteUserToCompanyJobcore
                onSave={onSave}
                onCancel={onCancel}
                onChange={onChange}
                catalog={IUTCJCcatalog}
                formData={IUTCJCformData}
            />
        )
        expect(InviteUserToCompanyJobcore).toHaveLength(1)
    })
})
