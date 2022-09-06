import React from 'react';
import { render } from "enzyme";
import { CheckEmployeeDocuments } from "../../js/views/check-documents";
import { checkDocsPropsMock } from "../../__mocks__/views/checkDocsPropsMock";

const onCancel = jest.fn()
const onSave = jest.fn()
const onChange = jest.fn()

describe("Testing functions of the 'Check-Documents' view", () => {
    
    test("Testing 'CheckEmployeeDocuments' function", () => {
        render(
            <CheckEmployeeDocuments
                props={checkDocsPropsMock}
                onCancel={onCancel}
                onSave={onSave}
                onChange={onChange}
                formData={checkDocsPropsMock.formData}
                catalog={checkDocsPropsMock.catalog}
                history={{}}
                match={{}}
            />
        )
    })
    expect(CheckEmployeeDocuments).toHaveLength(1)
})