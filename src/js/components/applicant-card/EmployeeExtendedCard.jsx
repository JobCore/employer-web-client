import './style.scss';
import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import Avatar from '../avatar';
import Stars from '../stars';
import { GET } from "../../utils/api_wrapper.js";
import { PDFDocument, rgb } from "pdf-lib";
import moment from "moment";
import { Notify } from "bc-react-notifier";
import "rc-time-picker/assets/index.css";
import "rc-tooltip/assets/bootstrap_white.css";
import  Theme from "../theme"
/** 
 * Applican Card
 */
const EmployeeExtendedCard = (props) => {
    const positions =  !props.positions ? null : props.employee.positions.slice(0, 4).map((p, i) => {
        return props.positions.find(pos => p == pos.value || p.id == pos.value);
    });

    const badgesHTML = !props.employee.badges ? [] : props.employee.badges.map((b, i) => (<span key={i} className="badge">{b.title}</span>));
    const favoriteCount = !Array.isArray(props.employee.favoritelist_set) ? 0 :props.employee.favoritelist_set.length;

    const picture = props.employee && props.employee.user && props.employee.user.profile && props.employee.user.profile.picture ?props.employee.user.profile.picture : "" ; 
    const DocStatus = props.employee.employment_verification_status
    const [form, setForm] = useState(props.form);
    const [formLoading, setFormLoading] = useState(props.formLoading);
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
        console.log('dataI9###', data)
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
    // const [DocStatus, setDocStatus] = useState("");
    // useEffect(() => {
    //   props.defineEmployee()
    // }, []);
    return (
    <li className={`aplicantcard ${props.hoverEffect ? "aplicantcard-hover":""} ${props.showButtonsOnHover ? "show-hover":""} ${props.className}`} onClick={() => (props.onClick) ? props.onClick() : false}>
      <Theme.Consumer>
      {({ bar }) => ( <div className=''>
        {/* <Avatar url={props.employee.user ? props.employee.user.profile.picture : ""} /> */}
        <Avatar url={picture} />
        <div className="row">
            <div className="col-2.5 p-2">
                <a href="#"><b>{props.employee.user.first_name + ' ' + props.employee.user.last_name}</b></a>
                <Stars rating={Number(props.employee.rating)} jobCount={props.employee.total_ratings}  />
                { (props.showFavlist) ?
                    <p href="#">{ (favoriteCount > 0) ? <span className="badge badge-warning"><i className="fas fa-star"></i> {favoriteCount} Lists</span> : '' } {badgesHTML}</p>
                  :''
              }
            </div>
            <div className="mt-2" 
              onMouseEnter={(e) => {
                console.log("button hovered");
                props.defineEmployee()
              }}
            >
            { 
            // props.catalog.employee.employment_verification_status 
            DocStatus === "APPROVED"  
              ? (
              <span className="mr-2"
                style={{ cursor: "pointer" }}
                data-toggle="modal"
                data-target="#exampleModalCenter"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("button clicked");
                  console.log("props dentro", props);
                  // Notify.info("Press ESC to close this window")
                  // if (!props.formLoading) getEmployeeDocumet(props, "w4");
                  bar.show({
                    slug: "check_employee_documents2",
                    data: props.employee,
                    allowLevels: true,
                  })
                }}
              >
                <i
                  style={{ fontSize: "16px", color: "#43A047"}}
                  className="fas fa-file-alt mr-1"
                ></i>
                {true ? "W4" : "Loading"}
              </span>
            ) : ( DocStatus === "MISSING_DOCUMENTS" 
            ? ( 
              <span className="text-muted mr-3"
                style={{ cursor: "pointer"}}
                data-toggle="modal"
                data-target="#exampleModalCenter"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("button clicked");
                  // Notify.info("Press ESC to close this window")
                  // if (!props.formLoading) getEmployeeDocumet(props, "w4");
                  bar.show({
                    slug: "check_employee_documents2",
                    data: props.employee,
                    allowLevels: true,
                  })
                }}
              >
                <i style={{ fontSize: "15px", color: "#FFD600" }} className="fas fa-exclamation-circle mr-1"></i>
                {true ? "W4" : "Loading"}
              </span>
            ) : ( 
              <span className="text-muted mr-3"
                style={{ cursor: "pointer"}}
                data-toggle="modal"
                data-target="#exampleModalCenter"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("button clicked");
                  // Notify.info("Press ESC to close this window")
                  // if (!props.formLoading) getEmployeeDocumet(props, "w4");
                  bar.show({
                    slug: "check_employee_documents2",
                    data: props.employee,
                    allowLevels: true,
                  })
                }}
              >
                <i className="fas fa-exclamation-circle text-danger mr-1"></i>
                {true ? "W4" : "Loading"}
              </span>
            ))}
            { 
            // props.catalog.employee.employment_verification_status 
            DocStatus === "APPROVED" 
              ? (
              <span className="mr-2"
                style={{ cursor: "pointer" }}
                data-toggle="modal"
                data-target="#exampleModalCenter"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("button clicked");
                  // Notify.info("Press ESC to close this window")
                  // if (!props.formLoading) getEmployeeDocumet(props, "w4");
                  bar.show({
                    slug: "check_employee_documents2",
                    data: props.employee,
                    allowLevels: true,
                  })
                }}
              >
                <i
                  style={{ fontSize: "16px", color: "#43A047" }}
                  className="fas fa-file-alt mr-1"
                ></i>
                {true ? "I9" : "Loading"}
              </span>
            ) : ( DocStatus === "MISSING_DOCUMENTS" 
            ? ( 
              <span className="text-muted mr-3"
                style={{ cursor: "pointer" }}
                data-toggle="modal"
                data-target="#exampleModalCenter"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("button clicked");
                  // Notify.info("Press ESC to close this window")
                  // if (!props.formLoading) getEmployeeDocumet(props, "w4");
                  bar.show({
                    slug: "check_employee_documents2",
                    data: props.employee,
                    allowLevels: true,
                  })
                }}
              >
                <i style={{ fontSize: "15px", color: "#FFD600" }} className="fas fa-exclamation-circle mr-1"></i>
                {true ? "I9" : "Loading"}
              </span>
            ) : ( 
              <span className="text-muted mr-3"
                style={{ cursor: "pointer" }}
                data-toggle="modal"
                data-target="#exampleModalCenter"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("button clicked");
                  // Notify.info("Press ESC to close this window")
                  // if (!props.formLoading) getEmployeeDocumet(props, "w4");
                  bar.show({
                    slug: "check_employee_documents2",
                    data: props.employee,
                    allowLevels: true,
                  })
                }}
              >
                <i className="fas fa-exclamation-circle text-danger mr-1"></i>
                {true ? "I9" : "Loading"}
              </span>
            ))} 
            </div>
            {Array.isArray(positions) && positions.length > 0 ? (
                <div className="col-8 my-auto">
                    
                    { positions.map((pos, i)=> {
                        if(i < 3 && pos ) return (<span key={i} className="badge badge-success">{pos.label || pos.title}</span>);
                      }
                    )}
                    {Array.isArray(positions) && positions.length > 3 ? <span className="text-right ml-4">See more</span> : null}
                </div>
            ): null}

        </div>
  
 
        {(props.children) ?
            <div className="btn-group" role="group" aria-label="Basic example">
                {props.children}
            </div>
            :''
        }
       </div>
         )}
    </Theme.Consumer>
  </li>);
};
EmployeeExtendedCard.propTypes = {
  employee: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  showFavlist: PropTypes.bool,
  className: PropTypes.string,
  showButtonsOnHover: PropTypes.bool,
  hoverEffect: PropTypes.bool,
  onClick: PropTypes.func,
  defineEmployee: PropTypes.func,
  positions: PropTypes.array
};
EmployeeExtendedCard.defaultProps = {
  showFavlist: true,
  className:'',
  hoverEffect: true,
  showButtonsOnHover: true,
  children: null,
  onClick: null,
  positions: null
};

export default EmployeeExtendedCard;