import React from "react";
import { mount } from "enzyme";
import Modal from "../../js/components/modal/Modal.jsx";

describe("<Modal/>", () => {
    
  test("Rendering of Modal component", () => {
    const modal = mount(<Modal />);
    expect(modal.length).toEqual(1)
  });
});
