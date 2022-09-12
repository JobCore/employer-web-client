import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Welcome from "../../js/views/welcome";
import { BrowserRouter as Router } from "react-router-dom";

describe("Testing functions of the 'Welcome' view", () => {

    test("Testing 'Welcome' function", () => {
        render(
            <Router>
                <Welcome />
            </Router>
        )
        expect(Welcome).toHaveLength(1)
    })
})
