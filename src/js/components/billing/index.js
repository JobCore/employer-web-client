import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from 'prop-types';
import * as actions from '../../actions';
import {Notify,Notifier} from 'bc-react-notifier';

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

import countries from "./data-countries";
import { faCircle, faQuestionCircle } from '@fortawesome/fontawesome-free-solid';
import { injectStripe, CardElement, CardNumberElement, CardCvcElement, CardExpiryElement } from 'react-stripe-elements';

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
                            <p className="fs--2 mb-0">
              See full list of features <a href="https://jobcore.co/pricing/">Here</a>
                            </p>
                        </DropdownItem>
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
                                  {/* <Input
                    placeholder="XXXX XXXX XXXX XXXX"
                    id="cardNumber"
                    value={cardNumber}
                    maxLength={16}
                    onChange={({ target }) => setCardNumber(target.value)}
                  /> */}
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
                                  {/* <Input
                    placeholder="15/24"
                    id="expDate"
                    maxLength={5}
                    value={expDate}
                    onChange={({ target }) => setExpDate(target.value)}
                /> */}
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
                                      <FontAwesomeIcon
                      icon="question-circle"
                      className="ml-2 cursor-pointer"
                      id="cvv"
                    />
                                      <UncontrolledTooltip placement="top" target="cvv">
                      Card verification value
                                      </UncontrolledTooltip>
                                  </Label>
                                  {/* <Input
                    placeholder="123"
                    maxLength="3"
                    id="cvv"
                    value={cvv}
                    onChange={({ target }) => setCvv(target.value)}
                  /> */}
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

  return (
      <Card className="h-100">
          <Header title="Billing" light={false} />
          <CardBody
        tag={Form}
        className="bg-light"
        // onSubmit={(e) => {
            
        //     e.preventDefault();
        //     const noti = Notify.info("Are you sure?", (answer) => {
        //         if (answer) actions.createSubscription({ subscription:1 });
        //         noti.remove();
        //     });
          
        // }}
      >
              <h5 className="d-flex justify-content-between">
                  <span>Subscription</span>
                  <span style={{textDecoration:"underline"}}>{props.plan}</span>
              </h5>
              <div className="d-flex justify-content-between fs--1 mb-1">
                  <p className="mb-0">Due in 30 days</p>
                  <span>{props.plan == "Basic" ? "$49.95" : props.plan == "Pro" ? "$99.95" : "$149.95"}</span>
              </div>
              {/* <div className="d-flex justify-content-between fs--1 mb-1 text-success">
                  <p className="mb-0">Annual saving</p>
                  <span>$75.00/yr</span>
              </div> */}
              <hr />
              <h5 className="d-flex justify-content-between">
                  <span>Due today</span>
                  <span>$0.00</span>
              </h5>
              <p className="fs--1 text-600">
          Once you start your trial, you will have 30 days to use JobCore
          for free. After 30 days you’ll be charged based on your selected plan.
              </p>
              <Button color="primary" block onClick={(e) => {
                                const noti = Notify.info("Are you sure? You will lose any other subscription you may have", (answer) => {
                                    if (answer) actions.createSubscription({ subscription: 2 });
                                    noti.remove();
                                });
                        }}>
                  <FontAwesomeIcon icon="lock" className="mr-2" />
          Start free trial
              </Button>
              <div className="text-center mt-2">
                  <small className="d-inline-block">
            By continuing, you are agreeing to our subscriber{" "}
                      <Link to="#!">terms</Link> and will be charged at the end of the
            trial.
                  </small>
              </div>
          </CardBody>
      </Card>
  );
};

const Billing = (props) => {
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
    name: props.user.employer ? props.user.profile.employer.title : "",
    phone: props.user.profile  ? props.user.profile.phone_number : "",
    source: null
  };
  return (
      <ContentWithAsideLayout
      banner={<BillingBanner plan={plan} onChangePlan={setPlan}/>}
      aside={
          <Card className="h-100">
              <Header title="Billing" light={false} />
              <CardBody
      tag={Form}
      className="bg-light"
    >
                  <h5 className="d-flex justify-content-between">
                      <span>Subscription</span>
                      <span style={{textDecoration:"underline"}}>{plan}</span>
                  </h5>
                  <div className="d-flex justify-content-between fs--1 mb-1">
                      <p className="mb-0">Due in 30 days</p>
                      <span>{plan == "Basic" ? "$49.95" : plan == "Pro" ? "$99.95" : "$149.95"}</span>
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
                  <Button color="primary" block onClick={(e) => {
                              const noti = Notify.info("Are you sure?", (answer) => {
                                  if (answer){
                                      setLoading(true);
                                      props.stripe.createToken().then(res => {
                                          if(res['error']) setLoading(false);
                                          else if(!res['error']){
                                              body['source'] = res.token;
                                              actions.createSubscription(body, props.history);
                                              setLoading(false);
                                          }
                                      });
                                  }
                                  noti.remove();
                              });
                      }}>
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
                          <Link to="#!">terms</Link> and will be charged at the end of the
          trial.
                      </small>
                  </div>
              </CardBody>
          </Card>
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
                                      {/* <Input
                    placeholder="XXXX XXXX XXXX XXXX"
                    id="cardNumber"
                    value={cardNumber}
                    maxLength={16}
                    onChange={({ target }) => setCardNumber(target.value)}
                  /> */}
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
                                      {/* <Input
                    placeholder="15/24"
                    id="expDate"
                    maxLength={5}
                    value={expDate}
                    onChange={({ target }) => setExpDate(target.value)}
                /> */}
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
                    CVV<span style={{color:"red"}}>*</span>
                                          <FontAwesomeIcon
                      icon="question-circle"
                      className="ml-2 cursor-pointer"
                      id="cvv"
                    />
                                          <UncontrolledTooltip placement="top" target="cvv">
                      Card verification value
                                          </UncontrolledTooltip>
                                      </Label>
                                      {/* <Input
                    placeholder="123"
                    maxLength="3"
                    id="cvv"
                    value={cvv}
                    onChange={({ target }) => setCvv(target.value)}
                  /> */}
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
    stripe: PropTypes.object.isRequired,
    user: PropTypes.object,
    history: PropTypes.object
  };
BillingAside.propTypes = {
plan: PropTypes.string.isRequired
};
BillingContent.propTypes = {
parentCallback: PropTypes.func
};