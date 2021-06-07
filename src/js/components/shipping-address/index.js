import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, Col, Input, Label, Row } from 'reactstrap';
import Header from './Header';
import ButtonIcon from './ButtonIcon';

const CheckoutShippingAddress = ({ shippingAddress, setShippingAddress }) => (
    <Card className="mb-3">
        <Header title="Choose your subscription:" titleTag="h5"/>
        <CardBody>
            <Row>
                <Col md={4} className="mb-3 mb-md-0">
                    <div className="custom-control custom-radio radio-select">
                        <Input
                          className="custom-control-input"
                          id="basic"
                          type="radio"
                          value="basic"
                          checked={shippingAddress === 'basic'}
                          onChange={({ target }) => setShippingAddress(target.value)}
                        />
                        <Label className="custom-control-label font-weight-bold d-block" htmlFor="basic">
                            Basic
                            <span className="radio-select-content">
                                <span>
                                    {' '}
                                    2392 Main Avenue,
                                    <br />
                                    Pensaukee,
                                    <br />
                                    New Jersey 02139
                                    <span className="d-block mb-0 pt-2">+(856) 929-229</span>
                                </span>
                            </span>
                        </Label>
                    </div>
                </Col>
                <Col md={4} className="mb-3 mb-md-0">
                    <div className="custom-control custom-radio radio-select">
                        <Input
                          className="custom-control-input"
                          id="pro"
                          type="radio"
                          value="pro"
                          checked={shippingAddress === 'pro'}
                          onChange={({ target }) => setShippingAddress(target.value)}
                        />
                        <Label className="custom-control-label font-weight-bold d-block" htmlFor="pro">
                            Pro
                            <span className="radio-select-content">
                                <span>
                                    {' '}
                                    2392 Main Avenue,
                                    <br />
                                    Pensaukee,
                                    <br />
                                    New Jersey 02139
                                    <span className="d-block mb-0 pt-2">+(856) 929-229</span>
                                </span>
                            </span>
                        </Label>
                    </div>
                </Col>
                <Col md={4} className="mb-3 mb-md-0">
                    <div className="custom-control custom-radio radio-select">
                        <Input
                          className="custom-control-input"
                          id="enterprise"
                          type="radio"
                          value="enterprise"
                          checked={shippingAddress === 'enterprise'}
                          onChange={({ target }) => setShippingAddress(target.value)}
                        />
                        <Label className="custom-control-label font-weight-bold d-block" htmlFor="enterprise">
                            Enterprise
                            <span className="radio-select-content">
                                <span>
                                    {' '}
                                    2392 Main Avenue,
                                    <br />
                                    Pensaukee,
                                    <br />
                                    New Jersey 02139
                                    <span className="d-block mb-0 pt-2">+(856) 929-229</span>
                                </span>
                            </span>
                        </Label>
                    </div>
                </Col>
            
            </Row>
        </CardBody>
    </Card>
);

CheckoutShippingAddress.propTypes = {
  shippingAddress: PropTypes.string.isRequired,
  setShippingAddress: PropTypes.func.isRequired
};

export default CheckoutShippingAddress;
