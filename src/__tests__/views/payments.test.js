import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { mount, render as EnzymeRender } from 'enzyme';
import { Payment } from "../../js/views/payments"

describe("Testing the 'Payments' view", () => {

    test("Testing 'Payment' function", () => {
        expect(Payment({})).toHaveProperty("defaults")
        expect(Payment({})).toHaveProperty("validate")
    });
})