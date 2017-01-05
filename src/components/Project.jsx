import React from 'react';
import Helmet from "react-helmet"

import BreadCrumb from '../containers/BreadCrumb';
import Progress from './status/Progress';

import { getRouteCrumb } from '../utils/router';

export default class Project extends React.Component {

    componentDidMount() {
        this.props.ProjectActions.retrieveProject(this.props.params.projectId);
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.params.projectId != prevProps.params.projectId) {
            this.props.ProjectActions.retrieveProject(this.props.params.projectId);
        }
    }

    renderChildren() {
        return React.Children.map(this.props.children, function (child) {
            return React.cloneElement(child, {
                Auth: this.props.Auth,
                Project: this.props.Project,
                project: this.props.Project.detail.project,
                Task: this.props.Task,
                ProjectActions: this.props.ProjectActions,
                TaskActions: this.props.TaskActions
            });
        }.bind(this));
    }

    render() {
        const { Auth, Project, routes } = this.props;
        const { project } = Project.detail;

        return (
            Project.detail.isRetrieving?
            (<Progress/>)
            :project.id?(
            <div>
                <Helmet
                    title={project.title}
                    meta={[
                            {"name": "description", "content": project.description || project.title}
                        ]}
                />

                <BreadCrumb
                    section={getRouteCrumb(routes)}
                    parents={project?[{name: project.title, link: `/project/${project.id}`}]:[]} />

                {project.user.id == Auth.user.id || Auth.user.is_staff?(
                <div>
                    {this.renderChildren()}
                </div>
                    ):(
                    <div className="alert alert-danger">You don't have permission to access this project</div>
                    )}
            </div>
        ):(
            <div className="alert alert-danger">Project not found</div>
        )
        );
    }
}
