import React from 'react'
import { Link } from 'react-router'
import moment from 'moment'
import Progress from './status/Progress'
import ComponentWithModal from './ComponentWithModal'
import TaskPage from '../containers/TaskPage'
import TaskList from './TaskList'

export default class ProjectDetail extends ComponentWithModal {

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
                    <h2>{project.title}</h2>
                    <div className="description" dangerouslySetInnerHTML={{__html: project.description}}/>
                    {project.deadline?<p><i className="tunga-icon-agenda"/> Deadline: {moment.utc(project.deadline).local().format('Do, MMMM YYYY')}</p>:null}
                    <Link to={`/project/${project.id}/task`} className="btn">Create a new task for this project</Link>
                    <Link to={`/project/${project.id}/edit`} className="btn btn-alt">Edit project</Link>

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
