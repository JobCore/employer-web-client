import React from "react";
import { mount } from "enzyme";
import EmployeeExtendedCard from "../../../js/components/applicant-card/EmployeeExtendedCard.jsx";
import { EECPropsMock } from "../../../__mocks__/components/EECPropsMock.js";

describe("<EmployeeExtendedCard/>", () => {
    
  test("Rendering of EmployeeExtendedCard component", () => {
    const employeeExtendedCard = mount(<EmployeeExtendedCard props={EECPropsMock} employee={EECPropsMock.employee}/>);
    expect(employeeExtendedCard.length).toEqual(1)
  });
});