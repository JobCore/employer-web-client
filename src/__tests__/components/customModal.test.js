import React from "react";
import { mount } from "enzyme";
import CustomModal from "../../js/components/custom-modal/CustomModal.js";

describe("<CustomModal/>", () => {
    
  test("Rendering of CustomModal component", () => {
    const customModal = mount(<CustomModal />);
    expect(customModal.length).toEqual(1)
  });
});
