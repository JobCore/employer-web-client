import React from "react";
import Flux from "@4geeksacademy/react-flux-dash";
//include images into your bundle
import {
  DashboardBox,
  Wizard,
  Theme,
  Button,
  ShiftBadge,
} from "../components/index";
import { store, fetchAllMe, searchMe, updateProfileMe } from "../actions.js";
import { hasTutorial } from "../utils/tutorial";
import { GET } from "../utils/api_wrapper.js";
import { NOW } from "../components/utils.js";
import { Session } from "bc-react-session";
import moment from "moment";
import { CalendarView } from "../components/calendar/index.js";
import { Redirect } from "react-router-dom";
import logoURL from "../../img/logo.png";

export default class Home extends Flux.DashView {
  constructor() {
    super();

    this.state = {
      shifts: [],
      todayShifts: null,
      clockins: null,
      session: Session.get(),
      runTutorial: hasTutorial(),
      start: moment().subtract(1, "weeks"),
      end: moment().add(1, "weeks"),
      calendarLoading: true,
      steps: [
        {
          content: (
            <div>
              <img
                src={logoURL}
                style={{ width: "300px", marginBottom: "30px" }}
              />
              <h2>Welcome to JobCore!</h2>
              <h4>
                {"Join us in this tutorial and let's get your account set up!"}
              </h4>
            </div>
          ),
          placement: "center",
          disableBeacon: true,
          disableCloseOnEsc: true,
          styles: {
            options: {
              zIndex: 10000,
              width: 600,
            },
            buttonClose: {
              display: "none",
            },
          },
          locale: { skip: "Skip tutorial" },
          target: "body",
        },
        {
          target: "#create_shift",
          content: "Start by creating a new shift",
          placement: "right",
        },
      ],
    };
  }
  componentDidMount() {
    const shifts = store.getState("shifts");

    this.subscribe(store, "shifts", (_shifts) => {
      this.setState({ shifts: _shifts, calendarLoading: false });
      // if(!this.state.todayShifts) this.setState({todayShifts: _shifts});
    });
    this.subscribe(store, "clockins", (_clockins) => {
      if (!this.state.clockins) this.setState({ clockins: _clockins });
    });

    searchMe(
      `shifts`,
      `?limit=10000&end=${this.state.end.format(
        "YYYY-MM-DD"
      )}&start=${this.state.start.format("YYYY-MM-DD")}`
    );
  }
  callback = (data) => {
    if (data.action == "next" && data.index == 0) {
      this.props.history.push("/profile");
    }
    if (data.status == "skipped") {
      const session = Session.get();
      updateProfileMe({ show_tutorial: false });

      const profile = Object.assign(session.payload.user.profile, {
        show_tutorial: false,
      });
      const user = Object.assign(session.payload.user, { profile });
      Session.setPayload({ user });
    }
  };

  scheduleHours = (shifts) => {
    const today = moment();
    if (shifts) {
      let scheduleHours =
        Array.isArray(shifts) &&
        shifts.length > 0 &&
        shifts
          .filter(
            (e) =>
              today.isSame(e.starting_at, "day") ||
              today.isSame(e.ending_at, "day")
          )
          .reduce(
            (total, { starting_at, ending_at }) =>
              total +
              moment
                .duration(moment(ending_at).diff(moment(starting_at)))
                .asHours(),
            0
          );

      // console.log('scheduleHours', scheduleHours.reduce((total, { starting_at, ending_at}) => total + moment.duration(moment(ending_at).diff(moment(starting_at))).asHours(), 0));
      let scheduleHoursFormatted = (Math.round(scheduleHours * 4) / 4).toFixed(
        2
      );

      return scheduleHoursFormatted;
    } else return 0;
  };

  render() {
    const today = moment();

    let shifts = this.state.shifts;

    let todayShifts =
      (Array.isArray(shifts) &&
        shifts.length > 0 &&
        shifts.filter(
          (e) => today.isSame(e.starting_at, "day") && e.status !== "EXPIRED"
        )) ||
      [];

    let scheduleHours = todayShifts.reduce(
      (total, { starting_at, ending_at }) =>
        total +
        moment.duration(moment(ending_at).diff(moment(starting_at))).asHours(),
      0
    );

    let scheduleHoursFormatted = (Math.round(scheduleHours * 4) / 4).toFixed(2);

    let currentlyClockin =
      Array.isArray(this.state.clockins) &&
      this.state.clockins.length > 0 &&
      this.state.clockins.filter((e) => !e.ended_at.isValid()).length;

    let unfilledShifts =
      Array.isArray(shifts) &&
      shifts.length > 0 &&
      shifts.filter(
        (e) =>
          e.employees.length === 0 &&
          (today.isSame(e.starting_at, "day") ||
            today.isSame(e.ending_at, "day"))
      ).length;

    // var friday = now.clone().weekday(5);

    // var isNowWeekday = now.isBetween(monday, friday, null, "[]");

    return (
      <Theme.Consumer>
        {({ bar }) => (
          <div>
            <Wizard
              steps={this.state.steps}
              run={this.state.runTutorial}
              callback={(data) => this.callback(data)}
              disableCloseOnEsc={true}
              disableOverlayClose={true}
              disableScrollParentFix={true}
              continuous={true}
              styles={{
                options: {
                  primaryColor: "#000",
                },
              }}
            />
            <div className="row">
              <div className="col-9">
                <CalendarView
                  viewMode={"day"}
                  className="mb-2"
                  allowResize={false}
                  yAxisWidth={0}
                  blockHoverIcon={false}
                  ToolbarComponent={({ setCurrentDate, currentDate }) => (
                    <div
                      className="text-right"
                      style={{ position: "absolute", right: "0" }}
                    >
                      {
                        <Button
                          size="small"
                          disable={this.state.calendarLoading}
                          style={{
                            background: "black",
                            fontSize: 12,
                            fontWeight: 500,
                          }}
                          onClick={() => {
                            const newEndDate = moment(currentDate).add(
                              -1,
                              "days"
                            );
                            if (newEndDate.isBefore(this.state.start)) {
                              this.setState({ calendarLoading: true });
                              searchMe(
                                `shifts`,
                                `?limit=10000&end=${this.state.end.format(
                                  "YYYY-MM-DD"
                                )}&start=${moment(this.state.start)
                                  .subtract(1, "weeks")
                                  .format("YYYY-MM-DD")}`
                              ).then((newShifts) => {
                                this.setState({
                                  shifts: newShifts,
                                  start: moment(this.state.start).subtract(
                                    1,
                                    "weeks"
                                  ),
                                  calendarLoading: false,
                                });
                              });
                            }
                            setCurrentDate(moment(currentDate).add(-1, "day"));
                          }}
                        >
                          <i className="fas fa-chevron-left"></i>
                        </Button>
                      }
                      {
                        <Button
                          className="ml-3"
                          disable={this.state.calendarLoading}
                          size="small"
                          style={{
                            background: "black",
                            fontSize: 12,
                            fontWeight: 500,
                          }}
                          onClick={() => {
                            const newEndDate = moment(currentDate).add(
                              1,
                              "days"
                            );
                            if (this.state.end.isBefore(newEndDate)) {
                              this.setState({ calendarLoading: true });
                              searchMe(
                                `shifts`,
                                `?limit=10000&end=${moment(this.state.end)
                                  .add(1, "weeks")
                                  .format(
                                    "YYYY-MM-DD"
                                  )}&start=${this.state.start.format(
                                  "YYYY-MM-DD"
                                )}`
                              ).then((newShifts) => {
                                this.setState({
                                  shifts: newShifts,
                                  end: moment(this.state.end).add(1, "weeks"),
                                  calendarLoading: false,
                                });
                              });
                            }
                            setCurrentDate(moment(currentDate).add(1, "day"));
                          }}
                        >
                          <i className="fas fa-chevron-right"></i>
                        </Button>
                      }
                      <Button
                        size="small"
                        className="ml-3"
                        style={{
                          background: "black",
                          fontSize: 12,
                          fontWeight: 500,
                        }}
                        disable={this.state.calendarLoading}
                        onClick={() =>
                          this.props.history.push(
                            "./calendar#start=" +
                              moment(currentDate)
                                .add(-1, "month")
                                .format("YYYY-MM-DD") +
                              "&end=" +
                              moment(currentDate)
                                .add(1, "month")
                                .format("YYYY-MM-DD")
                          )
                        }
                      >
                        GO TO CALENDAR
                      </Button>
                    </div>
                  )}
                  eventBoxStyles={{
                    background: "#c3f0f5",
                  }}
                  dayBlockStyles={{
                    backgroundColor: "rgba(255,255,255,0.3)",
                    // borderRight: "1px solid #e3e3e3",
                    borderBottom: "1px solid #e3e3e3",
                  }}
                  onClick={(e) =>
                    e.data &&
                    bar.show({
                      slug: "shift_details",
                      data: {
                        ...e.data,
                        starting_at: e.start,
                        ending_at: e.end,
                      },
                    })
                  }
                  events={{
                    today: this.state.shifts.map((s) => {
                      return {
                        start: moment(s.starting_at),
                        end: moment(s.ending_at),
                        label: (
                          <span>
                            <ShiftBadge {...s} />{" "}
                            {s.position.title || s.position.label} -{" "}
                            {s.venue.title}
                          </span>
                        ),
                        data: s,
                      };
                    }),
                  }}
                />
                <div className="row pt-2 mt-4 mb-4 pb-2">
                  <div className="col-12">
                    <div className="row">
                      <div className="col">
                        <div
                          className="card"
                          style={{
                            border: "1px solid black",
                            borderRadius: "0px",
                          }}
                        >
                          <div
                            className="card-body"
                            style={{ borderBottom: "1px solid black" }}
                          >
                            <h1 className="m-0">{"Today's Activity:"}</h1>
                          </div>
                          <div className="row" style={{ padding: "1.25rem" }}>
                            <div
                              className="col-4"
                              style={{ borderRight: "1px solid black" }}
                            >
                              <h3>
                                Scheduled: {scheduleHoursFormatted || 0} Hrs{" "}
                                {" in " + todayShifts.length + " Shift(s)"}
                              </h3>
                            </div>
                            <div
                              className="col-4"
                              style={{ borderRight: "1px solid black" }}
                            >
                              <h3>
                                Currently Clocked In: {currentlyClockin || 0}
                              </h3>
                            </div>
                            <div className="col-4">
                              <h3>
                                Unfilled Open Shifts: {unfilledShifts || 0}
                              </h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div id="draft_shifts">
                  <DashboardBox
                    id="draft_shift"
                    status="DRAFT"
                    title="Draft Shifts"
                    fetchData={() =>
                      GET(
                        `employers/me/shifts?status=DRAFT&envelope=true&limit=10`
                      )
                    }
                    defaultShifts={this.state.shifts.filter(
                      (s) => s.status == "DRAFT"
                    )}
                  />
                  <DashboardBox
                    id="open_shifts"
                    status="OPEN"
                    title="Open Shifts"
                    fetchData={() =>
                      GET(
                        `employers/me/shifts?status=OPEN&envelope=true&limit=10`
                      )
                    }
                    defaultShifts={this.state.shifts.filter(
                      (s) => s.status == "OPEN"
                    )}
                  />
                  <DashboardBox
                    id="upcoming_shifts"
                    title="Filled Shifts"
                    status="FILLED"
                    fetchData={() =>
                      GET(
                        `employers/me/shifts?filled=true&upcoming=true&not_status=DRAFT&envelope=true&limit=10`
                      )
                    }
                    defaultShifts={this.state.shifts.filter(
                      (s) =>
                        s.status != "DRAFT" &&
                        s.maximum_allowed_employees == s.employees.length &&
                        moment(s.ending_at).isAfter(NOW())
                    )}
                  />
                  <DashboardBox
                    id="expired_shifts"
                    status="EXPIRED"
                    title="Completed Shifts"
                    fetchData={() =>
                      GET(
                        `employers/me/shifts?status=EXPIRED&envelope=true&limit=10`
                      )
                    }
                    defaultShifts={this.state.shifts.filter(
                      (s) =>
                        !["DRAFT", "COMPLETED", "CANCELLED"].includes(
                          s.status
                        ) && moment(s.ending_at).isBefore(NOW())
                    )}
                  />
                  <DashboardBox
                    id="completed_shifts"
                    status="COMPLETED"
                    title="Paid Shifts"
                    fetchData={() =>
                      GET(
                        `employers/me/shifts?status=COMPLETED&envelope=true&limit=10`
                      )
                    }
                    defaultShifts={this.state.shifts.filter(
                      (s) =>
                        s.status == "COMPLETED" &&
                        moment(s.ending_at).isBefore(NOW())
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </Theme.Consumer>
    );
  }
}
