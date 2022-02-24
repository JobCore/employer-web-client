import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from 'prop-types';
import * as actions from '../../actions';
import {Notify,Notifier} from 'bc-react-notifier';
import { Session } from "bc-react-session";
import {
  Button,
  Card,
  CardBody,
  Col,
  CustomInput,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  UncontrolledDropdown,
  UncontrolledTooltip,
  Spinner
} from "reactstrap";
import ContentWithAsideLayout from "./ContentWithAsideLayout";
import Header from "./Header";
import iconPaymentMethods from "./icon-payment-methods.png";
import PageHeader from "./PageHeader";
import FaqCol from "./faq/FaqCol";
import { isIterableArray } from "./faq/IterableAray";
import fontawesome from '@fortawesome/fontawesome';
import { useHistory } from 'react-router-dom';
import countries from "./data-countries";
import { faCircle, faQuestionCircle } from '@fortawesome/fontawesome-free-solid';
import { injectStripe, CardElement, CardNumberElement, CardCvcElement, CardExpiryElement, StripeProvider } from 'react-stripe-elements';
import { useStripe } from '@stripe/react-stripe-js';


const BillingBanner = (props) =>{
   
    return(

        <PageHeader
                title="Get started with your free trial"
                description="Subscription are Free for 30 days, cancel at any time."
                className="mb-3"
            >
            <UncontrolledDropdown>
                <DropdownToggle caret color="link" size="sm" className="pl-0 border-0" style={{fontSize: '16px', fontWeight:"bold"}} >
                    {props.plan + ' Plan'}
                </DropdownToggle>
                <DropdownMenu className="py-0" style={{ minWidth: "15rem", fontSize: '14px' }}>
                    <div className="bg-white py-3 rounded-soft">
                        <DropdownItem tag="div" className="text-base px-3 py-2" onClick={()=> props.onChangePlan('Basic')}>
                            <span className="d-flex justify-content-between fs--1 text-black">
                                <span className="font-weight-bold">Basic Plan</span>
                                <span className="font-weight-bold">$49.95/mo.</span>
                            </span>
                            <ul className="list-unstyled pl-1 my-2 fs--1">
                                <li>
                                    <FontAwesomeIcon icon="circle" transform="shrink-11" />
                                    <span className="ml-1">Max. active employees 40/mo.</span>
                                </li>
                            </ul>
                     
                        </DropdownItem>
                        <DropdownItem divider className="my-0" />
                        <DropdownItem tag="div" className="text-base px-3 py-2" onClick={()=> props.onChangePlan('Pro')}>
                            <span className="d-flex justify-content-between fs--1 text-black">
                                <span className="font-weight-bold">Pro Plan</span>
                                <span className="font-weight-bold">$99.95/mo.</span>
                            </span>
                            <ul className="list-unstyled pl-1 my-2 fs--1">
                                <li>
                                    <FontAwesomeIcon icon="circle" transform="shrink-11" />
                                    <span className="ml-1">Max. active employees 60/mo.</span>
                                </li>
                            </ul>
                     
                        </DropdownItem>
                        <DropdownItem divider className="my-0" />

                        <DropdownItem tag="div" className="text-base px-3 py-2" onClick={()=> props.onChangePlan('Enterprise')}>
                            <span className="d-flex justify-content-between fs--1 text-black">
                                <span className="font-weight-bold">Enterprise Plan</span>
                                <span className="font-weight-bold">$149.95/mo</span>
                            </span>
                            <ul className="list-unstyled pl-1 my-2 fs--1">
                                <li>
                                    <FontAwesomeIcon icon="circle" transform="shrink-11" />
                                    <span className="ml-1">Max. active employees 100/mo.</span>
                                </li>
                         
                            </ul>
                        </DropdownItem>
                        <p className="fs--2 mb-0 mt-3 text-center">
                            <a href="https://jobcore.co/pricing" style={{color:"blue", fontWeight:"700"}}>See full list of features. Here!</a>
                        </p>
                    </div>
                </DropdownMenu>
            </UncontrolledDropdown>
        </PageHeader>
);

};

const BillingContent = (props) => {
  const [method, setMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardNumberError, setCardNumberError] = useState("");
  const [cardExpError, setCardExpError] = useState("");
  const [cardCVSError, setCardCVSError] = useState("");
  const [cardName, setCardName] = useState("");
  const [country, setCountry] = useState("United States");
  const [zip, setZip] = useState("");
  const [expDate, setExpDate] = useState("");
  const [cvv, setCvv] = useState("");

  const labelClasses = "ls text-uppercase text-600 font-weight-semi-bold mb-0";
  fontawesome.library.add(faCircle, faQuestionCircle);

  return (
    <Card className="h-100">
      <Header title="Billing Details" light={false} />
      <CardBody className="bg-light">
          <Row tag={Form}>
              <Col>
                  <CustomInput
                    type="radio"
                    name="billing"
                    id="card"
                    value="card"
                    checked={method === "card"}
                    onChange={({ target }) => setMethod(target.value)}
                    label={
                        <span className="d-flex align-items-center">
                            <span className="fs-1 text-nowrap">Credit Card</span>
                            <img
                            className="d-none d-sm-inline-block ml-2 mt-lg-0"
                            src={iconPaymentMethods}
                            height={20}
                            alt=""
                            />
                        </span>
                    }
                 />
                  <p className="fs--1 mb-4">
                    Safe money transfer using your bank accounts. Visa, maestro,
                    discover, american express.
                  </p>
                  <Row form>
                      <Col>
                          <FormGroup>
                              <Label className={labelClasses} for="cardNumber">
                                Card Number<span style={{color:"red"}}>*</span>
                              </Label>
                              <div id="card-element" className="form-control" style={{background: "white", color:"#000000", border:"1px solid #000000", borderRadius: '0', height: '2.4em', paddingTop: '.7em'}}>
                                <CardNumberElement
                                    placeholder="XXXX XXXX XXXX XXXX"
                                    onChange={e => {
                                        if(e.empty == true) setCardNumberError('This field is required');
                                        else if(e.error) setCardNumberError(e.error.message);
                                        else setCardNumberError('');
                                    }}
                                />
                              </div>
                              <span style={{color:"red"}}>{cardNumberError}</span>
                          </FormGroup>
                      </Col>
                      <Col>
                          <FormGroup>
                            <Label className={labelClasses} for="cardName">
                            Name of Card
                            </Label>
                            <Input
                                placeholder=""
                                maxLength={30}
                                id="cardName"
                                value={cardName}
                                onChange={({ target }) => setCardName(target.value)}
                            />
                          </FormGroup>
                      </Col>
                  </Row>
                  <Row form>
                        <Col xs={6} sm={3}>
                            <FormGroup>
                                <Label className={labelClasses} for="customSelectCountry">
                                    Country
                                </Label>
                                <CustomInput
                                    type="select"
                                    id="country"
                                    name="country"
                                    value={country}
                                    onChange={({ target }) => setCountry(target.value)}
                                >
                                    {isIterableArray(countries) &&
                                    countries.map((country, index) => (
                                        <option value={country} key={index}>
                                            {country}
                                        </option>
                                    ))}
                                </CustomInput>
                            </FormGroup>
                        </Col>
                        <Col xs={6} sm={3}>
                            <FormGroup className="form-group">
                                <Label className={labelClasses} for="zipCode">
                                    Zip Code
                                </Label>
                                <Input
                                    placeholder="33131"
                                    id="zipCode"
                                    maxLength="10"
                                    value={zip}
                                    onChange={({ target }) => setZip(target.value)}
                                />
                            </FormGroup>
                        </Col>
                        <Col xs={6} sm={3}>
                            <FormGroup>
                                <Label className={labelClasses} for="expDate">
                                    Exp Date<span style={{color:"red"}}>*</span>
                                </Label>
                                <div id="card-element" className="form-control" style={{background: "white", color:"#000000", border:"1px solid #000000", borderRadius: '0', height: '2.4em', paddingTop: '.7em'}}>
                                    <CardExpiryElement 
                                        placeholder="14/25"
                                        onChange={e => {
                                        if(e.empty == true) setCardExpError('This field is required');
                                        else if(e.error) setCardExpError(e.error.message);
                                        else setCardExpError('');

                                        }}
                                    />
                                </div>
                                <span style={{color:"red"}}>{cardExpError}</span>
                            </FormGroup>
                        </Col>
                        <Col xs={6} sm={3}>
                            <FormGroup>
                                <Label className={labelClasses} for="cvv">
                                    CVV
                                    <span style={{color:"red"}}>*</span>
                                    <FontAwesomeIcon
                                        icon="question-circle"
                                        className="ml-2 cursor-pointer"
                                        id="cvv"
                                    />
                                    <UncontrolledTooltip placement="top" target="cvv">
                                        Card verification value
                                    </UncontrolledTooltip>
                                </Label>
                                <div id="card-element" className="form-control" style={{background: "white", color:"#000000", border:"1px solid #000000", borderRadius: '0', height: '2.4em', paddingTop: '.7em'}}>
                                    <CardCvcElement
                                        onChange={e => {
                                            if(e.empty == true) setCardCVSError('This field is required');
                                            else if(e.error) setCardCVSError(e.error.message);
                                            else setCardCVSError('');
                                        }}
                                    />
                                </div>
                                <span style={{color:"red"}}>{cardCVSError}</span>
                            </FormGroup>
                        </Col>
                    </Row>
              </Col>
          </Row>
      </CardBody>
  </Card>    
  );
};

const BillingAside = (props) => {
  console.log('props', props);
  const [plan, setPlan] = useState("Basic");
  const [method, setMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardNumberError, setCardNumberError] = useState("");
  const [cardExpError, setCardExpError] = useState("");
  const [cardCVSError, setCardCVSError] = useState("");
  const [cardName, setCardName] = useState("");
  const [country, setCountry] = useState("United States");
  const [zip, setZip] = useState("");
  const [expDate, setExpDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const labelClasses = "ls text-uppercase text-600 font-weight-semi-bold mb-0";
  fontawesome.library.add(faCircle, faQuestionCircle);
  
  const [customerData, setCustomerData] = useState({
    address: {
        country: '',
        postal_code: ''
    },
    description: '',
    email: '',
    name: '',
    phone: ''
  });
  const [paymentData, setPaymentData] = useState({
    address: {
        country: '',
        postal_code: ''
    },
    description: '',
    email: '',
    name: '',
    phone: ''
  });

  const body = {
    subscription: plan == "Basic" ? 1 : plan == "Pro" ? 2 : plan == "Enterprise" ? 3 : null,
    address: {
        country: 'US',
        postal_code: zip
    },
    description: "Purchased " + plan + " Subscription",
    email: props.user.email || "",
    name: cardName,
    phone: props.user.profile  ? props.user.profile.phone_number : "",
    source: null
  };
//   const { stripe } = props;
// const history = useHistory();
// console.log("history en index###", history)
  const handleSubmit = (event) => {
    event.preventDefault();
    const noti = Notify.info("Are you sure?", (answer) => {
        
        if (answer){
            setLoading(true);
            props.stripe.createToken().then(res => {
                if(res['token']){
                body['source'] = res.token;
                const result = actions.createSubscription(body, props.history).then(res => setLoading(false) );
                // return result
                }else setLoading(false);
            });
        }
        noti.remove();
    });
  };
  return (
    <Card className="h-100">
        <Header title="Billing" light={false} />
        <CardBody tag={Form} className="bg-light" onSubmit={handleSubmit}>
            <h5 className="d-flex justify-content-between">
                <span>Subscription</span>
                <span style={{textDecoration:"underline"}}>{props.plan}</span>
            </h5>
            <div className="d-flex justify-content-between fs--1 mb-1">
                <p className="mb-0">Due in 30 days</p>
                <span>{props.plan == "Basic" ? "$49.95" : props.plan == "Pro" ? "$99.95" : "$149.95"}</span>
            </div>
            <hr />
            <h5 className="d-flex justify-content-between">
                <span>Due today</span>
                <span>$0.00</span>
            </h5>
            <p className="fs--1 text-600">
                Once you start your trial, you will have 30 days to use JobCore
                for free. After 30 days you’ll be charged based on your selected plan.
            </p>
            <Button color="primary" disabled={!loading ? false : true} block 
                // onClick={ props.history.push("/home")}
                >
                {!loading ? (
                    <div>
                        <FontAwesomeIcon icon="lock" className="mr-2" />
                        Start free trial
                    </div>
            ): (
                <Spinner size="sm"/>
            )}
            </Button>
            <div className="text-center mt-2">
                <small className="d-inline-block">
                By continuing, you are agreeing to our subscriber{" "}
                <Link to="#!">terms</Link> and will be charged at the end of the trial.
                </small>
            </div>
    </CardBody>
</Card>
  );
};

const Billing = (props) => {
  const [plan, setPlan] = useState("Basic");
//   const [method, setMethod] = useState("card");
//   const [cardNumber, setCardNumber] = useState("");
//   const [cardNumberError, setCardNumberError] = useState("");
//   const [cardExpError, setCardExpError] = useState("");
//   const [cardCVSError, setCardCVSError] = useState("");
//   const [cardName, setCardName] = useState("");
//   const [country, setCountry] = useState("United States");
//   const [zip, setZip] = useState("");
//   const [expDate, setExpDate] = useState("");
//   const [cvv, setCvv] = useState("");
//   const [loading, setLoading] = useState(false);
//   const labelClasses = "ls text-uppercase text-600 font-weight-semi-bold mb-0";
//   fontawesome.library.add(faCircle, faQuestionCircle);

//   const [customerData, setCustomerData] = useState({
//       address: {
//           country: '',
//           postal_code: ''
//       },
//       description: '',
//       email: '',
//       name: '',
//       phone: ''
//   });
//   const [paymentData, setPaymentData] = useState({
//       address: {
//           country: '',
//           postal_code: ''
//       },
//       description: '',
//       email: '',
//       name: '',
//       phone: ''
//   });

//   const body = {
//     subscription: plan == "Basic" ? 1 : plan == "Pro" ? 2 : plan == "Enterprise" ? 3 : null,
//     address: {
//         country: 'US',
//         postal_code: zip
//     },
//     description: "Purchased " + plan + " Subscription",
//     email: props.user.email || "",
//     name: cardName,
//     phone: props.user.profile  ? props.user.profile.phone_number : "",
//     source: null
//   };
const session = Session.get();
const { stripe } = props;
  return (
    <ContentWithAsideLayout
      banner={<BillingBanner plan={plan} onChangePlan={setPlan}/>}
      aside={ <BillingAside 
                plan={plan} 
                onChangePlan={setPlan}
                stripe={stripe} 
                user={session.payload.user}
                history={props.history}
                />
      }
      footer={<div><div className="row text-center mb-3">
          <div className="col">
              <Link to="/login">
                  <button className="btn btn-primary">Go Back To Login</button>
              </Link>
          </div>
      </div><FaqCol /></div>}
      isStickyAside={false}
    >   
        <BillingContent />
        <Notifier/>
    </ContentWithAsideLayout>
  );
};

export default injectStripe(Billing);

BillingBanner.propTypes = {
    plan: PropTypes.string.isRequired,
    onChangePlan: PropTypes.func
  };
Billing.propTypes = {
    // stripe: PropTypes.object.isRequired,
    // user: PropTypes.object,
    history: PropTypes.object,
    plan: PropTypes.string,
  };
BillingAside.propTypes = {
    plan: PropTypes.string.isRequired,
    stripe: PropTypes.object.isRequired,
    user: PropTypes.object,
    history: PropTypes.object
};
BillingContent.propTypes = {
    parentCallback: PropTypes.func
};