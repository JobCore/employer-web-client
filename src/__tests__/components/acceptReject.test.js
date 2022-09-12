import React from "react";
import { mount } from "enzyme";
import AcceptReject from "../../js/components/accept-reject/AcceptReject.jsx";

describe("<AcceptReject/>", () => {
    
  test("Rendering of AcceptReject component", () => {
    const acceptReject = mount(<AcceptReject />);
    expect(acceptReject.length).toEqual(1)
  });
});
