import React from "react";
import { mount } from "enzyme";
import GenericCard from "../../js/components/generic-card/GenericCard.jsx";

describe("<GenericCard/>", () => {

  test("Rendering of GenericCard component", () => {
    const genericCard = mount(
        <GenericCard children={[]} />
    );
    expect(genericCard.length).toEqual(1)
  });
});
