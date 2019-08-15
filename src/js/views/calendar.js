import React, { useEffect, useState } from "react";
import { CalendarView } from "../components/calendar/index.js";
import {Theme} from '../components/index';
import queryString from 'query-string';
import moment from "moment";
import _ from "lodash";
import PropTypes from 'prop-types';
import { store, searchMe } from '../actions.js';
import Select from 'react-select';

//gets the querystring and creats a formData object to be used when opening the rightbar
export const getCalendarFilters = () => {
    let query = queryString.parse(window.location.search);
    if(typeof query == 'undefined') return {};
    return {
        startDate: moment(query.start || new Date()),
        endDate: moment(query.end || new Date())
    };
};

const DayLabel = (propers) => <h2 style={{
    width: "100%",
    margin: 0,
    background: propers.active ? "orange" : "#f1f1f1"
    }}>{propers.children}</h2>;

const gf = {
    positions: {
        grouping: (s) => s.position.title,
        label: (s) => s.venue.title
    },
    venues: {
        grouping: (s) => s.venue.title,
        label: (s) => s.position.title
    }
};

export const ShiftCalendar = ({ catalog }) => {

    const [ filters , setFilters ] = useState(getCalendarFilters());
    const [ shifts , setShifts ] = useState(null);
    const [ groupedShifts , setGroupedShifts ] = useState(null);
    const [ groupedLabel , setGroupedLabel ] = useState(null);

    const groupShifts = (sh, l) => {
        let _shifts = _.groupBy(sh, gf[l.value].grouping);
        catalog[l.value].forEach(pos => {
            if(Array.isArray(_shifts[pos.label])) _shifts[pos.label] = _shifts[pos.label].map(s => ({
                start: moment(s.starting_at),
                end: moment(s.ending_at),
                label: gf[l.value].label(s),
                data: s
            }));
            else _shifts[pos.label] = [];
        });
        setGroupedShifts(_shifts);
        setGroupedLabel(l);
    };

    useEffect(() => {
        //getCalendarFilters()
        //if(!shifts) shifts = store.getState('shifts');
        searchMe('shifts',window.location.search).then((sh => {
            setShifts(sh);
            groupShifts(sh, {label: "Venue", value: "venues" });
        }));

    }, []);
    return <Theme.Consumer>
        {({ bar }) => <div className="row">
            <div className="col-10">
                <Select
                    onChange={(l)=> groupShifts(shifts, l)}
                    options={[{ label: "Position", value: "positions"}, {label: "Venue", value: "venues" }]}
                    value={groupedLabel}
                />
                { groupedShifts &&
                    <CalendarView
                        timeDirection={'horizontal'}
                        dayDirection={'vertical'}
                        onChange={(value) => console.log(value)}
                        viewMode={"day"}
                        timeBlockMinutes={10}
                        yAxisWidth={120}
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
                        dayLabel={(day, active) => <DayLabel active={active}>{day.format("dddd")}</DayLabel>}
                        events={groupedShifts}

                        blockHeight={50}
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