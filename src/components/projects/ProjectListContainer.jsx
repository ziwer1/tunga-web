import React from 'react';
import PropTypes from 'prop-types';
import randomstring from 'randomstring';
import _ from 'lodash';

export default class ProjectListContainer extends React.Component  {

    static propTypes = {
        filters: PropTypes.object,
        selectionKey: PropTypes.string,
    };

    static defaultProps = {
        filters: {},
        selectionKey: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            selectionKey: props.selectionKey || randomstring.generate(),
            prevKey: null,
        };
    }

    componentDidMount() {
        this.getList();
    }

    componentDidUpdate(prevProps, prevState, snapShot) {
        if(!_.isEqual(prevProps.filters, this.props.filters)) {
            this.getList();
        }
    }

    getList() {
        const {ProjectActions} = this.props;
        ProjectActions.listProjects({...(this.props.filters || {})}, this.state.selectionKey, this.state.prevKey);
    }

    renderChildren() {
        const {Project, ProjectActions} = this.props, self = this;

        return React.Children.map(
            this.props.children,
            function(child) {
                return React.cloneElement(child, {
                    projects: (Project.ids[this.state.selectionKey] || []).map(id => {
                        return Project.projects[id];
                    }),
                    onLoadMore: () => {
                        ProjectActions.listMoreProjects(Project.next, self.state.selectionKey);
                    },
                    isLoadingMore: Project.isFetchingMore,
                    hasMore: !!Project.next,
                    ProjectActions
                });
            }.bind(this),
        );
    }

    render() {
        return (
            <React.Fragment>
                {this.renderChildren()}
            </React.Fragment>
        );
    }
}
