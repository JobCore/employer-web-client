import React from "react";
import { mount } from 'enzyme';
import Header from "../../../js/components/shipping-address/Header";

describe('<Header/>', () => {

    test('Rendering of Header component', () => {
        const header = mount(<Header title="Billing Details"/>);
        expect(header.length).toEqual(1);
    });

});

/*

console.error
    Warning: Failed prop type: The prop `title` is marked as required in `Title`, but its value is `undefined`.
        in Title (created by Header)
        in Header (created by WrapperComponent)
        in WrapperComponent

      44 |             </Row>
      45 |         ) : (
    > 46 |             <Title breakPoint={breakPoint} titleTag={titleTag} className={titleClass}>
         |             ^
      47 |                 {title}
      48 |             </Title>
      49 |         )}


*/