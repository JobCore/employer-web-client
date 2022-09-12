
import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { render as EnzymeRender } from 'enzyme';
import { filterShiftsPropsMock, shiftInvitesPropsMock, shiftDataMock, shiftApplicantPropsMock, shiftDetailsPropsMock, shiftEmployeesPropsMock } from "../../__mocks__/views/shiftPropsMock"
import { Shift, getShiftInitialFilters, RateShift, FilterShifts, ShiftTalentClockins, ShiftApplicants, ShiftInvites, ShiftDetails, ShiftEmployees } from '../../js/views/shifts';

const onCancel = jest.fn()
const onSave = jest.fn()
const onChange = jest.fn()

describe("Testing functions of the 'Shift' view", () => {

  test("Testing 'getShiftInitialFilters' function", () => {
    const emptyObj = {}
    expect(getShiftInitialFilters()).toEqual(emptyObj)
  })

  test("Testing 'Shift' function", () => {
    expect(Shift(shiftDataMock).defaults()).toMatchObject(shiftDataMock);
  })

  test("Testing 'ShiftEmployees' function", () => {
    render(
      <ShiftEmployees catalog={shiftEmployeesPropsMock.catalog} onCancel={onCancel} onSave={onSave} />
    )
    expect(ShiftEmployees).toHaveLength(1)
  })

  test("Testing 'ShiftDetails' function", () => {
    render(
      <ShiftDetails
        bar={{}}
        props={shiftDetailsPropsMock}
        onCancel={onCancel}
        onSave={onSave}
        onChange={onChange}
        formData={shiftDetailsPropsMock.formData}
        catalog={shiftDetailsPropsMock.catalog} />
    )
    expect(ShiftDetails).toHaveLength(1)
  });

  test("Testing 'ShiftInvites' function", () => {
    render(
      <ShiftInvites
        bar={{}}
        onCancel={onCancel}
        onSave={onSave}
        formData={shiftInvitesPropsMock}
      />
    )
    expect(ShiftInvites).toHaveLength(1)
  });

  test("Testing 'RateShift' function", () => {
    const wrapper = render(
      <RateShift />
    )
    const element = wrapper.getByText("Venue name")
    expect(element.tagName).toBe("H4")
  })

  test("Testing 'ShiftApplicants' function", () => {
    const wrapper = render(
      <ShiftApplicants
        bar={{}}
        props={shiftApplicantPropsMock}
        catalog={shiftApplicantPropsMock.catalog}
        onSave={onSave}
        onCancel={onCancel}
      />
    )
    const element = wrapper.getByText(/No applicants were found for this shift,/)
    expect(element.tagName).toBe("LI")
  })

  test("Testing 'FilterShifts' function", () => {
    EnzymeRender(
      <FilterShifts
        onCancel={onCancel}
        onSave={onSave}
        onChange={onChange}
        catalog={filterShiftsPropsMock} />
    )
    expect(FilterShifts).toHaveLength(1)
  });
})
