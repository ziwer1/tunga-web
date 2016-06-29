import React from 'react'
import { Link } from 'react-router'
import Helmet from "react-helmet"
import moment from 'moment'
import TagList from './TagList'
import Progress from './status/Progress'
import ComponentWithModal from './ComponentWithModal'
import LargeModal from './ModalLarge'
import TaskPage from '../containers/TaskPage'
import TaskForm from './TaskForm'
import TaskList from './TaskList'

export default class Project extends ComponentWithModal {

    componentDidMount() {
        this.props.ProjectActions.retrieveProject(this.props.params.projectId);
    }

    handleCreateTask() {
        this.open();
    }

    renderChildren() {
        return React.Children.map(this.props.children, function (child) {
            return React.cloneElement(child, {
                Auth: this.props.Auth,
                Project: this.props.Project,
                project: this.props.Project.detail,
                ProjectActions: this.props.ProjectActions
            });
        }.bind(this));
    }

    renderModalContent() {
        const { ProjectActions, Project, Auth } = this.props;
        const { project } = Project.detail;
        const title = <div>Create a task for project: <Link to={`/project/${project.id}/`}>{project.title}</Link></div>;
        return (
            <div>
                <LargeModal title={title} show={this.state.showModal} onHide={this.close.bind(this)}>
                    <TaskPage>
                        <TaskForm project={project} />
                    </TaskPage>
                </LargeModal>
            </div>
        );
    }

    render() {
        const { Auth, Project, ProjectActions } = this.props;
        const { project } = Project.detail;

        return (
            Project.detail.isRetrieving?
            (<Progress/>)
            :project.id?(
            <div>
                {project.user == Auth.user.id || Auth.user.is_staff?(
                <div>
                    {this.renderModalContent()}
                    <h2>{project.title}</h2>
                    <div className="description" dangerouslySetInnerHTML={{__html: project.description}}/>
                    <div>
                        {project.deadline?"Deadline "+moment.utc(project.deadline).local().format('Do, MMMM YYYY'):null}
                    </div>
                    <Link to={`/project/${project.id}/task`} className="btn btn-action">Create a new task for this project</Link>

                    <div style={{marginTop: '10px'}}>
                        <TaskPage>
                            <TaskList project={project} hide_header={true} filters={{project: project.id}}></TaskList>
                        </TaskPage>
                    </div>
                </div>
                    ):null}
            </div>
        ):(
            <div className="alert alert-danger">Project not found</div>
        )
        );
    }
}
