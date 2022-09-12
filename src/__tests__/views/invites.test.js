import React from 'react';
import { render } from '@testing-library/react';
import { render as EnzymeRender } from 'enzyme';
import { Invite, PendingJobcoreInvites, PendingInvites, SearchShiftToInviteTalent, InviteTalentToJobcore, SearchTalentToInviteToShift } from '../../js/views/invites';
import { NOW } from '../../js/components/utils';
import { SSTITPropsMock, STTITSPropsMock, PIcatalogMock, PIformDataMock, ITTJBFormDataMock, ITTJBCatalogMock, shiftOptionDataMock, invitesCatalog } from "../../__mocks__/views/invitesPropsMock";
import ShiftOption from '../../js/components/shift-option/ShiftOption';

const data = {
  first_name: "John",
  last_name: "Doe",
  status: "PENDING",
  created_at: NOW(),
  email: "johndoe@gmail.com",
  include_sms: undefined,
  phone_number: "954-000-0000",
}

const onCancel = jest.fn()
const onSave = jest.fn()
const onChange = jest.fn()

describe("Testing functions of the 'Invites' view", () => {

  test("Testing 'Invite' function", () => {
    expect(Invite(data).defaults()).toMatchObject(data);
  })

  test("Testing 'PendingJobcoreInvites' function", () => {
    const component = render(<PendingJobcoreInvites catalog={invitesCatalog} />);
    const element = component.getByText("No pending invites")
    expect(element.tagName).toBe("P")
  })

  test("Testing 'ShiftOption' function", () => {
    render(
      <ShiftOption
        data={shiftOptionDataMock}
        innerProps={{}}
      />
    )
    expect(ShiftOption).toHaveLength(1)
  })

  test("Testing 'SearchTalentToInviteToShift' function", () => {
    render(
      <SearchTalentToInviteToShift
        bar={{}}
        onCancel={onCancel}
        onSave={onSave}
        onChange={onChange}
        formData={STTITSPropsMock}
      />
    )
    expect(SearchTalentToInviteToShift).toHaveLength(1)
  })

  test("Testing 'InviteTalentToJobcore' function", () => {
    render(
      <InviteTalentToJobcore
        bar={{}}
        onCancel={onCancel}
        onSave={onSave}
        onChange={onChange}
        formData={ITTJBFormDataMock}
        catalog={ITTJBCatalogMock}
      />
    )
    expect(InviteTalentToJobcore).toHaveLength(1)
  })
  
  test("Testing 'PendingInvites' function", () => {
    render(
      <PendingInvites
        catalog={PIcatalogMock}
        formData={PIformDataMock}
      />
    )
    expect(PendingInvites).toHaveLength(1)
  })

  test("Testing 'SearchShiftToInviteTalent' function", () => {
      EnzymeRender(
        <SearchShiftToInviteTalent
          props={SSTITPropsMock.props}
          onCancel={onCancel}
          onSave={onSave}
          onChange={onChange}
          formData={SSTITPropsMock.formData}
          catalog={SSTITPropsMock.catalog}>
        </SearchShiftToInviteTalent>
      )
      expect(SearchShiftToInviteTalent).toHaveLength(1)
    })
})
