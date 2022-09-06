import React from "react";
import { mount } from 'enzyme';
import SearchCatalogSelect from "../../js/components/search-catalog-select/SearchCatalogSelect.jsx";

describe('<SearchCatalogSelect/>', () => {

    test('Rendering of SearchCatalogSelect component', () => {
        const searchCatalogSelect = mount(<SearchCatalogSelect />);
        expect(searchCatalogSelect.length).toEqual(1);
    });

});