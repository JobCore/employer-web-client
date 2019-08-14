import React, { useEffect, useState } from "react";
import { CalendarView } from "../components/calendar/index.js";
import {Theme} from '../components/index';
import queryString from 'query-string';
import moment from "moment";

//gets the querystring and creats a formData object to be used when opening the rightbar
export const getCalendarFilters = () => {
    let query = queryString.parse(window.location.search);
    if(typeof query == 'undefined') return {};
    return {
        startDate: moment(query.start || new Date()),
        endDate: moment(query.end || new Date())
    };
};

const NOW = moment();
export const simpleEvents = [
  {
    label: "Server",
    start: NOW,
    end: moment(NOW).add(3, "hours")
  },
  {
    label: "Chef",
    start: moment(NOW).add(2, "hours"),
    end: moment(NOW).add(3, "hours")
  }
];
export const simpleEvents2 = [
  {
    label: "Server",
    start: NOW,
    end: moment(NOW).add(3, "hours")
  }
];

export const nestedEvents = {
  mario: simpleEvents,
  pepe: simpleEvents2,
  //juan: simpleEvents
};
const DayLabel = (propers) => <h2 style={{
    width: "100%",
    margin: 0,
    background: propers.active ? "orange" : "#f1f1f1"
    }}>{propers.children}</h2>;



export const ShiftCalendar = () => {

    const [ filters , setFilters ] = useState(getCalendarFilters());

    useEffect(() => {
        //getCalendarFilters()
    });
    return <Theme.Consumer>
        {({ bar }) => <div className="row">
            <div className="col-10">
                <CalendarView
                    timeDirection={'horizontal'}
                    dayDirection={'vertical'}
                    onChange={(value) => console.log(value)}
                    viewMode={"day"}
                    timeBlockMinutes={10}
                    yAxisWidth={60}
                    eventBoxStyles={{
                        background: "#c3f0f5"
                    }}
                    onClick={e => bar.show({ slug: "create_shift", title: 'Create shifts', to: 'shifts' })}
                    dayLabel={(day, active) => <DayLabel active={active}>{day.format("dddd")}</DayLabel>}
                    events={nestedEvents}

                    blockHeight={100}
                />
            </div>
        </div>
        }
    </Theme.Consumer>;
};