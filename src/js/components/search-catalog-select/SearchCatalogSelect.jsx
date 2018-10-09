import React from "react";
import AsyncSelect from 'react-select/lib/Async';
import PropTypes from 'prop-types';

export default class SearchCatalogSelect extends React.Component {
    constructor(){
        super();
        this.state = {
            keyword: ''
        };
    }
    render() {
        return (
            <AsyncSelect
                isMulti={this.props.isMulti}
                value={this.props.value}
                cacheOptions={true} //The cache will remain until cacheOptions changes value.
                defaultOptions={[{ label: 'Start typing to search talents', value: null }]} // Options to show before the user starts searching. if true = results for loadOptions('') will be autoloaded.
                onInputChange={(keyword) => { //Function that returns a promise, which is the set of options to be used once the promise resolves.
                    //const keyword = newValue.replace(/\W/g, '');
                    this.setState({ keyword });
                    return keyword;
                }} 
                loadOptions={(search) => this.props.searchFunction(search)}
                onChange={(selection)=> this.props.onChange(selection)}
            />
        );
    }
}
SearchCatalogSelect.propTypes = {
    value: PropTypes.obj,
    isMulti: PropTypes.bool,
    searchFunction: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
};
SearchCatalogSelect.defaultProps = {
    isMulti: false,
    value: null,
    onChange: null,
    searchFunction: null
};