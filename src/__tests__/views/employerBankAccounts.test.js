
import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { render as EnzymeRender } from "enzyme";
import EmployerBankAccounts from "../../js/views/employerBankAccounts";

describe("Testing functions of the 'Profile' view", () => {
    test("Testing 'EmployerBankAccounts' function", () => {
        const wrapper = EnzymeRender(
            <EmployerBankAccounts bar={{}}/>
        )
        const element = wrapper.find("#company_details")
        expect(element.text()).toEqual("Bank accounts")
    })
})
