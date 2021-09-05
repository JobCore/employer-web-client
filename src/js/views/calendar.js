import React, { useEffect, useState, useRef } from "react";
import { CalendarView } from "../components/calendar/index.js";
import { Theme, Button, ShiftBadge } from '../components/index';
import queryString from 'query-string';
import moment from "moment";
import _ from "lodash";
import PropTypes from 'prop-types';
import { Shift } from "./shifts.js";
import { store, searchMe, update, fetchAllMe } from '../actions.js';
import Select from 'react-select';
import WEngine from "../utils/write_engine.js";

import { DATETIME_FORMAT, YESTERDAY } from '../components/utils.js';
import DateTime from 'react-datetime';

//gets the querystring and creats a formData object to be used when opening the rightbar
export const getURLFilters = () => {
    let query = queryString.parse(window.location.hash);
    if (typeof query == 'undefined') return {};
    return {
        start: moment(query.start || new Date()),
        end: moment(query.end || new Date())
    };
};

const gf = {
    positions: {
        grouping: (s) => s.position.title || s.position.label,
        label: (s) => <span><ShiftBadge {...s} /> {s.venue.title || s.position.label}</span>
    },
    venues: {
        grouping: (s) => s.venue.title,
        label: (s) => <span><ShiftBadge {...s} /> {s.position.title || s.position.label}</span>
    },
    employees: {
        label: (s) => <span><ShiftBadge {...s} /> {s.position.title || s.position.label}</span>
    }
};

const getEmployees = (shifts) => shifts.map(s => s.employees).flat();

export const ShiftCalendar = ({ catalog }) => {

    const [filters, setFilters] = useState(null);
    const [shifts, setShifts] = useState(null);
    const [venues, setVenues] = useState([]);
    const [positions, setPositions] = useState(catalog.positions || []);
    const [shiftChanges, setShiftChanges] = useState([]);
    const [groupedShifts, setGroupedShifts] = useState(null);
    const [groupedLabel, setGroupedLabel] = useState(null);
    const [calendarLoading, setCalendarLoading] = useState(true);
    const [viewMode, setViewMode] = useState('day');
    const setCalendarFilters = (incoming = {}) => {
        const urlFilters = getURLFilters();
        const r = Object.assign(urlFilters, filters, incoming);
        setFilters(r);

        const _filters = Object.assign({}, r);
    
        if (moment.isMoment(_filters.start)) _filters.start = _filters.start.format('YYYY-MM-DD');
        if (moment.isMoment(_filters.end)) _filters.end = _filters.end.format('YYYY-MM-DD');
        searchMe('shifts', '?limit=10000&' + queryString.stringify(_filters) + "&serializer=big");
    };
    const groupShifts = (sh, l = null) => {
        let _shifts = {};
        
        if (l === null || l.value === "employees") {
            const employees = getEmployees(sh);
            console.log('EMPLOYEES', employees);
            employees.forEach(emp => {
                _shifts[`${typeof emp.user === "object" ? emp.user.first_name + " " + emp.user.last_name : "Loading..."}`] = sh.filter(s => s.employees.find(e => emp.id === e.id)).map(s => ({
                    start: moment(s.starting_at),
                    end: moment(s.ending_at),
                    label: gf["employees"].label(s),
                    data: s
                }));
            });
        }
        else {
            _shifts = _.groupBy(sh, gf[l.value].grouping);
            const _keys = Object.keys(_shifts);
            _keys.forEach(key => {
                if (Array.isArray(_shifts[key])) _shifts[key] = _shifts[key].map(s => ({
                    start: moment(s.starting_at),
                    end: moment(s.ending_at),
                    label: gf[l.value].label(s),
                    data: s
                }));
                else _shifts[key] = [];
            });
        }
        setGroupedShifts(_shifts);
        if (l) setGroupedLabel(l);
        else if (groupedLabel === null) setGroupedLabel({ label: "Position", value: "positions" });
    };

    const previousLabel = useRef(groupedLabel);
    useEffect(() => {

        //previousLabel.current = groupedLabel;
        //getCalendarFilters()
        //if(!shifts) shifts = store.getState('shifts');
        if (previousLabel.current !== groupedLabel) previousLabel.current !== groupedLabel;
        const unsubscribeShifts = store.subscribe('shifts', (sh) => {
            setShifts(sh);
            groupShifts(sh, groupedLabel);
            setCalendarLoading(false);
        });
        let positions = store.getState('positions');
        const unsubscribeVenues = store.subscribe('venues', (venues) => setVenues(venues));
        const unsubscribePositions = store.subscribe('positions', (positions) => setPositions(positions));
        let venues = store.getState('venues');
        if (!venues) fetchAllMe(['venues']).then(() => setCalendarFilters());
        if (filters === null) setCalendarFilters(getURLFilters());

        return () => {
            unsubscribeShifts.unsubscribe();
            unsubscribeVenues.unsubscribe();
            unsubscribePositions.unsubscribe();
        };

    }, [groupedLabel]);

    console.log('Shifts', shifts);
    console.log('sort', groupedLabel);

    return <Theme.Consumer>
        {({ bar }) => <div className="row">
            <div className="col-10">
                {groupedShifts &&
                    <CalendarView
                        viewMode={viewMode}
                        ToolbarComponent={({ setCurrentDate, currentDate }) => <div className="row mb-2">
                            <div className="col">
                                <p className="mb-0">Sort by:</p>
                                <Select
                                    onChange={(l) => groupShifts(shifts, l)}
                                    options={[{ label: "Position", value: "positions" }, { label: "Venue", value: "venues" }, { label: "Employees", value: "employees" }]}
                                    value={groupedLabel}
                                />
                            </div>
                            <div className="col text-right pt-4">
                                <Button size="small" disable={calendarLoading} color="light" icon="backward"
                                    onClick={() => {
                                        const newEndDate = moment(currentDate).add(-1, viewMode);
                                        const oldEndDate = moment(filters.start);
                                        if (newEndDate.isBefore(oldEndDate)) {
                                            setCalendarLoading(true);
                                            const updatedFilters = { start: moment(newEndDate).add(-2, 'weeks').format('YYYY-MM-DD'), end: moment(newEndDate).add(2, 'weeks').format('YYYY-MM-DD') };
                                            window.location.hash = queryString.stringify(updatedFilters);
                                            setCalendarFilters(updatedFilters);
                                        }
                                        setCurrentDate(moment(currentDate).add(-1, viewMode));
                                    }}
                                />
                                <Button size="small" disable={calendarLoading} onClick={() => setViewMode('day')}>Day</Button>
                                <Button size="small" disable={calendarLoading} onClick={() => setViewMode('week')}>Week</Button>
                                <Button size="small" disable={calendarLoading} onClick={() => setViewMode('month')}>Month</Button>
                                <Button size="small" disable={calendarLoading} color="light" icon="forward" onClick={() => {
                                    const newEndDate = moment(currentDate).add(1, viewMode);
                                    const oldEndDate = moment(filters.end);
                                    if (oldEndDate.isBefore(newEndDate)) {
                                        setCalendarLoading(true);
                                        const updatedFilters = { start: moment(newEndDate).add(-2, 'weeks').format('YYYY-MM-DD'), end: moment(newEndDate).add(2, 'weeks').format('YYYY-MM-DD') };
                                        window.location.hash = queryString.stringify(updatedFilters);
                                        setCalendarFilters(updatedFilters);
                                    }
                                    setCurrentDate(moment(currentDate).add(1, viewMode));
                                }} />
                            </div>
                        </div>}
                        onChange={(evt) => {
                            let shift = {
                                id: evt.data.id,
                                starting_at: moment(evt.start),
                                ending_at: moment(evt.end)
                            };
                            const sh = shifts.map(s => s.id !== shift.id ? s : ({ ...s, ...shift }));

                            update('shifts', shift, WEngine.modes.POSPONED).then(s => {
                                setShifts(sh);
                                groupShifts(sh);
                            });
                        }}
                        eventBoxStyles={{
                            background: "#c3f0f5"
                        }}
                        dayBlockStyles={{
                            backgroundColor: "rgba(255,255,255,0.3)",
                            borderRight: "1px solid #e3e3e3",
                            borderBottom: "1px solid #e3e3e3"
                        }}
                        tableStyles={{
                            maxHeight: "65vh"
                        }}
                        onClick={e => {
                            const venue = groupedLabel.value === 'venues' ? venues.find(v => v.title == e.yAxis) : undefined;
                            const position = groupedLabel.value === 'positions' ? positions.find(p => p.label == e.yAxis || p.title == e.yAxis) : undefined;
                            const employee = shifts.filter(emp => emp.employees.length > 0).map(_emp => _emp.employees).flat().find(employee => employee.user.first_name + " " + employee.user.last_name == e.yAxis);
                            if (e.data) {
                                bar.show({
                                    slug: "shift_details", data: {
                                        ...e.data,
                                        starting_at: e.start,
                                        ending_at: e.end
                                    }
                                });
                            }
                            else {
                                bar.show({
                                    slug: "create_shift", data: {
                                        starting_at: e.start,
                                        ending_at: e.end.startOf('hour'),
                                        venue: venue ? venue.id : '',
                                        position: position && position.id ? position.id : position && position.value ? position.value : '',
                                        application_restriction: employee ? 'SPECIFIC_PEOPLE' : 'ANYONE',
                                        pending_invites: employee ? [{label: employee.user.first_name + " " + employee.user.last_name , value: employee.id }] : []

                                    }
                                });
                            }
                        }}
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