import React from 'react';
import { render } from '@testing-library/react';
import { Talent, ShiftInvite, FilterTalents, TalentDetails, getTalentInitialFilters } from '../../js/views/talents';
import { Session } from "bc-react-session";
import { talentDataMock, talentDetailsPropsMock, talentFiltersPropsMock, shiftInviteDataMock, filterTalentsPropsMock } from "../../__mocks__/views/talentsPropsMock";

const onCancel = jest.fn()
const onSave = jest.fn()
const onChange = jest.fn()

describe("Testing functions of the 'Talents' view", () => {

    beforeEach(() => {
        Session.getPayload()
    })

    test("Testing 'getTalentInitialFilters' function", () => {
        expect(getTalentInitialFilters(talentFiltersPropsMock)).toHaveProperty("badges", [])
        expect(getTalentInitialFilters(talentFiltersPropsMock)).toHaveProperty("positions", [])
        expect(getTalentInitialFilters(talentFiltersPropsMock)).toHaveProperty("rating", undefined)
    })

    test("Testing 'Talent' function", () => {
        expect(Talent(talentDataMock).defaults()).toMatchObject(talentDataMock)
    })

    test("Testing 'ShiftInvite' function", () => {
        expect(ShiftInvite(shiftInviteDataMock).defaults()).toMatchObject(shiftInviteDataMock)
    })

    test("Testing 'FilterTalents' function", () => {
        render(
            <FilterTalents
                props={filterTalentsPropsMock}
                onCancel={onCancel}
                onSave={onSave}
                onChange={onChange}
                formData={filterTalentsPropsMock.formData}
                catalog={filterTalentsPropsMock.catalog}
            />)
        expect(FilterTalents).toHaveLength(1)
    })

    test("Testing 'TalentDetails' function", () => {
        render(
            <TalentDetails
                props={talentDetailsPropsMock}
                bar={{}}
                onCancel={onCancel}
                onSave={onSave}
                onChange={onChange}
                catalog={talentDetailsPropsMock.catalog}
            />)
        expect(TalentDetails).toHaveLength(1)
    })
})

/*
  console.error
    Warning: <getTalentInitialFilters /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.
        in getTalentInitialFilters

      at call (node_modules/react-dom/cjs/react-dom.development.js:506:32)
      at apply (node_modules/react-dom/cjs/react-dom.development.js:2628:27)
      at warning$1 (node_modules/react-dom/cjs/react-dom.development.js:7628:64)
      at createElement (node_modules/react-dom/cjs/react-dom.development.js:8744:20)
      at createInstance (node_modules/react-dom/cjs/react-dom.development.js:16900:28)
      at completeWork (node_modules/react-dom/cjs/react-dom.development.js:19142:26)
      at completeUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:19340:12)

  console.error
    Warning: The tag <getTalentInitialFilters> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.
        in getTalentInitialFilters

      at call (node_modules/react-dom/cjs/react-dom.development.js:506:32)
      at apply (node_modules/react-dom/cjs/react-dom.development.js:2628:27)
      at warning$1 (node_modules/react-dom/cjs/react-dom.development.js:7676:9)
      at createElement (node_modules/react-dom/cjs/react-dom.development.js:8744:20)
      at createInstance (node_modules/react-dom/cjs/react-dom.development.js:16900:28)
      at completeWork (node_modules/react-dom/cjs/react-dom.development.js:19142:26)
      at completeUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:19340:12)

  console.error
    Warning: validateDOMNesting(...): <div> cannot appear as a descendant of <p>.
        in div (created by Stars)
        in Stars (created by Context.Consumer)
        in p (created by Context.Consumer)
        in li (created by Context.Consumer)
        in TalentDetails

*/