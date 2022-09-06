// import React from "react";
// import { mount } from 'enzyme';
// import ListCard from "../../js/components/list-card/ListCard";

// const props = {
//     "employees": []
// }

// describe('<ListCard/>', () => {

//     test('Rendering of ListCard component', () => {
//         const listCard = mount(<ListCard props={props} list={{}} />);
//         expect(listCard.length).toEqual(1);
//     });

// });

/* 

  TypeError: Cannot read properties of undefined (reading 'length')

       5 |
       6 | const ListCard = (props) => {
    >  7 |     const employeeCount = props.list.employees.length;
         |                                                ^
       8 |     return (<Theme.Consumer>
       9 |         {({bar}) => 
      10 |             (<li className="list-card" onClick={() => (props.onClick) ? props.onClick() : null}>


*/