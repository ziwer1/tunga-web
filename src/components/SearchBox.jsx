import React from 'react'
import _ from 'underscore'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as SearchActions from '../actions/SearchActions'

import { SEARCH_PATH } from '../constants/patterns'


class SearchBox extends React.Component {

    static contextTypes = {
        router: React.PropTypes.object.isRequired,
        location: React.PropTypes.object.isRequired
    };

    constructor(props){
        super(props);
        this.handleSearch = _.debounce(this.handleSearch, 250);
        this.state = {search: ''};
    }

    handleChange(e) {
        e.preventDefault();
        var search = e.target.value;
        this.setState({search: search});
        this.handleSearch(e);
    }

    handleSearch(e) {
        e.preventDefault();
        if(this.props.onSearch) {
            var filter = this.props.filter || {};
            this.props.onSearch({search: this.state.search, ...filter});
        } else {
            this.props.SearchActions.searchStart(this.state.search);
            const { router, location } = this.context;
            if(!SEARCH_PATH.test(location.pathname)) {
                router.replace('/search');
            }
        }
    }

    render() {
        return (
            <div className="search-box">
                <form name="search" role="form">
                    <div className="input-group">
                        <span className="input-group-addon">
                            <i className="fa fa-search"/>
                        </span>
                        <input type="text" className="form-control" placeholder={this.props.placeholder || "Search"} ref="search" value={this.state.search} onChange={this.handleChange.bind(this)}/>
                    </div>
                </form>
                {!this.props.hide_results && this.state.search?(
                <div className="results">Results for "<strong>{this.state.search}</strong>"</div>
                    ):null}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {Auth: state.Auth, Search: state.Search};
}

function mapDispatchToProps(dispatch) {
    return {
        SearchActions: bindActionCreators(SearchActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBox);
