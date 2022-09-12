import React from "react";
import { mount } from "enzyme";
import BankAccountExtendedCard from "../../js/components/bankaccount-card/BankAccountExtendedCard.jsx";

describe("<BankAccountExtendedCard/>", () => {
    
  test("Rendering of BankAccountExtendedCard component", () => {
    const bankaccountCard = mount(<BankAccountExtendedCard />);
    expect(bankaccountCard.length).toEqual(1)
  });
});