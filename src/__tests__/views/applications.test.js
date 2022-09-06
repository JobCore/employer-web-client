import React from "react";
import { mount } from 'enzyme';
import { getApplicationsInitialFilters, Application, ApplicantExtendedCard, ApplicationDetails, FilterApplications } from "../../js/views/applications";

const onCancel = jest.fn()
const onSave = jest.fn()
const onChange = jest.fn()
const onAccept = jest.fn()
const onReject = jest.fn()

describe("Testing the 'Applicatons' view", () => {
    test("Testing 'getApplicationsInitialFilters' function", () => {
        expect(getApplicationsInitialFilters()).toHaveProperty("positions", [])
        expect(getApplicationsInitialFilters()).toHaveProperty("venues", [])

    })

    test("Testing 'Application' function", () => {
        expect(Application({}).defaults()).toMatchObject({})

    })

    // These test require a mock store
    // test("Testing 'FilterApplications' function", () => {
    //     const wrapper = render(
    //         <Router>
    //             <FilterApplications
    //                 bar={{}}
    //                 onCancel={onCancel}
    //                 onSave={onSave}
    //                 onChange={onChange}
    //                 catalog={catalogMock}
    //                 formData={formDataMock}
    //             />
    //         </Router>
    //     )
    //     const element = wrapper.getByText("Location nickname")
    //     expect(element.textContent).toBe("Location nickname")
    //     expect(FilterApplications).toHaveLength(1)
    // })

    // test("Testing 'ApplicationDetails' function", () => {
    //     const wrapper = render(
    //         <Router>
    //             <ApplicationDetails
    //                 bar={{}}
    //                 onSave={onSave}
    //                 catalog={catalogMock}
    //             />
    //         </Router>
    //     )
    //     const element = wrapper.getByText("Location nickname")
    //     expect(element.textContent).toBe("Location nickname")
    //     expect(ApplicationDetails).toHaveLength(1)
    // })

    // test("Testing 'ApplicantExtendedCard' function", () => {
    //     const wrapper = render(
    //         <Router>
    //             <ApplicantExtendedCard
    //                 bar={{}}
    //                 onReject={onReject}
    //                 onAccept={onAccept}
    //                 props={props}
    //                 shift={shiftMock}
    //                 applicant={applicantMock}
    //             />
    //         </Router>
    //     )
    //     const element = wrapper.getByText("Location nickname")
    //     expect(element.textContent).toBe("Location nickname")
    //     expect(ApplicantExtendedCard).toHaveLength(1)
    // })    
})
