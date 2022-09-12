import React from "react";
import { render } from "@testing-library/react";
import { render as EnzymeRender } from 'enzyme';
import { shallow } from 'enzyme';
import RightBar from "../../js/views/RightBar";
import { BrowserRouter as Router } from "react-router-dom";

const onClose = jest.fn()

describe('<SideBar/>', () => {

    test('Rendering of RightBar component', () => {
        const rightBar = shallow(
            <Router>
                <RightBar
                    onClose={onClose}
                />
            </Router>
        );
        expect(rightBar.length).toEqual(1);
    });

});