import React from 'react';
import { render } from "enzyme";
import ButtonBar from "../../js/views/ButtonBar";
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';

describe("Testing functions of the 'ButtonBar' view", () => {

    test("Testing 'ButtonBar' function", () => {
        const buttonBar = mount(
            <Router>
                <ButtonBar onClick={() => this.submithandler()} />
            </Router>
        );
        expect(buttonBar.length).toEqual(1);
    })
})