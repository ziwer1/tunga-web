import React from 'react'
import _ from 'underscore'


export default class SearchBox extends React.Component {

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
                {this.state.search?(
                <div className="results">Results for "<strong>{this.state.search}</strong>"</div>
                    ):null}
            </div>
        );
    }
}
