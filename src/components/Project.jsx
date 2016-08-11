import React from 'react';
import Helmet from "react-helmet"
import ProjectCrumb from '../containers/ProjectCrumb';
import Progress from './status/Progress';

export default class Project extends React.Component {

    componentDidMount() {
        this.props.ProjectActions.retrieveProject(this.props.params.projectId);
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.params.projectId != prevProps.params.projectId) {
            this.props.ProjectActions.retrieveProject(this.props.params.projectId);
        }
    }

    getCrumb() {
        const { routes } = this.props;
        if(routes && routes.length) {
            return routes[routes.length-1].crumb;
        }
        return null;
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
        const { Auth, Project } = this.props;
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

                <ProjectCrumb section={this.getCrumb()}/>

                {project.user == Auth.user.id || Auth.user.is_staff?(
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
