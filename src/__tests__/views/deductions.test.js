import '@testing-library/jest-dom';
import { Deduction } from "../../js/views/deductions"

describe("Testing the 'Deductions' view", () => {

    test("Testing 'Deduction' function", () => {
        expect(Deduction({})).toHaveProperty("defaults")
        expect(Deduction({})).toHaveProperty("validate")
    });
})