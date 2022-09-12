import React from "react";
import { mount } from "enzyme";
import DashboardBox from "../../js/components/dashboard-box/DashboardBox.jsx";
import { BrowserRouter as Router } from "react-router-dom";

describe("<DashboardBox/>", () => {

  test("Rendering of DashboardBox component", () => {
    const dashboardBox = mount(
      <Router>
        <DashboardBox />
      </Router>
    );
    expect(dashboardBox.length).toEqual(1)
  });
});