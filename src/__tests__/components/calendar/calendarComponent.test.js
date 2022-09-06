import React from "react";
import { mount } from "enzyme";
import Calendar from "../../../js/components/calendar/Calendar.js";

describe("<Calendar/>", () => {
    
  test("Rendering of Calendar component", () => {
    const calendar = mount(<Calendar />);
    expect(calendar.length).toEqual(1)
  });
});
