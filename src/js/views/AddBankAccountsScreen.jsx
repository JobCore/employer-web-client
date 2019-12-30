import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import { store, fetchTemporal, update, updateProfileImage } from '../actions.js';
import { TIME_FORMAT, DATETIME_FORMAT, DATE_FORMAT, NOW } from '../components/utils.js';
import { validator, ValidationError } from '../utils/validation';
import Dropzone from 'react-dropzone';
import DateTime from 'react-datetime';
import moment from 'moment';
import { BankAccountExtendedCard, Theme, Button, Wizard } from '../components/index';
import PlaidLink from 'react-plaid-link';

export class AddBankAccountsScreen extends Flux.DashView {

    constructor() {
        super();
        this.state = {
            bankAccounts: [],
            // employer: Employer().defaults()
        };
    }

    setEmployer(newEmployer) {
        const employer = Object.assign(this.state.employer, newEmployer);
        this.setState({ employer });
    }

    componentDidMount() {

        fetchTemporal('employers/me', 'current_employer');
        this.subscribe(store, 'current_employer', (employer) => {
            this.setState({ employer });
        });

    }

    handleOnSuccess(token, metadata) {
        // send token to client server
      }
      handleOnExit() {
        // handle the case when your user exits Link
      }

    render() {
        return (
            <PlaidLink
              clientName="Your app name"
              env="sandbox"
              product={["auth", "transactions"]}
              publicKey="PLAID_PUBLIC_KEY"
              onExit={this.handleOnExit}
              onSuccess={this.handleOnSuccess}>
              Open Link and connect your bank!
            </PlaidLink>
          );
    }
}
