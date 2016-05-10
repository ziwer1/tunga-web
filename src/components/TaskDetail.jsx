import React from 'react'
import { Link } from 'react-router'
import moment from 'moment'
import TagList from './TagList'
import Progress from './status/Progress'
import CommentSection from '../containers/CommentSection'
import TaskHead from './TaskHead'

export default class TaskDetail extends React.Component {

    render() {
        const { Auth, Task } = this.props;
        const { task } = Task.detail;

        return (
            <div>
                {Task.detail.isRetrieving?
                    (<Progress/>)
                    :(
                <div>
                    <TaskHead task={task}/>
                    <h4 className="title">{task.currency} {task.fee}</h4>
                    {task.deadline?(
                    <div>
                        <strong>Deadline</strong>
                        <span>{moment.utc(task.deadline).local().format('Do, MMMM YYYY, h:mm a')}</span>
                    </div>
                        ):''}
                    <div dangerouslySetInnerHTML={{__html: task.description}}/>
                </div>
                    )}
            </div>

        );
    }
}
