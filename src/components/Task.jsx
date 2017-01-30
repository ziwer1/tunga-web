import React from 'react';
import Helmet from 'react-helmet';

import BreadCrumb from '../containers/BreadCrumb';
import TaskDetail from './TaskDetail';
import Progress from './status/Progress';
import Success from './status/Success';

import { getRouteCrumb } from '../utils/router';
import { render_excerpt } from '../utils/html';

export default class Task extends React.Component {

    componentDidMount() {
        this.props.TaskActions.retrieveTask(this.props.params.taskId);
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.params.taskId != prevProps.params.taskId) {
            this.props.TaskActions.retrieveTask(this.props.params.taskId);
        }

        if(this.props.Task.detail.isSaved && !prevProps.Task.detail.isSaved && this.props.Task.detail.task.id != this.props.params.taskId) {
            const { router } = this.context;
            router.replace(`/task/${this.props.Task.detail.task.id}`);
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
        let meta_title = 'Tunga | ' + task.summary;
        let meta_description = render_excerpt(task.description) || task.summary;

        var crumb_parents = [];

        if(task) {
            if(task.parent) {
                crumb_parents.push({name: task.details.parent.title, link: `/task/${task.parent}?nr=true`});
            }
            crumb_parents.push({name: task.title, link: `/task/${task.id}?nr=true`});
        }

        return (
            Task.detail.isRetrieving?
            (<Progress/>)
            :task.id && task.id == this.props.params.taskId?(
            <div>
                <Helmet
                    title={meta_title}
                    meta={[
                            {name: "twitter:title", content: meta_title},
                            {property: "og:title", content: meta_title},
                            {name: "description", content: meta_description},
                            {name: "twitter:description", content: meta_description},
                            {property: "og:description", content: meta_description}
                        ]}
                />

                {Auth.user.is_developer && Task.detail.applications.isSaved?(
                    <Success message="Application sent successfully"/>
                ):null}

                {task.user.id == Auth.user.id || task.is_admin || task.is_participant || Auth.user.is_staff || (lastRoute && lastRoute.path == 'apply' && task.can_apply)?(
                <div>
                    <BreadCrumb
                        section={getRouteCrumb(routes)}
                        parents={crumb_parents} />

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

Task.contextTypes = {
    router: React.PropTypes.object.isRequired
};
