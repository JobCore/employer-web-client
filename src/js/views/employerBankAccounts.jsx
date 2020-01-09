import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import PlaidLink from 'react-plaid-link';
import { BankAccountExtendedCard, Theme } from '../components/index';
import { addBankAccount } from "../actions";

class EmployerBankAccounts extends Flux.DashView {

    constructor() {
        super();
        this.state = {
            bankAccounts: [
                {
                    name: "account 1",
                    id: 1
                },
                {
                    name: "account 2",
                    id: 2
                },
                {
                    name: "account 3",
                    id: 3
                },
                {
                    name: "account 4",
                    id: 4
                },
                {
                    name: "account 5",
                    id: 5
                },
            ],
            // employer: Employer().defaults()
        };
    }

    handleOnSuccess(token, metadata) {
        console.log('token: ', token);
        console.log('metadata: ', metadata);
        addBankAccount(token, metadata);
        // send token to client server
    }

    handleOnExit() {
        // handle the case when your user exits Link
    }

    deleteBankAccount = (data) => {
        console.log('delete bank account: ', data);
      }

    render() {
        return (
            <div>
                <div className="row mt-2">
                    <div className="col-12">
                        <h1><span id="company_details">Bank accounts</span></h1>
                        <div className="p-1 listcontents" style={{ margin: '20px' }}>
                            <Theme.Consumer>
                                {({ bar }) => (<span>
                                    {/* <Wizard continuous
                                        steps={this.state.steps}
                                        run={this.state.runTutorial}
                                        callback={callback}
                                    /> */}
                                    {/* <h1><span id="talent_search_header">Talent Search</span></h1> */}
                                    {this.state.bankAccounts.map((account, i) => (
                                        <BankAccountExtendedCard
                                            key={i}
                                            account={account}
                                            hover={true}
                                            onDelete={this.deleteBankAccount}
                                            // onClick={() => bar.show({ slug: "show_single_talent", data: s, allowLevels })}
                                        >
                                            {/* <Button icon="favorite" onClick={() => bar.show({ slug: "add_to_favlist", data: s, allowLevels })}><label>Favorites</label></Button> */}
                                            {/* <Button icon="favorite" onClick={() => bar.show({ slug: "invite_talent_to_shift", data: s, allowLevels })}><label>Invite</label></Button> */}
                                        </BankAccountExtendedCard>
                                    ))}
                                </span>)}
                            </Theme.Consumer>
                        </div>
                        <PlaidLink
                            className="plaid-button"
                            env={process.env.PLAID_ENVIRONMENT}
                            product="auth"
                            publicKey={process.env.PLAID_PUBLIC_KEY}
                            onExit={this.handleOnExit}
                            onSuccess={this.handleOnSuccess}
                        >
                            <button
                                type="button"
                                className="btn btn-primary"
                            >
                                Add bank account
                            </button>
                        </PlaidLink>
                    </div>
                </div>
            </div>
          );
    }
}

export default EmployerBankAccounts;