import React, { useState, useEffect, useContext } from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import PropTypes from "prop-types";
import {
  store,
  search,
  update,
  fetchSingle,
  searchMe,
  processPendingPayrollPeriods,
  updateProfileMe,
  updatePayments,
  createPayment,
  fetchAllMe,
  fetchTemporal,
  remove,
  create,
  fetchPeyrollPeriodPayments,
} from "../actions.js";
import { Session } from "bc-react-session";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { PDFDocument, rgb } from "pdf-lib";
import { saveAs } from "file-saver";
import fw4 from "../../img/fw4.pdf";
import i9form from "../../img/i92.pdf";
import loadingURL from "../../img/loading2.gif";

import DateTime from "react-datetime";
import moment from "moment";
import {
  DATETIME_FORMAT,
  TIME_FORMAT,
  NOW,
  TODAY,
  haversineDistance,
} from "../components/utils.js";
import Select from "react-select";
import { hasTutorial } from "../utils/tutorial";

import { Notify } from "bc-react-notifier";

import { Shift, EditOrAddShift } from "./shifts.js";
import { Employer } from "./profile.js";
import { ManageLocations, AddOrEditLocation, Location } from "./locations.js";
import {
  EmployeeExtendedCard,
  ShiftOption,
  ShiftCard,
  DeductionExtendedCard,
  Theme,
  Button,
  ShiftOptionSelected,
  GenericCard,
  SearchCatalogSelect,
  Avatar,
  Toggle,
  Wizard,
  StarRating,
  ListCard,
} from "../components/index";
import queryString, { parse } from "query-string";

import TimePicker from "rc-time-picker";
import "rc-time-picker/assets/index.css";

import Tooltip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap_white.css";

import GoogleMapReact from "google-map-react";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { Document, Page } from "react-pdf";
import TextareaAutosize from "react-textarea-autosize";
import { PayrollPeriodReport } from "./reports/index.js";
import { times } from "underscore";
import { POST, GET, PUT, DELETE, PUTFiles, POSTcsrf } from "../utils/api_wrapper";
import { updateDocs, updateEmployability } from "../actions.js";

const ENTITIY_NAME = "payroll";

  
  export const CheckEmployeeDocuments = (props) => {
    const [startDate, setStartDate] = useState(false);
    const [form, setForm] = useState("");
    const [formLoading, setFormLoading] = useState(false);

    async function getEmployeeDocumet(emp, type) {
      setFormLoading(true);
      setForm(null);
      const id = emp.employee.id;
  
      const w4form = await GET("employers/me/" + "w4-form" + "/" + id);
      const i9form = await GET("employers/me/" + "i9-form" + "/" + id);
      const employeeDocument = await GET(
        "employers/me/" + "employee-documents" + "/" + id
      );
      
      const data = {
        w4form: w4form[0],
        i9form: i9form[0],
        employeeDocument: employeeDocument[0] || "",
        employeeDocument2: employeeDocument[1] || "",
      };
      if (type === "w4") fillForm(data);
      else if (type === "i9") fillFormI9(data);
      
    }
    async function fillForm(data) {
      if (data) {
        const signature = data.w4form.employee_signature;
        const png = `data:image/png;base64,${signature}`;
        const formUrl =
          "https://api.vercel.com/now/files/20f93230bb41a5571f15a12ca0db1d5b20dd9ce28ca9867d20ca45f6651cca0f/fw4.pdf";
  
        const formPdfBytes = await fetch(formUrl).then((res) =>
          res.arrayBuffer()
        );
        const pngUrl = png;
  
        var pngImageBytes;
        var pdfDoc = await PDFDocument.load(formPdfBytes);
        var pngImage;
        if (signature) {
          pngImageBytes = await fetch(pngUrl).then((res) => res.arrayBuffer());
  
          pngImage = await pdfDoc.embedPng(pngImageBytes);
        }
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
  
        const { width, height } = firstPage.getSize();
  
        const form = pdfDoc.getForm();
  
        var pngDims;
        if (pngImage) pngDims = pngImage.scale(0.18);
  
        const nameField = form.getTextField(
          "topmostSubform[0].Page1[0].Step1a[0].f1_01[0]"
        );
        const lastNameField = form.getTextField(
          "topmostSubform[0].Page1[0].Step1a[0].f1_02[0]"
        );
        const socialSecurityField = form.getTextField(
          "topmostSubform[0].Page1[0].f1_05[0]"
        );
        const addressField = form.getTextField(
          "topmostSubform[0].Page1[0].Step1a[0].f1_03[0]"
        );
        const cityField = form.getTextField(
          "topmostSubform[0].Page1[0].Step1a[0].f1_04[0]"
        );
        const fillingFieldSingle = form.getCheckBox(
          "topmostSubform[0].Page1[0].c1_1[0]"
        );
        const fillingFieldMarried = form.getCheckBox(
          "topmostSubform[0].Page1[0].c1_1[1]"
        );
        const fillingFieldHead = form.getCheckBox(
          "topmostSubform[0].Page1[0].c1_1[2]"
        );
        const multipleJobsField = form.getCheckBox(
          "topmostSubform[0].Page1[0].Step2c[0].c1_2[0]"
        );
        const step3aField = form.getTextField(
          "topmostSubform[0].Page1[0].Step3_ReadOrder[0].f1_06[0]"
        );
        const step3bField = form.getTextField(
          "topmostSubform[0].Page1[0].Step3_ReadOrder[0].f1_07[0]"
        );
        const step3cField = form.getTextField(
          "topmostSubform[0].Page1[0].f1_08[0]"
        );
        const step4aField = form.getTextField(
          "topmostSubform[0].Page1[0].f1_09[0]"
        );
        const step4bField = form.getTextField(
          "topmostSubform[0].Page1[0].f1_10[0]"
        );
        const step4cField = form.getTextField(
          "topmostSubform[0].Page1[0].f1_11[0]"
        );
        const employerField = form.getTextField(
          "topmostSubform[0].Page1[0].f1_13[0]"
        );
        const employmentDateField = form.getTextField(
          "topmostSubform[0].Page1[0].f1_14[0]"
        );
        const einField = form.getTextField("topmostSubform[0].Page1[0].f1_15[0]");
  
        nameField.setText(data.i9form.first_name);
        lastNameField.setText(data.i9form.last_name);
        socialSecurityField.setText(data.i9form.social_security);
        addressField.setText(data.i9form.address);
        cityField.setText(data.i9form.city);
  
        if (data.w4form.filing_status == "SINGLE") fillingFieldSingle.check();
        else if (data.w4form.filing_status == "MARRIED")
          fillingFieldMarried.check();
        else if (data.w4form.filing_status == "HEAD") fillingFieldHead.check();
  
        if (data.w4form.step2c) multipleJobsField.check();
  
        step3aField.setText(data.w4form.dependant3b);
        step3bField.setText(data.w4form.dependant3c);
  
        if (data.w4form.dependant3b && data.w4form.dependant3c) {
          var totalDependant =
            +data.w4form.dependant3b + +data.w4form.dependant3c;
          step3cField.setText(totalDependant.toString());
        }
  
        step4aField.setText(data.w4form.step4a);
        step4bField.setText(data.w4form.step4b);
        step4cField.setText(data.w4form.step4c);
        employerField.setText(
          "JobCore Inc, 270 Catalonia AveCoral Gables, FL 33134"
        );
        employmentDateField.setText(
          moment(data.w4form.updated_at).format("MM/DD/YYYY")
        );
        einField.setText("83-1919066");
  
        firstPage.drawText(moment(data.w4form.created_at).format("MM/DD/YYYY"), {
          x: 470,
          y: firstPage.getHeight() / 5.5,
          size: 14,
          color: rgb(0, 0, 0),
        });
  
        if (pngImage) {
          firstPage.drawImage(pngImage, {
            x: firstPage.getWidth() / 7 - pngDims.width / 2 + 75,
            y: firstPage.getHeight() / 4.25 - pngDims.height,
            width: pngDims.width,
            height: pngDims.height,
          });
        }
  
        const pdfBytes = await pdfDoc.save();
        var blob = new Blob([pdfBytes], { type: "application/pdf" });
  
        const fileURL = URL.createObjectURL(blob);
        setForm(fileURL);
        setFormLoading(false);
  
        //   window.open(blob);
        //   saveAs(blob, `${data.i9form.first_name + "_" + data.i9form.last_name+"_W4"}.pdf`);
      }
    }
    async function fillFormI9(data) {
      if (data) {
        const signature = data.i9form.employee_signature;
        const png = `data:image/png;base64,${signature}`;
        const formUrl =
          "https://api.vercel.com/now/files/5032a373d2e112174680444f0aac149210e4ac4c3c3b55144913e319cfa72bd4/i92.pdf";
        const formPdfBytes = await fetch(formUrl).then((res) =>
          res.arrayBuffer()
        );
  
        const pngUrl = png;
        var pngImageBytes;
        var pngImage;
        const pdfDoc = await PDFDocument.load(formPdfBytes);
        if (signature) {
          pngImageBytes = await fetch(pngUrl).then((res) => res.arrayBuffer());
          pngImage = await pdfDoc.embedPng(pngImageBytes);
        }
  
        const document = data.employeeDocument.document;
        var documentBytes;
        var documentImage;
        if (document) {
          documentBytes = await fetch(document).then((res) => res.arrayBuffer());
          documentImage = await pdfDoc.embedJpg(documentBytes);
        }
        var document2Image = null;
        if (data.employeeDocument2) {
          const document2 = data.employeeDocument2.document;
          const document2Bytes = await fetch(document2).then((res) =>
            res.arrayBuffer()
          );
          document2Image = await pdfDoc.embedJpg(document2Bytes);
        }
        const newPage = pdfDoc.addPage();
  
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
  
        const { width, height } = firstPage.getSize();
  
        const form = pdfDoc.getForm();
  
        var pngDims;
  
        if (pngImage) pngDims = pngImage.scale(0.1);
  
        const lastname = form.getTextField(
          "topmostSubform[0].Page1[0].Last_Name_Family_Name[0]"
        );
        const name = form.getTextField(
          "topmostSubform[0].Page1[0].First_Name_Given_Name[0]"
        );
        const middle = form.getTextField(
          "topmostSubform[0].Page1[0].Middle_Initial[0]"
        );
        const otherlastname = form.getTextField(
          "topmostSubform[0].Page1[0].Other_Last_Names_Used_if_any[0]"
        );
        const address = form.getTextField(
          "topmostSubform[0].Page1[0].Address_Street_Number_and_Name[0]"
        );
        const apt = form.getTextField("topmostSubform[0].Page1[0].Apt_Number[0]");
        const city = form.getTextField(
          "topmostSubform[0].Page1[0].City_or_Town[0]"
        );
        const zip = form.getTextField("topmostSubform[0].Page1[0].ZIP_Code[0]");
        const birthday = form.getTextField(
          "topmostSubform[0].Page1[0].Date_of_Birth_mmddyyyy[0]"
        );
        const ssn3 = form.getTextField(
          "topmostSubform[0].Page1[0].U\\.S\\._Social_Security_Number__First_3_Numbers_[0]"
        );
        const ssn2 = form.getTextField(
          "topmostSubform[0].Page1[0].U\\.S\\._Social_Security_Number__Next_2_numbers_[0]"
        );
        const ssn4 = form.getTextField(
          "topmostSubform[0].Page1[0].U\\.S\\._Social_Security_Number__Last_4_numbers_[0]"
        );
        const email = form.getTextField(
          "topmostSubform[0].Page1[0].Employees_Email_Address[0]"
        );
        const tel = form.getTextField(
          "topmostSubform[0].Page1[0].Employees_Telephone_Number[0]"
        );
        const citizen = form.getCheckBox(
          "topmostSubform[0].Page1[0]._1\\._A_citizen_of_the_United_States[0]"
        );
        const noncitizen = form.getCheckBox(
          "topmostSubform[0].Page1[0]._2\\._A_noncitizen_national_of_the_United_States__See_instructions_[0]"
        );
        const resident = form.getCheckBox(
          "topmostSubform[0].Page1[0]._3\\._A_lawful_permanent_resident__Alien_Registration_Number_USCIS_Number__[0]"
        );
        const uscis = form.getTextField(
          "topmostSubform[0].Page1[0].Alien_Registration_NumberUSCIS_Number_1[0]"
        );
        const alien = form.getCheckBox(
          "topmostSubform[0].Page1[0]._4\\._An_alien_authorized_to_work_until__expiration_date__if_applicable__mmd_dd_yyyy__[0]"
        );
        const exp = form.getTextField(
          "topmostSubform[0].Page1[0].expiration_date__if_applicable__mm_dd_yyyy[0]"
        );
        const alienuscis = form.getTextField(
          "topmostSubform[0].Page1[0]._1_Alien_Registration_NumberUSCIS_Number[0]"
        );
        const admision = form.getTextField(
          "topmostSubform[0].Page1[0]._2_Form_I94_Admission_Number[0]"
        );
        const foreign = form.getTextField(
          "topmostSubform[0].Page1[0]._3_Foreign_Passport_Number[0]"
        );
        const issuance = form.getTextField(
          "topmostSubform[0].Page1[0].Country_of_Issuance[0]"
        );
        const nottranslator = form.getCheckBox(
          "topmostSubform[0].Page1[0].I_did_not_use_a_preparer_or_translator[0]"
        );
        const translator = form.getCheckBox(
          "topmostSubform[0].Page1[0].A_preparer_s__and_or_translator_s__assisted_the_employee_in_completing_Section_1[0]"
        );
        const lastnamet = form.getTextField(
          "topmostSubform[0].Page1[0].Last_Name_Family_Name_2[0]"
        );
        const firstnamet = form.getTextField(
          "topmostSubform[0].Page1[0].First_Name_Given_Name_2[0]"
        );
        const addresst = form.getTextField(
          "topmostSubform[0].Page1[0].Address_Street_Number_and_Name_2[0]"
        );
        const cityt = form.getTextField(
          "topmostSubform[0].Page1[0].City_or_Town_2[0]"
        );
        const zipcodet = form.getTextField(
          "topmostSubform[0].Page1[0].Zip_Code[0]"
        );
        const statet = form.getDropdown("topmostSubform[0].Page1[0].State[0]");
        const state2t = form.getDropdown("topmostSubform[0].Page1[0].State[1]");
        const lastname2 = form.getTextField(
          "topmostSubform[0].Page2[0].Last_Name_Family_Name_3[0]"
        );
        const firstname2 = form.getTextField(
          "topmostSubform[0].Page2[0].First_Name_Given_Name_3[0]"
        );
        const middle2 = form.getTextField("topmostSubform[0].Page2[0].MI[0]");
  
        lastname.setText(data.i9form.last_name);
        name.setText(data.i9form.first_name);
        middle.setText(data.i9form.middle_initial);
        otherlastname.setText(data.i9form.other_last_name);
        address.setText(data.i9form.address);
        apt.setText(data.i9form.apt_number);
        city.setText(data.i9form.city);
        zip.setText(data.i9form.zipcode);
        birthday.setText(data.i9form.date_of_birth);
  
        if (data.i9form.social_security) {
          var ssn = data.i9form.social_security.split("-");
          ssn3.setText(ssn[0]);
          ssn2.setText(ssn[1]);
          ssn4.setText(ssn[2]);
        }
  
        email.setText(data.i9form.email);
        tel.setText(data.i9form.phone);
        if (data.i9form.employee_attestation === "CITIZEN") citizen.check();
        else if (data.i9form.employee_attestation === "NON_CITIZEN")
          noncitizen.check();
        else if (data.i9form.employee_attestation === "ALIEN") alien.check();
        else if (data.i9form.employee_attestation === "RESIDENT")
          resident.check();
  
        uscis.setText(data.i9form.USCIS);
        exp.setText("");
        alienuscis.setText(data.i9form.USCIS);
        admision.setText(data.i9form.I_94);
        foreign.setText(data.i9form.passport_number);
        issuance.setText(data.i9form.country_issuance);
  
        if (!data.i9form.translator) nottranslator.check();
        else if (!data.i9form.translator) translator.check();
  
        lastnamet.setText(data.i9form.translator_last_name);
        firstnamet.setText(data.i9form.translator_first_name);
        addresst.setText(data.i9form.translator_address);
        cityt.setText(data.i9form.translator_city);
        zipcodet.setText(data.i9form.translator_zipcode);
        if (data.i9form.translator_state) {
          statet.select(data.i9form.translator_state);
          state2t.select(data.i9form.translator_state);
        }
        lastname2.setText(data.i9form.last_name);
        firstname2.setText(data.i9form.first_name);
        middle2.setText(data.i9form.middle_initial);
  
        if (documentImage) {
          pages[3].drawImage(documentImage, {
            height: 325,
            width: 275,
            x: 50,
            y: 790 - 325,
          });
        }
  
        if (document2Image) {
          pages[3].drawImage(document2Image, {
            height: 325,
            width: 275,
            x: 50,
            y: 790 - 325 - 350,
          });
        }
        firstPage.drawText(moment(data.w4form.created_at).format("MM/DD/YYYY"), {
          x: 375,
          y: 257,
          size: 10,
          color: rgb(0, 0, 0),
        });
  
        if (pngImage) {
          firstPage.drawImage(pngImage, {
            x: 115,
            y: 240,
            width: pngDims.width,
            height: pngDims.height,
          });
        }
  
        const pdfBytes = await pdfDoc.save();
        var blob = new Blob([pdfBytes], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(blob);
        setForm(fileURL);
        setFormLoading(false);
        //   saveAs(blob, `${data.i9form.first_name + "_" + data.i9form.last_name+"_I9"+moment().format("MMDDYYYY")}.pdf`);
      }
    }
    const [DocStatus, setDocStatus] = useState("NOT_APPROVED");
    function AproveDocs() {      
      const today = new Date()
      const empDate = new Date(props.catalog.employee.employability_expired_at)
      if (empDate.getTime()<today.getTime()) {
        props.catalog.employee.employment_verification_status = "NOT_APPROVED"
        setDocStatus(props.catalog.employee.employment_verification_status)
        updateDocs(props)
        window.location.reload(false)
        return Notify.error(`${props.catalog.employee.user.first_name} ${props.catalog.employee.user.last_name} Documents ${props.catalog.employee.employment_verification_status} they are expired`)
      } else {
        props.catalog.employee.employment_verification_status = "APPROVED"
        setDocStatus(props.catalog.employee.employment_verification_status)
        updateDocs(props)
        window.location.reload(false)
        return Notify.success(`${props.catalog.employee.user.first_name} ${props.catalog.employee.user.last_name} Documents ${props.catalog.employee.employment_verification_status}`)
      }
    }
    function RejectDocs() {
      Notify.error("Employee Documents Rejected")
      const today = new Date()
      props.catalog.employee.employability_expired_at = today
      props.catalog.employee.employment_verification_status = "NOT_APPROVED"
      setDocStatus(props.catalog.employee.employment_verification_status)
      updateDocs(props)
      window.location.reload(false)
    }
    useEffect(() => {
      setDocStatus(props.catalog.employee.employment_verification_status)
    }, [DocStatus]);
    
   

    return (
          <div>
                    <div
                      className="modal fade"
                      id="exampleModalCenter"
                      tabIndex="-1"
                      role="dialog"
                      aria-labelledby="exampleModalCenterTitle"
                      aria-hidden="true"
                      data-backdrop="false"
                      backdrop="true"
                    > <button 
                    type="button" 
                    class="close btn-lg" 
                    data-dismiss="modal"
                    style={{ width: "100px" }}
                    >&times;</button>
                      <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                          {form ? ( 
                            <iframe 
                            src={form}
                            style={{ width: "800px", height: "900px" }}
                            frameBorder="0"
                            ></iframe>
                          ) : (
                          <div className="spinner-border text-center mx-auto" role="status">
                            <span className="sr-only">Loading...</span>
                          </div>
                          )}
                        </div>
                      </div>
                      </div>
                      <form>
                      <div className="row">
                      <div className="col-12">
                      <label>The documents of the selected employee are listed below.</label>
                      <label>You can click on each one to verify them:</label>
                      <div className="row" style={{ marginLeft: "30px", marginTop: "20px", marginBottom: "20px" }}>
                            <div className="col-6 pr-0">
                              
                              { 
                                // props.catalog.employee.employment_verification_status 
                                DocStatus === "APPROVED" 
                                  ? (
                                  <span
                                    style={{ cursor: "pointer" }}
                                    data-toggle="modal"
                                    data-target="#exampleModalCenter"
                                    onClick={() => {
                                      // Notify.info("Press ESC to close this window")
                                      if (!formLoading) getEmployeeDocumet(props.catalog, "w4");
                                    }}
                                  >
                                    <i
                                      style={{ fontSize: "16px", color: "#43A047" }}
                                      className="fas fa-file-alt mr-1"
                                    ></i>
                                    {!formLoading ? "W-4 Form" : "Loading"}
                                  </span>
                                ) : (DocStatus != "APPROVED" 
                                ? (
                                  <span className="text-muted"
                                    style={{ cursor: "pointer" }}
                                    data-toggle="modal"
                                    data-target="#exampleModalCenter"
                                    onClick={() => {
                                      // Notify.info("Press ESC to close this window")
                                      if (!formLoading) getEmployeeDocumet(props.catalog, "w4");
                                    }}
                                  >
                                    <i style={{ fontSize: "15px", color: "#FFD600" }} className="fas fa-exclamation-circle mr-1"></i>
                                    {!formLoading ? "W-4 Form" : "Loading"}
                                  </span>
                                ) : ( 
                                <span className="text-muted"
                                style={{ cursor: "pointer" }}
                                data-toggle="modal"
                                data-target="#exampleModalCenter"
                                onClick={() => {
                                  // Notify.info("Press ESC to close this window")
                                  if (!formLoading) getEmployeeDocumet(props.catalog, "w4");
                                }}
                              >
                                <i className="fas fa-exclamation-circle text-danger mr-1"></i>
                                {!formLoading ? "W-4 Form" : "Loading"}
                              </span> ))}
                            </div>
                    
                            <div className="col-6 pr-0">
                                {
                              // props.catalog.employee.employment_verification_status 
                              DocStatus === "APPROVED" 
                                ? (
                                  <span
                                    style={{ cursor: "pointer" }}
                                    data-toggle="modal"
                                    data-target="#exampleModalCenter"
                                    onClick={() => {
                                      if (!formLoading) getEmployeeDocumet(props.catalog, "i9");
                                    
                                    }}
                                  >
                                    <i
                                      style={{ fontSize: "16px", color: "#43A047" }}
                                      className="fas fa-file-alt mr-1"
                                    ></i>
                                    {!formLoading ? "I-9 and others" : "Loading"}
                                  </span>
                                ) : (DocStatus != "APPROVED" 
                                ? (
                                  <span className="text-muted"
                                    style={{ cursor: "pointer" }}
                                    data-toggle="modal"
                                    data-target="#exampleModalCenter"
                                    onClick={() => {
                                      if (!formLoading) getEmployeeDocumet(props.catalog, "i9");
                                    }}
                                  >
                                    <i style={{ fontSize: "15px", color: "#FFD600" }} className="fas fa-exclamation-circle mr-1"></i>
                                    {!formLoading ? "I-9 and others" : "Loading"}
                                  </span>
                                ) : (
                                  <span className="text-muted"
                                    style={{ cursor: "pointer" }}
                                    data-toggle="modal"
                                    data-target="#exampleModalCenter"
                                    onClick={() => {
                                      if (!formLoading) getEmployeeDocumet(props.catalog, "i9");
                                    }}
                                  >
                                    <i className="fas fa-exclamation-circle text-danger mr-1"></i>
                                    {!formLoading ? "I-9 and others" : "Loading"}
                                  </span>
                                ))}
                          
                      </div>
                  </div>
                </div>
              </div> 
              <p>If you see a yellow icon <i style={{ fontSize: "15px", color: "#FFD600" }} className="fas fa-exclamation-circle mr-1">
                </i> means that the document is waiting for approval, a red icon <i className="fas fa-exclamation-circle text-danger mr-1">
                </i> means the document is not approved, while if you see a green icon  <i 
                style={{ fontSize: "16px", color: "#43A047" }} className="fas fa-file-alt mr-1">
                </i> the document is approved</p>
              <p>When you're ready, accept or reject the employee's documents at your discretion.</p>
              <p>if the job seeker has eligibility to work permanently (US citizen) use the "approve documents" button without choosing any date.</p>
              <div className="btn-bar">
                  <Button id="aproveBtn" color="secondary" onClick={() => 
                    AproveDocs() 
                    }>Approve Documents</Button>
              </div>
              <div className="d-flex justify-content-center p-2">
                <label className="mr-1">Documents will be approved until date:</label>
                <DatePicker 
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Pick a date"
                  selected={new Date("2100-06-01")} 
                  onChange={(date) => { 
                    props.catalog.employee.employability_expired_at = date
                    updateEmployability(props)
                    setStartDate(date)
                    let aproveBtn = document.getElementById("aproveBtn");
                    aproveBtn.style["background-color"] = "green"
                  }} 
                  className="mt-2 text-center w-75 ml-4"
                />
              </div>
              <div className="btn-bar">
                  <Button color="danger" onClick={() => 
                    RejectDocs()
                    }>Reject Documents</Button>
              </div>
              
            </form>
          </div>);
};

CheckEmployeeDocuments.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  formData: PropTypes.object,
  catalog: PropTypes.object //contains the data needed for the form to load
};