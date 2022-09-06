// /* eslint-disable no-undef */
// import React from "react";
// import { mount } from "enzyme";
// import ApplicantCard from "../../../js/components/applicant-card/ApplicantCard.jsx";
// import { applicantCardMock } from "../../../__mocks__/applicantCardMock.js";

// const onAccept = jest.fn();
// const onReject = jest.fn();

// describe("<ApplicantCard/>", () => {

//     test("Rendering of ApplicantCard component", () => {
//         const employeeExtendedCard = mount(
//             <ApplicantCard
//                 props={applicantCardMock}
//                 applicant={applicantCardMock.applicant}
//                 onAccept={onAccept}
//                 onReject={onReject}
//                 shift={applicantCardMock.shift}
//                 bar={{}}
//             />);
//         expect(employeeExtendedCard.length).toEqual(1);
//     });
// });