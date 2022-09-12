import React from "react";
import { mount } from "enzyme";
import CalendarView from "../../../js/components/calendar/CalendarView.js";

describe("<CalendarView/>", () => {
    
  test("Rendering of CalendarView component", () => {
    const calendarView = mount(<CalendarView />);
    expect(calendarView.length).toEqual(1)
  });
});
