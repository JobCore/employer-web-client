
import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { render as EnzymeRender } from "enzyme";
import { Subscription, YourSubscription } from "../../js/views/subscriptions";
import { subscriptionDataMock, YSPropsMock } from "../../__mocks__/views/subscriptionPropsMock";
import { Session } from 'bc-react-session';
import { userMock } from '../../__mocks__/views/userMock';

const onSave = jest.fn()
const onCancel = jest.fn()
const onChange = jest.fn()


describe("Testing functions of the 'Subscriptions' view", () => {

    test("Testing 'Subscription' function", () => {
        expect(Subscription(subscriptionDataMock).defaults()).toMatchObject(subscriptionDataMock)
    })

    beforeEach(() => {
        Session.start({
            payload: userMock
        });
    })

    afterEach(() => {
        Session.destroy();
    })

    test("Testing 'YourSubscription' function", () => {
        EnzymeRender(
            <YourSubscription
                onSave={onSave}
                onCancel={onCancel}
                onChange={onChange}
                props={YSPropsMock}
            />
        )
        expect(YourSubscription).toHaveLength(1)
    })
})
