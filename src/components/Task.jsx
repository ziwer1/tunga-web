

import React from 'react'
import { Link } from 'react-router'
import Helmet from "react-helmet";
import TagList from './TagList'
import Progress from './status/Progress'
import CommentSection from '../containers/CommentSection'
import TaskDetail from './TaskDetail'
import TaskWorflow from './TaskWorflow'

export default class Task extends React.Component {

    componentDidMount() {
        this.props.TaskActions.retrieveTask(this.props.params.id);
    }

    renderChildren() {
        return React.Children.map(this.props.children, function (child) {
            return React.cloneElement(child, {
                Auth: this.props.Auth,
                Task: this.props.Task,
                task: this.props.Task.detail,
                TaskActions: this.props.TaskActions
            });
        }.bind(this));
    }

    render() {
        const { Auth, Task, TaskActions, params } = this.props;
        const { task, meta } = Task.detail;

        return (
            Task.detail.isRetrieving?
            (<Progress/>)
            :task.id?(
            <div>
                <Helmet
                    title={task.summary}
                    meta={[
                            {"name": "description", "content": task.description || task.summary},
                            {"name": "participation", "content": meta.participation},
                            {"name": "tunga", "content": meta.payment}
                        ]}
                />
                {task.user == Auth.user.id || task.is_participant || Auth.user.is_staff?(
                <div>
                    <TaskWorflow Auth={Auth} Task={Task} TaskActions={TaskActions} params={params}/>
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
