import React from "react";
import { mount } from "enzyme";
import LoadBar from "../../js/components/load-bar/LoadBar.jsx";

describe("<LoadBar/>", () => {
    
  test("Rendering of LoadBar component", () => {
    const loadBar = mount(<LoadBar />);
    expect(loadBar.length).toEqual(1)
  });
});
