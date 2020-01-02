import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import PlaidLink from 'react-plaid-link';

export class AddBankAccountScreen extends Flux.DashView {

    constructor() {
        super();
        this.state = {
            bankAccounts: [],
            // employer: Employer().defaults()
        };
    }

    handleOnSuccess(token, metadata) {
        console.log('token: ', token);
        console.log('metadata: ', metadata);
        // send token to client server
    }

    handleOnExit() {
        // handle the case when your user exits Link
    }

    render() {
        return (
            <div>
                <PlaidLink
                className
            env={process.env.PLAID_ENVIRONMENT}
            product="auth"
            publicKey={process.env.PLAID_PUBLIC_KEY}
            onExit={this.handleOnExit}
            onSuccess={this.handleOnSuccess}
        >
                Add bank account
                </PlaidLink>
            </div>
          );
    }
}
