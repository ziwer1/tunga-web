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
        this.onSearch = _.debounce(this.onSearch, 250);
        this.state = {search: ''};
    }

    componentDidMount() {
        if(this.context.location.query && this.context.location.query.search) {
            let search = this.context.location.query.search;
            this.setState({search});
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.state.search != prevState.search) {
            this.performSearch();
        }
    }

    onSearchChange(e) {
        e.preventDefault();
        var search = e.target.value;
        this.setState({search: search});
    }

    onSearch(e) {
        e.preventDefault();
        this.performSearch();
        return;
    }

    performSearch() {
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
        const { Search } = this.props;
        const count = this.props.count || Search.count;

        return (
            <div className="search-box">
                <form name="search" role="form" onSubmit={this.onSearch.bind(this)}>
                    <div className="input-group">
                        <span className="input-group-addon">
                            <i className="fa fa-search"/>
                        </span>
                        <input type="text" name="search" className="form-control" placeholder={this.props.placeholder || "Search"} ref="search" value={this.state.search} onChange={this.onSearchChange.bind(this)}/>
                    </div>
                </form>
                {!this.props.hide_results && this.state.search?(
                <div className="results">{count?count:"Search"} results for "<strong>{this.state.search}</strong>"</div>
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
