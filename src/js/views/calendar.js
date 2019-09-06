import React, { useEffect, useState } from "react";
import { CalendarView } from "../components/calendar/index.js";
import {Theme, Button} from '../components/index';
import queryString from 'query-string';
import moment from "moment";
import _ from "lodash";
import PropTypes from 'prop-types';
import { Shift } from "./shifts.jsx";
import { store, searchMe, update } from '../actions.js';
import Select from 'react-select';
import WEngine from "../utils/write_engine.js";

//gets the querystring and creats a formData object to be used when opening the rightbar
export const getCalendarFilters = () => {
    let query = queryString.parse(window.location.search);
    if(typeof query == 'undefined') return {};
    return {
        startDate: moment(query.start || new Date()),
        endDate: moment(query.end || new Date())
    };
};

const gf = {
    positions: {
        grouping: (s) => s.position.title,
        label: (s) => s.venue.title
    },
    venues: {
        grouping: (s) => s.venue.title,
        label: (s) => s.position.title
    },
    employees: {
        label: (s) => s.position.title
    }
};

const getEmployees = (shifts) => shifts.map(s => s.employees).flat();

export const ShiftCalendar = ({ catalog }) => {

    const [ filters , setFilters ] = useState(getCalendarFilters());
    const [ shifts , setShifts ] = useState(null);
    const [ shiftChanges , setShiftChanges ] = useState([]);
    const [ groupedShifts , setGroupedShifts ] = useState(null);
    const [ groupedLabel , setGroupedLabel ] = useState(null);

    const groupShifts = (sh, l) => {
        let _shifts = {};

        if(l.value === "employees"){
            const employees = getEmployees(sh);
            employees.forEach(emp => {
                _shifts[`${emp.user.first_name} ${emp.user.last_name}`] = sh.filter(s => s.employees.find(e => emp.id === e.id)).map(s => ({
                    start: moment(s.starting_at),
                    end: moment(s.ending_at),
                    label: gf[l.value].label(s),
                    data: s
                }));
            });
        }
        else{
            _shifts = _.groupBy(sh, gf[l.value].grouping);
            catalog[l.value].forEach(pos => {
                if(Array.isArray(_shifts[pos.label])) _shifts[pos.label] = _shifts[pos.label].map(s => ({
                    start: moment(s.starting_at),
                    end: moment(s.ending_at),
                    label: gf[l.value].label(s),
                    data: s
                }));
                else _shifts[pos.label] = [];
            });
        }
        setGroupedShifts(_shifts);
        setGroupedLabel(l);
    };

    useEffect(() => {
        //getCalendarFilters()
        //if(!shifts) shifts = store.getState('shifts');

        store.subscribe('shifts', (sh) => {
            setShifts(sh);
            groupShifts(sh, {label: "Venue", value: "venues" });
        });
        searchMe('shifts',window.location.search);


    }, []);

    return <Theme.Consumer>
        {({ bar }) => <div className="row">
            <div className="col-10">
                <Select
                    onChange={(l)=> groupShifts(shifts, l)}
                    options={[{ label: "Position", value: "positions"}, {label: "Venue", value: "venues" }, {label: "Employees", value: "employees" }]}
                    value={groupedLabel}
                />
                { groupedShifts &&
                    <CalendarView
                        viewMode={"day"}
                        onChange={(evt) => {
                            console.log("Event Updatedd", evt);
                            let shift = {
                                id: evt.data.id,
                                starting_at: moment(evt.start),
                                ending_at: moment(evt.end)
                            };
                            const sh = shifts.map(s => s.id !== shift.id ? s : ({...s, ...shift}));

                            update('shifts', shift, WEngine.modes.POSPONED).then(s => {
                                setShifts(sh);
                                groupShifts(sh, groupedLabel);
                            });
                        }}
                        eventBoxStyles={{
                            background: "#c3f0f5"
                        }}
                        timeBlockStyles={{
                            backgroundColor: "rgba(255,255,255,0.3)",
                            borderRight: "1px solid #e3e3e3",
                            borderBottom: "1px solid #e3e3e3",
                        }}
                        onClick={e => e.data ?
                            bar.show({ slug: "shift_details", data: {
                                ...e.data,
                                starting_at: e.start,
                                ending_at: e.end
                            }})
                            :
                            bar.show({ slug: "create_shift", data: {
                                starting_at: e.start,
                                ending_at: e.end,
                            }})
                        }
                        events={groupedShifts}
                    />
                }
            </div>
        </div>
        }
    </Theme.Consumer>;
};

ShiftCalendar.propTypes = {
  catalog: PropTypes.object
};