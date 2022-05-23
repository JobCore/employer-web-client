import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
import PropTypes from "prop-types";
import { store, search, searchMe, fetchAllMe } from "../actions.js";
import { callback, hasTutorial } from "../utils/tutorial";
import {
  EmployeeExtendedCard,
  Avatar,
  Stars,
  Theme,
  Button,
  Wizard,
} from "../components/index";
import Select from "react-select";
import queryString from "query-string";
import { Session } from "bc-react-session";
import { Notify } from "bc-react-notifier";
import { ButtonGroup } from "reactstrap";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom"

//gets the querystring and creats a formData object to be used when opening the rightbar
export const getTalentInitialFilters = (catalog) => {
  let query = queryString.parse(window.location.search);
  if (typeof query == "undefined") return {};
  if (!Array.isArray(query.positions))
    query.positions =
      typeof query.positions == "undefined" ? [] : [query.positions];
  if (!Array.isArray(query.badges))
    query.badges = typeof query.badges == "undefined" ? [] : [query.badges];
  return {
    positions: query.positions.map((pId) =>
      catalog.positions.find((pos) => pos.value == pId)
    ),
    badges: query.badges.map((bId) =>
      catalog.badges.find((b) => b.value == bId)
    ),
    rating: catalog.stars.find((rate) => rate.value == query.rating),
  };
};

export const Talent = (data) => {
  const session = Session.getPayload();
  const _defaults = {
    //foo: 'bar',
    serialize: function () {
      const newShift = {
        //foo: 'bar'
        favoritelist_set: data.favoriteLists.map((fav) => fav.value),
      };

      return Object.assign(this, newShift);
    },
    unserialize: function () {
      this.fullName = function () {
        return this.user.first_name.length > 0
          ? this.user.first_name + " " + this.user.last_name
          : "No name specified";
      };
      if (typeof session.user.profile.employer != "undefined") {
        if (typeof this.favoriteLists == "undefined")
          this.favoriteLists = this.favoritelist_set.filter(
            (fav) => fav.employer == session.user.profile.employer
          );
        else {
          this.favoriteLists = this.favoritelist_set.map((fav) =>
            store.get("favlists", fav.id || fav)
          );
        }
      }

      return this;
    },
  };

  let _entity = Object.assign(_defaults, data);

  return {
    validate: () => {
      return _entity;
    },
    defaults: () => {
      return _defaults;
    },
    getFormData: () => {
      const _formShift = {
        id: _entity.id,
        favoriteLists: _entity.favoritelist_set.map((fav) => ({
          label: fav.title,
          value: fav.id,
        })),
      };
      return _formShift;
    },
    filters: () => {
      const _filters = {
        positions: _entity.positions.map((item) => item.value),
        rating:
          typeof _entity.rating == "object" ? _entity.rating.value : undefined,
        badges: _entity.badges.map((item) => item.value),
      };
      for (let key in _entity)
        if (typeof _entity[key] == "function") delete _entity[key];
      return Object.assign(_entity, _filters);
    },
  };
};

export const ShiftInvite = (data) => {
  const user = Session.getPayload().user;
  const _defaults = {
    //foo: 'bar',
    serialize: function () {
      const newShiftInvite = {
        //foo: 'bar'
        sender: user.id,
        shifts: data.shifts.map((s) => s.id || s.value.id),
        employees: data.employees,
      };

      return Object.assign(this, newShiftInvite);
    },
  };

  let _entity = Object.assign(_defaults, data);
  return {
    validate: () => {
      return _entity;
    },
    defaults: () => {
      return _defaults;
    },
    getFormData: () => {
      const _formShift = {
        employees: _entity.employees || [_entity.id],
        shifts: _entity.shifts,
      };
      return _formShift;
    },
    filters: () => {
      const _filters = {
        //positions: _entity.positions.map( item => item.value ),
      };
      for (let key in _entity)
        if (typeof _entity[key] == "function") delete _entity[key];
      return Object.assign(_entity, _filters);
    },
  };
};
     
export class ManageTalents extends Flux.DashView {
  constructor() {
    super();
    this.state = {
      // catalog: {this.state.catalog},
      DocStatus: "",
      empStatus: "unverified",
      form: "",
      formLoading: false,
      employees: [],
      runTutorial: hasTutorial(),
      pagination: {
        first: "",
        last: "",
        next: "",
        previous: "",
      },
      steps: [
        {
          target: "#talent_search_header",
          content: "In this page you can search our entire talent network",
          placement: "right",
        },
        {
          target: "#filter_talent",
          content:
            "Start by filtering by name, experience, badges or minium star rating",
          placement: "left",
        },
      ],
    };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    this.filter();
    
    const positions = store.getState("positions");

    if (!positions) {
      this.subscribe(store, "positions", (positions) => {
        this.setState({ positions });
      });
    } else this.setState({ positions });

    this.subscribe(store, "employees", (employees) => {
      if (Array.isArray(employees) && employees.length !== 0)
        this.setState({ employees });
    });
    const lists = store.getState("favlists");
    // this.subscribe(store, 'favlists', (lists) => {
    //     this.setState({ lists });
    // });
    if (!lists) fetchAllMe(["favlists"]);

    this.props.history.listen(() => {
      if (this.props.history.location.pathname == "/talents") this.filter("l");
      else this.setState({ firstSearch: false });
    });
    this.setState({ runTutorial: true });
    
    this.handleStatusChange
  }
  componentWillUnmount() {
    this.handleStatusChange
  }
  handleStatusChange() {
    this.setState({ DocStatus: props.catalog.employee.employment_verification_status });
  }
  filter(url) {
    // search('employees', window.location.search);
    let queries = window.location.search;

    if (queries) queries = "&" + queries.substring(1);
    if (url && url.length > 50) {
      const page = url.split("employees")[1];
      if (page) {
        search(`employees`, `${page + queries}`).then((data) => {
          this.setState({
            employees: data.results,
            pagination: data,
          });
        });
      } else null;
    } else {
      search(`employees`, `?envelope=true&limit=50${queries}`).then((data) => {
        this.setState({
          employees: data.results,
          pagination: data,
        });
      });
    }
  }
  
  
  render() {
    const employees = this.state.employees
    function checkEmployability(empl) {
      const today = new Date()
      const empDate = new Date(empl.employability_expired_at)
      if (empDate.getTime()<today.getTime()) {
        empl.employment_verification_status = "NOT_APPROVED"
        return "is NOT eligible to work"
      } else {
        return "it IS eligible to work"
      }
    }
    const today = new Date()
    console.log("empleados#########", employees.map(checkEmployability))
    const positions = this.state.positions;
    if (this.state.firstSearch) return <p>Please search for an employee</p>;
    const allowLevels = window.location.search != "";
    const filteredEmployeesList = (empStatus) => {
      if (empStatus==="rejected") {
        const notAprovedEmpList = employees.filter((employees) => employees.employment_verification_status==="NOT_APPROVED")
        return  notAprovedEmpList
      } else if (empStatus==="verified") {
        const verifiedEmpList = employees.filter((employees) => employees.employment_verification_status==="APPROVED")
        const sortedVerifiedEmpList = verifiedEmpList.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        return sortedVerifiedEmpList
      } else {
        const pendingEmpList = employees.filter((employees) => employees.employment_verification_status==="PENDING")
        const beingReviewedEmpList = employees.filter((employees) => employees.employment_verification_status==="BEING_REVIEWED")
        const missDocsEmpList = employees.filter((employees) => employees.employment_verification_status==="MISSING_DOCUMENTS")
        const unverifiedEmpList = pendingEmpList.concat(beingReviewedEmpList, missDocsEmpList)
        const sortedUnverifiedEmpList = unverifiedEmpList.slice().sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        return sortedUnverifiedEmpList
      }
    }
    const finalList = filteredEmployeesList(this.state.empStatus)
    return (
      <div className="p-1 listcontents">
        <Theme.Consumer>
          {({ bar }) => (
            <span>
              {/* <Wizard continuous
                      steps={this.state.steps}
                      run={this.state.runTutorial}
                      callback={callback}
                    /> */}
              <h1>
                <span id="talent_search_header">Talent Search</span>
              </h1>
              <div className="my-2">
                <button onClick={() => {this.setState({ empStatus: this.state.empStatus="rejected" }) 
                }} type="button" className="btn btn-secondary" style={this.state.empStatus==="rejected" ? {background:"red"} : {}}>Rejected</button>
                <button onClick={() => {this.setState({ empStatus: this.state.empStatus="verified" }) 
                }} type="button" className="btn btn-secondary" style={this.state.empStatus==="verified" ? {background:"green"} : {}}>Verified</button>
                <button onClick={() => {this.setState({ empStatus: this.state.empStatus="unverified" })
                }} type="button" className="btn btn-secondary" style={this.state.empStatus==="unverified" ? {background:"#FFDB58", color:"gray"} : {}}>Unverified</button>
              </div>
              {// this.state.employees.map((s, i) => (
                finalList.map((s, i) => (
                <EmployeeExtendedCard
                  form={this.state.form}
                  formLoading={this.state.formLoading}
                  key={i}
                  employee={s}
                  hover={true}
                  positions={positions}
                  onClick={(e) =>
                    bar.show({ slug: "show_single_talent", data: s })
                  }
                  defineEmployee={(e) =>
                    bar.show({ slug: "define_employee", data: s})
                  }
                >
                  <Button
                    className="btn btn-outline-dark"
                    onClick={() =>
                      bar.show({ slug: "add_to_favlist", data: s, allowLevels })
                    }
                  >
                    Add to Favorites
                  </Button>
                  <Button
                    className="btn btn-outline-dark"
                    onClick={() =>
                      bar.show({
                        slug: "invite_talent_to_shift",
                        data: s,
                        allowLevels,
                      })
                    }
                  >
                    Invite
                  </Button>
                </EmployeeExtendedCard>
              ))}
              
              <div className="row mt-4 justify-content-center">
                <div className="col">
                  <nav aria-label="Page navigation example">
                    <ul className="pagination">
                      {this.state.pagination.first && (
                        <li className="page-item">
                          <span
                            className="page-link"
                            aria-label="Previous"
                            style={{ cursor: "pointer", color: "black" }}
                            onClick={() =>
                              this.filter(this.state.pagination.first)
                            }
                          >
                            <span aria-hidden="true">
                              <i className="fas fa-chevron-left"></i>
                              <i className="fas fa-chevron-left"></i>
                            </span>
                            <span className="sr-only">{"First"}</span>
                          </span>
                        </li>
                      )}
                      {this.state.pagination.previous && (
                        <li className="page-item">
                          <span
                            className="page-link"
                            style={{ cursor: "pointer", color: "black" }}
                            onClick={() =>
                              this.filter(this.state.pagination.previous)
                            }
                          >
                            <i className="fas fa-chevron-left"></i>
                          </span>
                        </li>
                      )}
                      {this.state.pagination.next && (
                        <li className="page-item">
                          <span
                            className="page-link"
                            style={{ cursor: "pointer", color: "black" }}
                            onClick={() =>
                              this.filter(this.state.pagination.next)
                            }
                          >
                            <i className="fas fa-chevron-right"></i>
                          </span>
                        </li>
                      )}

                      {this.state.pagination.last && (
                        <li className="page-item">
                          <span
                            className="page-link"
                            onClick={() =>
                              this.filter(this.state.pagination.last)
                            }
                            aria-label="Next"
                            style={{ cursor: "pointer", color: "black" }}
                          >
                            <span aria-hidden="true">
                              <i className="fas fa-chevron-right"></i>
                              <i className="fas fa-chevron-right"></i>
                            </span>
                            <span className="sr-only">Last</span>
                          </span>
                        </li>
                      )}
                    </ul>
                  </nav>
                </div>
              </div>
            </span>
          )}
        </Theme.Consumer>
      </div>
    );
  }
}

/**
 * AddShift
 */
export const FilterTalents = (props) => {
  return (
    <form>
      <div className="row">
        <div className="col-6">
          <label>First Name:</label>
          <input
            className="form-control"
            value={props.formData.first_name}
            onChange={(e) => props.onChange({ first_name: e.target.value })}
          />
        </div>
        <div className="col-6">
          <label>Last Name:</label>
          <input
            className="form-control"
            value={props.formData.last_name}
            onChange={(e) => props.onChange({ last_name: e.target.value })}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <label>Experience in past positions:</label>
          <Select
            isMulti
            value={props.formData.positions}
            onChange={(selectedOption) =>
              props.onChange({ positions: selectedOption })
            }
            options={props.catalog.positions}
          />
        </div>
      </div>

      {/* BADGE COMING SOON */}
      {/* <div className="row">
            <div className="col-12">
                <label>Badges:</label>
                <Select isMulti
                    value={props.formData.badges}
                    onChange={(selectedOption)=>props.onChange({badges: selectedOption})}
                    options={props.catalog.badges}
                />
            </div>
        </div> */}
      <div className="row">
        <div className="col-12">
          <label>Minimum start rating</label>
          <Select
            value={props.formData.rating}
            onChange={(opt) => props.onChange({ rating: opt })}
            options={props.catalog.stars}
          />
        </div>
      </div>
      <div className="btn-bar">
        <Button color="primary" onClick={() => props.onSave()}>
          Apply Filters
        </Button>
        <Button
          color="secondary"
          onClick={() => {
            props.formData.first_name = "";
            props.formData.last_name = "";
            props.formData.positions = [];
            props.formData.badges = [];
            props.formData.rating = "";
            props.onSave(false);
          }}
        >
          Clear Filters
        </Button>
      </div>
    </form>
  );
};
FilterTalents.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  formData: PropTypes.object,
  catalog: PropTypes.object, //contains the data needed for the form to load
};

/**
 * Talent Details
 */
export const TalentDetails = (props) => {
  const employee = props.catalog.employee;

  function reformatPhoneNumber(phoneNumberString) {
    var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      var intlCode = match[1] ? "+1 " : "";
      return [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("");
    }
    return null;
  }
              
  return (
    <Theme.Consumer>
      {({ bar }) => (
        <li className="aplication-details">
          <div className="top-bar">
            <Button
              icon="envelope"
              color="primary"
              size="small"
              rounded={true}
              note="Pending Invites"
              notePosition="left"
              onClick={() =>
                bar.show({
                  slug: "show_talent_shift_invites",
                  data: employee,
                  allowLevels: true,
                })
              }
            />
          </div>
          <Avatar url={employee.user.profile.picture} />
          <p>
            <Stars
              rating={Number(employee.rating)}
              jobCount={employee.total_ratings}
            />
          </p>
          <p style={{ fontWeight: "bolder", fontSize: "24px" }}>
            {typeof employee.fullName == "function"
              ? employee.fullName()
              : employee.first_name + " " + employee.last_name}
          </p>
          <p>
            <strong>Email:</strong>{" "}
            {employee.user ? employee.user.email : "No email provided"}
          </p>
          <p>
            <strong>Phone number:</strong>{" "}
            {employee.user && employee.user.profile.phone_number != ""
              ? reformatPhoneNumber(employee.user.profile.phone_number)
              : "none"}
          </p>
          <p>
            <strong>Position(s):</strong>{" "}
            {employee.positions.map((p) => p.title).join(", ")}
          </p>
          <p>
            <strong>
              ${Number(employee.minimum_hourly_rate).toFixed(2)}/hr minimum
              expected rate
            </strong>
          </p>
          <p>{employee.user.profile.bio}</p>

          {/* {employee.positions.length > 0 && <p>{employee.positions.map(p => <ul key={p.id}><li className="badge badge-primary" style={{columnCount: 3}}>{p.title}</li></ul>)}</p>} */}
          {employee.badges.length > 0 && (
            <p>
              {employee.badges.map((b) => (
                <span key={b.id} className="badge badge-secondary">
                  {b.title}
                </span>
              ))}
            </p>
          )}
          <div className="btn-bar">
            <Button
              color="primary"
              onClick={() =>
                bar.show({
                  slug: "invite_talent_to_shift",
                  data: employee,
                  allowLevels: true,
                })
              }
            >
              Invite to shift
            </Button>
            <Button
              color="success"
              onClick={() =>
                bar.show({
                  slug: "add_to_favlist",
                  data: employee,
                  allowLevels: true,
                })
              }
            >
              Add to favorites
            </Button>
          </div>
          <div className="btn-bar">
            <Button
              color="danger"
              onClick={() =>
                
                bar.show({
                  slug: "check_employee_documents",
                  data: employee,
                  allowLevels: true,
                })
              }
            >
              Check employee documents
            </Button>
            </div>
        </li>
      )}
    </Theme.Consumer>
  );
};
TalentDetails.propTypes = {
  catalog: PropTypes.object.isRequired,
};
