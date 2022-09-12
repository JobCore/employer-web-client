import React from "react";
import { mount } from 'enzyme';
import TextareaAutoSize from "../../js/components/text-area-autosize/TextAreaAutoSize.jsx";

describe('<TextareaAutoSize/>', () => {

    test('Rendering of TextareaAutoSize component', () => {
        const textAreaAutoSize = mount(
            <TextareaAutoSize
                onClick={() => this.submithandler()}
            />
        );
        expect(textAreaAutoSize.length).toEqual(1);
    });

});