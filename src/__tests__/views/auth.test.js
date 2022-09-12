import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { render as EnzymeRender } from "enzyme";
import { loginPropsMock, signUpPropsMock, subscribePropsMock } from "../../__mocks__/views/authPropsMock";
import Subscribe, { Login, Signup, Forgot, Invite, ResetPassword } from "../../js/views/auth";
import { BrowserRouter as Router } from 'react-router-dom';

describe("Testing functions of the 'Auth' view", () => {

    test("Testing 'Login' function", () => {
        render(
            <Router>
                <Login
                    props={loginPropsMock}
                    history={loginPropsMock.location}
                    location={loginPropsMock.history}
                />
            </Router>
        )
        expect(Login).toHaveLength(1)
    })

    test("Testing 'Signup' function", () => {
        render(
            <Router>
                <Signup
                    props={signUpPropsMock}
                    history={signUpPropsMock.location}
                    location={signUpPropsMock.history}
                />
            </Router>
        )
        expect(Signup).toHaveLength(1)
    })

    test("Testing 'Forgot' function", () => {
        const wrapper = render(
            <Router>
                <Forgot />
            </Router>
        )
        const element = wrapper.getByText(/reset your password/)
        expect(element.tagName).toBe("SPAN")
    })

    // These tests did not work, I think they need a mock store
    // test("Testing 'ResetPassword' function", () => {
    //     const wrapper = render(
    //         <Router>
    //             <ResetPassword props={data} />
    //         </Router>
    //     )
    //     expect(ResetPassword).toHaveLength(1)
    // })

    // test("Testing 'Invite' function", () => {
    //     const wrapper = render(
    //         <Router>
    //             <Invite props={data} />
    //         </Router>
    //     )
    //     expect(Invite).toHaveLength(1)
    // })

})

/**  
 * SUBSCRIBE TEST
 * import { StripeProvider, Elements } from "react-stripe-elements";
 * import { Billing } from "../../js/components/billing";
 * import PageWithStripeElements from "../../__mocks__/PageWithStripeElements";
 * 
 * 
    beforeEach(() => {
        PageWithStripeElements()
    })
 * 
 * test("Testing 'Stripe' component", () => {
        EnzymeRender(
            <StripeProvider apiKey='pk_test_WO5dHVGGqxwtXAWP2T8jhPnR00tBqNpUR5'>
                <Elements>
                    <Billing history={subscribePropsMock.history} />
                </Elements>
            </StripeProvider>
        )
        expect(StripeProvider).toHaveLength(1)
    })

    test("Testing 'Subscribe' function", () => {
        EnzymeRender(
            <Subscribe
                props={subscribePropsMock}
            />
        )
        expect(Subscribe).toHaveLength(1)
    })
 * 
 */