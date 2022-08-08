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
import Gleap from 'gleap';



const Welcome = (props) => {
	return (
		// <div className="public_view login_view px-0">
		<div className="public_view">
			<div className="loginLogo">
				<img
					className="banner logo mt-5 p-5"
					src={
					"https://res.cloudinary.com/hq02xjols/image/upload/v1626700274/logo1.png"
					}
					width={600}
				/>
			</div>
			<div>
				<div className="row mt-5">
					<div className="col"></div>
					<div  className="col-4 text-justify">
						<h3 className="my-5">Your payment has been ACCEPTED and a JobCore account has been created for you
						</h3>
						<h3>You are about to find the most dynamic and effective market place for savvy job seekers and hospitality companies.
						</h3>
					</div>
					<div className="col"></div>
				</div>
			</div>
			<div className="row mt-5">
				<div className="col"></div>
				<div id="LoginLink" className="col-4 h5 m-5 py-3 px-0 w-50 shadow">
					<Link  to="/home" >Let's start! take me to the dashboard</Link>
				</div>
				<div className="col"></div>
			</div>
			<div className="row ">
				<div className="col mt-5">
				<button
					// href="https://c5q5lw7ly6i.typeform.com/to/hCgUTpnJ"
					onClick={ () => Gleap.open()}  
					id="Feedback"
					className=" p-2"
					style={{ fontSize: 18 }}
				>
					Report an issue here
				</button>
				</div>
			</div>
		</div>
	)}
export default Welcome;