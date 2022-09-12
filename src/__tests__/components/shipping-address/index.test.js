import React from "react";
import { mount } from 'enzyme';
import CheckoutShippingAddress from "../../../js/components/shipping-address/index";

describe('<CheckoutShippingAddress/>', () => {

    test('Rendering of CheckoutShippingAddress component', () => {
        const checkoutShippingAddress = mount(<CheckoutShippingAddress/>);
        expect(checkoutShippingAddress.length).toEqual(1);
    });

});

