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
        grouping: (s) => s.position.title,
        label: (s) => <span><ShiftBadge {...s} /> {s.venue.title}</span>
    },
    venues: {
        grouping: (s) => s.venue.title,
        label: (s) => <span><ShiftBadge {...s} /> {s.position.title}</span>
    },
    employees: {
        label: (s) => <span><ShiftBadge {...s} /> {s.position.title}</span>
    }
};

const getEmployees = (shifts) => shifts.map(s => s.employees).flat();

export const ShiftCalendar = ({ catalog }) => {

    const [filters, setFilters] = useState(null);
    const [shifts, setShifts] = useState(null);
    const [venues, setVenues] = useState([]);
    const [positions, setPositions] = useState([]);
    const [shiftChanges, setShiftChanges] = useState([]);
    const [groupedShifts, setGroupedShifts] = useState(null);
    const [groupedLabel, setGroupedLabel] = useState(null);
    const [viewMode, setViewMode] = useState('day');
    const setCalendarFilters = (incoming = {}) => {
        const urlFilters = getURLFilters();
        const r = Object.assign(urlFilters, filters, incoming);
        setFilters(r);

        const _filters = Object.assign({}, r);

        if (moment.isMoment(_filters.start)) _filters.start = _filters.start.format('YYYY-MM-DD');
        if (moment.isMoment(_filters.end)) _filters.end = _filters.end.format('YYYY-MM-DD');
        searchMe('shifts', '?serializer=big&' + queryString.stringify(_filters));
    };

    const groupShifts = (sh, l = null) => {
        let _shifts = {};

        if (l === null || l.value === "employees") {
            const employees = getEmployees(sh);
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
            catalog[l.value].forEach(pos => {
                if (Array.isArray(_shifts[pos.label])) _shifts[pos.label] = _shifts[pos.label].map(s => ({
                    start: moment(s.starting_at),
                    end: moment(s.ending_at),
                    label: gf[l.value].label(s),
                    data: s
                }));
                else _shifts[pos.label] = [];
            });
        }
        setGroupedShifts(_shifts);
        if (l) setGroupedLabel(l);
        else if (groupedLabel === null) setGroupedLabel({ label: "Group shifts by...", value: "employees" });
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
        });
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
                            {/*<div className="col">
                                <div className="row">
                                     <DateTime
                                        className='col'
                                        timeFormat={false}
                                        closeOnSelect={true}
                                        value={filters.start}
                                        isValidDate={( current ) => {
                                            return current.isBefore( filters.end );
                                        }}
                                        renderInput={(properties) => {
                                            const { value, ...rest } = properties;
                                            return <input value={value.match(/\d{2}\/\d{2}\/\d{4}/gm)} {...rest} />;
                                        }}
                                        onChange={(value)=> setCalendarFilters({ start: value })}
                                    />
                                    <DateTime
                                        className='col'
                                        timeFormat={false}
                                        closeOnSelect={true}
                                        value={filters.end}
                                        isValidDate={( current ) => {
                                            return current.isAfter( filters.start );
                                        }}
                                        renderInput={(properties) => {
                                            const { value, ...rest } = properties;
                                            return <input value={value.match(/\d{2}\/\d{2}\/\d{4}/gm)} {...rest} />;
                                        }}
                                        onChange={(v)=> setCalendarFilters({ end: v })}
                                    />
                                </div>
                            </div>*/}
                            <div className="col text-right pt-4">
                                <Button size="small" color="light" icon="backward"
                                    // onClick={() => setCurrentDate(moment(currentDate).add(-1, viewMode))}
                                    onClick={() => {
                                        const newEndDate = moment(currentDate).add(-1, viewMode);
                                        const oldEndDate = moment(filters.start);
                                        if (newEndDate.isBefore(oldEndDate)) {
                                            const updatedFilters = { start: moment(newEndDate).add(-2, 'months').format('YYYY-MM-DD'), end: moment(newEndDate).add(2, 'months').format('YYYY-MM-DD') };
                                            window.location.hash = queryString.stringify(updatedFilters);
                                            setCalendarFilters(updatedFilters);
                                        }
                                        setCurrentDate(moment(currentDate).add(-1, viewMode));
                                    }}
                                />
                                <Button size="small" onClick={() => setViewMode('day')}>Day</Button>
                                <Button size="small" onClick={() => setViewMode('week')}>Week</Button>
                                <Button size="small" onClick={() => setViewMode('month')}>Month</Button>
                                <Button size="small" color="light" icon="forward" onClick={() => {
                                    const newEndDate = moment(currentDate).add(1, viewMode);
                                    const oldEndDate = moment(filters.end);
                                    if (oldEndDate.isBefore(newEndDate)) {
                                        const updatedFilters = { start: moment(newEndDate).add(-2, 'months').format('YYYY-MM-DD'), end: moment(newEndDate).add(2, 'months').format('YYYY-MM-DD') };
                                        window.location.hash = queryString.stringify(updatedFilters);
                                        setCalendarFilters(updatedFilters);
                                    }
                                    setCurrentDate(moment(currentDate).add(1, viewMode));
                                }} />
                            </div>
                        </div>}
                        onChange={(evt) => {
                            //console.log("Event Updatedd", evt);
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
                            const position = groupedLabel.value === 'positions' ? positions.find(p => p.title == e.yAxis) : undefined;
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
                                        ending_at: e.end,
                                        venue: venue ? venue.id : null,
                                        position: position ? position.id : null
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