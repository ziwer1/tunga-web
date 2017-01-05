import React from 'react';
import Helmet from 'react-helmet';

import BreadCrumb from '../containers/BreadCrumb';
import TaskDetail from './TaskDetail';
import Progress from './status/Progress';
import Success from './status/Success';

import { getRouteCrumb } from '../utils/router';

export default class Task extends React.Component {

    componentDidMount() {
        this.props.TaskActions.retrieveTask(this.props.params.taskId);
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.params.taskId != prevProps.params.taskId) {
            this.props.TaskActions.retrieveTask(this.props.params.taskId);
        }
    }

    getLastRoute() {
        const { routes } = this.props;
        if(routes && routes.length) {
            return routes[routes.length-1];
        }
        return null;
    }

    renderChildren() {
        return React.Children.map(this.props.children, function (child) {
            return React.cloneElement(child, {
                Auth: this.props.Auth,
                Task: this.props.Task,
                task: this.props.Task.detail.task,
                TaskActions: this.props.TaskActions,
                location: this.props.location
            });
        }.bind(this));
    }

    render() {
        const { Auth, Task, TaskActions, params, routes } = this.props;
        const { task } = Task.detail;
        let lastRoute = this.getLastRoute();

        return (
            Task.detail.isRetrieving?
            (<Progress/>)
            :task.id && task.id == this.props.params.taskId?(
            <div>
                <Helmet
                    title={'Tunga | ' + task.summary}
                    meta={[
                            {"name": "description", "content": task.description || task.summary}
                        ]}
                />

                {Auth.user.is_developer && Task.detail.applications.isSaved?(
                    <Success message="Application sent successfully"/>
                ):null}

                {task.user.id == Auth.user.id || task.is_participant || Auth.user.is_staff || (lastRoute && lastRoute.path == 'apply' && task.can_apply)?(
                <div>
                    <BreadCrumb
                        section={getRouteCrumb(routes)}
                        parents={task?[{name: task.title, link: `/task/${task.id}?nr=true`}]:[]} />

                    {this.renderChildren()}
                </div>
                    ):(
                <TaskDetail Auth={Auth} Task={Task} TaskActions={TaskActions} params={params}/>
                    )}
            </div>
        ):(
            <div className="alert alert-danger">Task not found</div>
        )
        );
    }
}
