import React, { Fragment, useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import qs from "query-string";
import * as actions from "../actions";
import { Notifier } from "bc-react-notifier";
import loginBanner from "../../img/login-banner.png";
import { Session } from "bc-react-session";
import { useHistory } from "react-router-dom";

import { validator, onlyLetters } from "../utils/validation";
import { Notify } from "bc-react-notifier";
import Billing from "../components/billing";
import { BrowserView, ConsoleView, MobileView } from "react-device-detect";
import logoURL from "../../img/jobcore-logo.png";

import googleIcon from "../../img/icons/google-play.svg";
import appleIcon from "../../img/icons/apple-store.svg";
import SVG from "react-svg-inline";
import {
  StripeProvider,
  Elements,
  injectStripe,
  CardElement,
} from "react-stripe-elements";
import { loadStripe } from "@stripe/stripe-js";

export class Login extends React.Component {
  constructor(props) {
    super(props);
    const urlVariables = qs.parse(props.location.search);
    this.state = {
      email: "",
      password: "",
      id: "",
      type: urlVariables.type || "company",
      loading: false,
      keep: true,
    };
  }
  render() {
    return (
      <div className="public_view login_view">
        <img
          className="banner"
          src={
            "https://res.cloudinary.com/hq02xjols/image/upload/v1626700274/logo1.png"
          }
          width={230}
        />
        <Notifier />
        {/* <MobileView>
                    {
                        this.state.type == 'company' ?
                            <div>
                                <h4>Please log in from a desktop computer</h4>
                            </div>
                            :
                            <div>
                                <h4>Please download our mobile application to log in</h4>
                                <a href={process.env.ANDROID_APP_URL}>
                                    <SVG className="store-icon" svg={googleIcon} />
                                </a>
                                <a href={process.env.APPSTORE_APP_URL}>
                                    <SVG className="store-icon" svg={appleIcon} />
                                </a>
                            </div>
                    }
                </MobileView> */}
        {/* <BrowserView> */}
        {this.state.type == "employee" ? (
          <div>
            <h4>Please download our mobile application to log in</h4>
            <a href={process.env.ANDROID_APP_URL}>
              <SVG className="store-icon" svg={googleIcon} />
            </a>
            <a href={process.env.APPSTORE_APP_URL}>
              <SVG className="store-icon" svg={appleIcon} />
            </a>
          </div>
        ) : (
          <form
            className="col-10 col-sm-5 col-md-4 col-lg-3 mx-auto mt-4"
            onSubmit={(e) => {
              e.preventDefault();
              this.setState({ loading: true });
              // if(this.state.id != "" && this.state.id != "0" ){
              // actions.stripeStatus(
              //   this.state.email,
              //   this.state.password,
              //   this.state.keep,
              //   this.props.history
              //   )
              // if (stripeStatusResp.status===200) {
              actions
              .login(
                this.state.email,
                this.state.password,
                this.state.keep,
                this.props.history
              )
              .then(() => this.setState({ loading: false }))
              .catch(() => this.setState({ loading: false }));
              
              // } else {
              //   console.log("estamos dentro del else")
              //   Notify.error("Your subscription is not active, please get a new one");
              //   this.setState({loading: false});
              //   setTimeout(() => {history.push("/subscribe")}, 4000)
              //   }

              }
             }
          >
            <div className="form-group">
              <label className="text-left" style={{ fontSize: 18 }}>
                Email
              </label>
              <input
                style={{ fontSize: 18 }}
                type="email"
                autoComplete="new-email"
                className="form-control"
                aria-describedby="emailHelp"
                placeholder="Enter email"
                value={this.state.email}
                onChange={(e) => this.setState({ email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label style={{ fontSize: 18 }}>Password</label>

              <input
                style={{ fontSize: 18 }}
                type="password"
                autoComplete="new-password"
                className="form-control"
                id="exampleInputPassword1"
                placeholder="Password"
                onChange={(e) => this.setState({ password: e.target.value })}
                value={this.state.password}
              />
            </div>
            {/* <div className="form-group mb-0">
                                    <input name="Company ID" type="text" autoComplete="new-company-id-pass" className="form-control rounded" id="exampleInputID" placeholder="Company ID"
                                        onChange={(e) => this.setState({id: e.target.value})} value={this.state.id}
                                    />
                                </div> */}
            <div className="form-group text-left mt-4" style={{ fontSize: 18 }}>
              <input
                type="checkbox"
                className="mr-1"
                onChange={(e) => this.setState({ keep: !this.state.keep })}
                checked={this.state.keep}
              />
              Keep Me Logged In
            </div>
            {this.state.loading ? (
              <button
                type="submit"
                className="btn btn-default w-100 mt-2"
                style={{ fontSize: 18, fontWeight: 900 }}
                disabled
              >
                Loading...
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-primary w-100 mt-2"
                style={{ fontSize: 18, fontWeight: 900 }}
              >
                <span>Sign In</span>
              </button>
            )}
            <div className="extra-actions mt-4">
              <Link
                to="/signup"
                className="float-left ml-4 mt-2"
                style={{ fontSize: 18, textDecoration: "underline" }}
              >
                Sign Up
              </Link>
              <Link
                to="/forgot"
                className="float-right mr-4 mt-2"
                style={{ fontSize: 18, textDecoration: "underline" }}
              >
                Forgot Password
              </Link>
            </div>
          </form>
        )}
        {/* </BrowserView> */}
      </div>
    );
  }
}
Login.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
};



const Subscribe = (props) => {
  return (
    <div className="container mt-4">
      <span
        className="svg_img"
        style={{ backgroundImage: `url(${logoURL})` }}
      />
     
      <StripeProvider apiKey="pk_test_WO5dHVGGqxwtXAWP2T8jhPnR00tBqNpUR5">
        <Elements >           
          <Billing history={props.history} />
        </Elements>
      </StripeProvider>
      
    </div>
  );
};
export default Subscribe;

// export class Subscribe extends React.Component{
//     constructor(props){
//         super(props);
//         const urlVariables = qs.parse(props.location.search);
//         this.state = { email: '', password: '', id: '', type: urlVariables.type || 'company', loading: false, keep: true };
//     }
//     render(){
//         return (
//             <div className="container">
//                 <ShippingAddress shippingAddress={shippingAddress} setShippingAddress={setShippingAddress}/>
//             </div>
//         );
//     }
// }
// Subscribe.propTypes = {
//     history: PropTypes.object,
//     location: PropTypes.object
// };
export class Signup extends React.Component {
  constructor(props) {
    super(props);
    const urlVariables = qs.parse(props.location.search);

    this.state = {
      email: urlVariables.email || "",
      password: "",
      first_name: "",
      phone: "",
      last_name: "",
      company: urlVariables.company || urlVariables.employer || 1,
      business_name: "",
      business_website: "",
      about_business: "",
      loading: false,
      errors: [],
      token: urlVariables.token || null,
    };
  }
  getFormattedPhoneNum(input) {
    let output = "(";
    input.replace(
      /^\D*(\d{0,3})\D*(\d{0,3})\D*(\d{0,4})/,
      function (match, g1, g2, g3) {
        if (g1.length) {
          output += g1;
          if (g1.length == 3) {
            output += ")";
            if (g2.length) {
              output += " " + g2;
              if (g2.length == 3) {
                output += " - ";
                if (g3.length) {
                  output += g3;
                }
              }
            }
          }
        }
      }
    );
    return output;
  }
  validate(formData) {
    let errors = [];
    if (!validator.isEmail(formData.email)) errors.push("Invalid email");
    if (validator.isEmpty(formData.first_name))
      errors.push("The first name cannot be empty");
    if (!validator.isLength(formData.first_name, { min: 0, max: 50 }))
      errors.push("The first name can have a max of 50 characters");
    if (!validator.isLength(formData.last_name, { min: 0, max: 50 }))
      errors.push("The last name can have a max of 50 characters");
    if (!onlyLetters(formData.first_name) || !onlyLetters(formData.last_name))
      errors.push("First and last name cannot contain numbers");
    if (validator.isEmpty(formData.last_name))
      errors.push("The last name cannot be empty");
    if (validator.isEmpty(formData.password))
      errors.push("The password cannot be empty");
    if (!validator.isLength(formData.password, { min: 8, max: 50 }))
      errors.push("Password must have between 8 and 50 characters");
    if (validator.isEmpty(formData.phone))
      errors.push("The company phone cannot be empty");
    if (validator.isEmpty(formData.business_name))
      errors.push("The company name cannot be empty");
    if (validator.isEmpty(formData.business_website))
      errors.push("The company website cannot be empty");
    if (validator.isEmpty(formData.about_business))
      errors.push("The company type cannot be empty");

    this.setState({ errors, loading: false });
    return errors.length == 0;
  }
  render() {
    return (
      <div className="public_view login_view">
        <img
          className="banner"
          src={
            "https://res.cloudinary.com/hq02xjols/image/upload/v1626700274/logo1.png"
          }
          width={230}
        />
        <Notifier />
        {this.state.errors.length > 0 ? (
          <div className="alert alert-danger">
            <ul>
              {this.state.errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        ) : (
          ""
        )}
        <form
          className="col-10 col-sm-8 col-md-4 col-lg-4 mx-auto mb-5"
          onSubmit={(e) => {
            this.setState({ loading: true });
            e.preventDefault();

            const formData = {
              email: this.state.email,
              password: this.state.password,
              first_name: this.state.first_name,
              last_name: this.state.last_name,
              // company: this.state.company,
              username: this.state.email,
              phone: this.state.phone,
              business_name: this.state.business_name,
              business_website: this.state.business_website,
              about_business: this.state.about_business,
              employer_role: "ADMIN",
              account_type: "employer",
            };
            if (this.validate(formData))
              actions
                .signup(formData, this.props.history)
                .then(() => this.setState({ loading: false }))
                .catch(() => this.setState({ loading: false }));
          }}
        >
          <div className="row">
            <div className="col">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  aria-describedby="fHelp"
                  placeholder="First Name"
                  style={{ fontSize: 18 }}
                  value={this.state.first_name}
                  onChange={(e) =>
                    this.setState({ first_name: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  aria-describedby="lHelp"
                  placeholder="Last Name"
                  style={{ fontSize: 18 }}
                  value={this.state.last_name}
                  onChange={(e) => this.setState({ last_name: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              aria-describedby="emailHelp"
              placeholder="Email"
              style={{ fontSize: 18 }}
              value={this.state.email}
              onChange={(e) => this.setState({ email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              aria-describedby="emailHelp"
              placeholder="Phone"
              style={{ fontSize: 18 }}
              value={this.state.phone}
              onChange={(e) => {
                if (e.target.value.length < 13) {
                  var cleaned = ("" + e.target.value).replace(/\D/g, "");

                  let normValue = `${cleaned.substring(0, 3)}${
                    cleaned.length > 3 ? "-" : ""
                  }${cleaned.substring(3, 6)}${
                    cleaned.length > 6 ? "-" : ""
                  }${cleaned.substring(6, 11)}`;

                  this.setState({ phone: normValue });
                }
              }}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Password"
              style={{ fontSize: 18 }}
              onChange={(e) => this.setState({ password: e.target.value })}
              value={this.state.password}
            />
          </div>

          <div className="row">
            <div className="col">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  aria-describedby="fHelp"
                  placeholder="Company Name"
                  style={{ fontSize: 18 }}
                  value={this.state.business_name}
                  onChange={(e) =>
                    this.setState({ business_name: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  aria-describedby="lHelp"
                  placeholder="Company Website"
                  style={{ fontSize: 18 }}
                  value={this.state.business_website}
                  onChange={(e) =>
                    this.setState({ business_website: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <div className="row" style={{ fontSize: 18 }}>
            <div className="col">
              <div className="form-group">
                <select
                  style={{ background: "none", fontSize: 18 }}
                  className="form-control"
                  aria-describedby="fHelp"
                  placeholder="Type of business"
                  value={this.state.about_business}
                  onChange={(e) =>
                    this.setState({ about_business: e.target.value })
                  }
                >
                  <option value="">Select...</option>
                  <option value="Restaurants">Restaurants</option>
                  <option value="Catering">Catering</option>
                  <option value="Cruises">Cruises</option>
                  <option value="Bars">Bars</option>
                  <option value="Hotels">Hotels</option>
                  <option value="Janitorial">Janitorial</option>
                  <option value="Warehouse">Warehouse</option>
                </select>
              </div>
            </div>
          </div>
          {this.state.loading ? (
            <button
              type="submit"
              className="btn btn-default w-100"
              style={{ fontSize: 18, fontWeight: 900 }}
              disabled
            >
              Loading...
            </button>
          ) : (
            <button
              type="submit"
              className="btn btn-primary w-100"
              style={{ fontSize: 18, fontWeight: 900 }}
            >
              Sign Up
            </button>
          )}

          <span style={{ fontSize: 14 }}>
            By clicking sign up, you agree to the Terms of use and have read our
            Privacy policy
          </span>
          <div className="extra-actions mt-3">
            <Link
              to="/login"
              className="float-left ml-4 mt-2"
              style={{ fontSize: 18, textDecoration: "underline" }}
            >
              Log In
            </Link>
            <Link
              to="/forgot"
              className="float-right mr-4 mt-2"
              style={{ fontSize: 18, textDecoration: "underline" }}
            >
              Forgot Password
            </Link>
          </div>
        </form>
      </div>
    );
  }
}
Signup.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
};
export class Forgot extends React.Component {
  constructor() {
    super();
    this.state = { email: "", loading: false };
  }
  render() {
    return (
      <div className="public_view login_view">
        <img
          className="banner"
          src={
            "https://res.cloudinary.com/hq02xjols/image/upload/v1626700274/logo1.png"
          }
          width={230}
        />
        <Notifier />
        <form
          className="col-10 col-sm-5 col-md-4 col-lg-3 mx-auto"
          onSubmit={(e) => {
            e.preventDefault();
            this.setState({ loading: true });
            actions
              .remind(this.state.email, this.props.history)
              .then(() => this.setState({ loading: false }))
              .catch(() => this.setState({ loading: false }));
          }}
        >
          <div className="mb-4" style={{ fontSize: 18 }}>
            <span>
              Enter the email address associated with your account to reset your
              password. You may need to check your spam/junk folder.
            </span>
          </div>

          <div className="form-group">
            <input
              type="email"
              style={{ fontSize: 18 }}
              className="form-control rounded"
              aria-describedby="emailHelp"
              placeholder="Email"
              value={this.state.email}
              onChange={(e) => this.setState({ email: e.target.value })}
            />
          </div>
          {this.state.loading ? (
            <button
              type="submit"
              className="btn btn-default w-100"
              style={{ fontSize: 18, fontWeight: 900 }}
              disabled
            >
              Loading...
            </button>
          ) : (
            <button
              type="submit"
              className="btn btn-primary w-100"
              style={{ fontSize: 18, fontWeight: 900 }}
            >
              Send Reset Link
            </button>
          )}
          <div className="extra-actions mt-4">
            <Link
              to="/login"
              className="float-left mt-2"
              style={{ fontSize: 18, textDecoration: "underline" }}
            >
              Back to login
            </Link>
          </div>
        </form>
      </div>
    );
  }
}
Forgot.propTypes = {
  history: PropTypes.object,
};

export class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    const urlVariables = qs.parse(props.location.search);
    this.state = {
      password: "",
      repPassword: "",
      token: urlVariables.reset_token || "",
      error: null,
      loading: false,
    };
  }
  render() {
    return (
      <div className="row mt-5">
        <div className="col-12 col-sm-10 col-md-9 col-lg-8 col-xl-6 mx-auto">
          <p className="m-0 text-center">
            <img className="banner w-75 mx-auto" src={loginBanner} />
          </p>
          <h2 className="my-4 text-center">Change Your Password</h2>
          <p className="text-center">
            Use only letters, numbers, and common symbols. Avoid spaces at the
            start and end.
          </p>
          <form
            className="col-12 col-lg-10 mx-auto"
            onSubmit={(e) => {
              e.preventDefault();
              this.setState({ error: null });
              if (this.state.password != this.state.repPassword)
                this.setState({
                  error: `Your passwords don't match`,
                  loading: false,
                });
              else {
                this.setState({ loading: true });
                actions
                  .resetPassword(
                    {
                      new_password: this.state.password,
                      token: this.state.token,
                    },
                    this.props.history
                  )
                  .then(() => this.setState({ loading: false, error: null }))
                  .catch((error) => this.setState({ loading: false, error }));
              }
            }}
          >
            {this.state.error && (
              <div className="alert alert-danger">{this.state.error}</div>
            )}
            <div className="form-group">
              <input
                type="password"
                className="form-control rounded"
                id="exampleInputPassword1"
                placeholder="Password"
                onChange={(e) =>
                  this.setState({ password: e.target.value, error: null })
                }
                value={this.state.password}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control rounded"
                id="exampleInputPassword1"
                placeholder="Repeat your password"
                onChange={(e) =>
                  this.setState({ repPassword: e.target.value, error: null })
                }
                value={this.state.repPassword}
              />
            </div>
            {this.state.loading ? (
              <button
                type="submit"
                className="btn btn-secondary form-control"
                disabled={true}
              >
                Loading...
              </button>
            ) : this.state.error ? (
              <button
                type="submit"
                className="btn btn-danger form-control"
                disabled={true}
              >
                Check errors above
              </button>
            ) : (
              <button type="submit" className="btn btn-primary form-control">
                Reset Password
              </button>
            )}
          </form>
        </div>
      </div>
    );
  }
}
ResetPassword.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
};
export class Invite extends React.Component {
  constructor(props) {
    super(props);
    const urlVariables = qs.parse(props.location.search);
    this.state = {
      email: "",
      password: "",
      repPassword: "",
      first_name: "",
      last_name: "",
      employer: urlVariables.employer || urlVariables.company || undefined,
      token: urlVariables.token_invite || "",
      employer_role: urlVariables.employer_role || "",
      error: null,
      loading: false,
    };
  }
  render() {
    return (
      <div className="row mt-5">
        <div className="col-12 col-sm-10 col-md-9 col-lg-8 col-xl-6 mx-auto">
          <p className="m-0 text-center">
            <img className="banner w-75 mx-auto" src={loginBanner} />
          </p>
          <h2 className="my-4 text-center">
            Sign Up to Jobcore and start making money with dozens of job offers
            every day
          </h2>
          <form
            className="col-12 col-lg-10 mx-auto"
            onSubmit={(e) => {
              e.preventDefault();
              this.setState({ error: null });
              if (this.state.password != this.state.repPassword)
                this.setState({
                  error: `Your passwords don't match`,
                  loading: false,
                });
              else {
                this.setState({ loading: true });
                actions
                  .signup(
                    {
                      email: this.state.email,
                      password: this.state.password,
                      first_name: this.state.first_name,
                      last_name: this.state.last_name,
                      token: this.state.token,
                      employer: this.state.employer || undefined,
                      employer_role: this.state.employer_role || undefined,
                      account_type: this.state.employer
                        ? "employer"
                        : "employee",
                    },
                    this.props.history
                  )
                  .then(() => this.setState({ loading: false, error: null }))
                  .catch((error) => this.setState({ loading: false, error }));
              }
            }}
          >
            {this.state.error && (
              <div className="alert alert-danger">{this.state.error}</div>
            )}
            <div className="form-group">
              <input
                type="text"
                style={{ fontSize: 18 }}
                className="form-control rounded"
                aria-describedby="emailHelp"
                placeholder="First Name"
                onChange={(e) =>
                  this.setState({ first_name: e.target.value, error: null })
                }
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                style={{ fontSize: 18 }}
                className="form-control rounded"
                aria-describedby="emailHelp"
                placeholder="Last Name"
                onChange={(e) =>
                  this.setState({ last_name: e.target.value, error: null })
                }
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                style={{ fontSize: 18 }}
                className="form-control rounded"
                aria-describedby="emailHelp"
                placeholder="Email"
                value={this.state.email}
                onChange={(e) =>
                  this.setState({ email: e.target.value, error: null })
                }
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                style={{ fontSize: 18 }}
                className="form-control rounded"
                id="exampleInputPassword1"
                placeholder="Password"
                onChange={(e) =>
                  this.setState({ password: e.target.value, error: null })
                }
                value={this.state.password}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                style={{ fontSize: 18 }}
                className="form-control rounded"
                id="exampleInputPassword1"
                placeholder="Repeat your password"
                onChange={(e) =>
                  this.setState({ repPassword: e.target.value, error: null })
                }
                value={this.state.repPassword}
              />
            </div>
            {this.state.loading ? (
              <button
                type="submit"
                className="btn btn-secondary form-control"
                disabled={true}
              >
                Loading...
              </button>
            ) : this.state.error ? (
              <button
                type="submit"
                className="btn btn-danger form-control"
                disabled={true}
              >
                Check errors above
              </button>
            ) : (
              <button type="submit" className="btn btn-primary form-control">
                Sign up
              </button>
            )}
          </form>
        </div>
      </div>
    );
  }
}
Invite.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
};

Subscribe.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
};
