import React from 'react';
import { Location, AddOrEditLocation, getTalentInitialFilters } from '../../js/views/locations';
import { AELCatalogMock, AELFormDataMock } from '../../__mocks__/views/AELPropsMock';
import { userMock } from '../../__mocks__/views/userMock';
import { render } from '@testing-library/react';
import { Session } from 'bc-react-session';
import { BrowserRouter as Router } from "react-router-dom";
import { googleMock } from "../../__mocks__/views/googleMock";

const data = {
    id: "",
    title: "2100 NW 42nd Ave",
    street_address: "2100 NW 42nd Ave, Miami, FL, USA",
    country: "United States",
    latitude: 25.794791,
    longitude: -80.279128,
    state: "Florida",
    zip_code: "33126",
}

const onCancel = jest.fn()
const onSave = jest.fn()
const onChange = jest.fn()

describe("Testing the 'Locations' view", () => {
    
    test("Testing 'Location' function", () => {
        expect(Location(data).defaults()).toMatchObject(data)
    })

    test("Testing 'getTalentInitialFilters' function", () => {
        expect(getTalentInitialFilters(AELCatalogMock)).toHaveProperty("badges", [])
        expect(getTalentInitialFilters(AELCatalogMock)).toHaveProperty("positions", [])
        expect(getTalentInitialFilters(AELCatalogMock)).toHaveProperty("rating", undefined)
    })

    describe('Tests that require a Session', () => {
        beforeEach(() => {
            Session.start({
                payload: userMock
            });
            googleMock()
        })

        afterEach(() => {
            Session.destroy();
        })

        test("Testing 'AddOrEditLocation' function", () => {
            const wrapper = render(
                <Router>
                    <AddOrEditLocation
                        bar={{}}
                        onCancel={onCancel}
                        onSave={onSave}
                        onChange={onChange}
                        catalog={AELCatalogMock}
                        formData={AELFormDataMock}
                    />
                </Router>
            )
            const element = wrapper.getByText("Location nickname")
            expect(element.textContent).toBe("Location nickname")
        })
    })
})
