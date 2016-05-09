import React from 'react'
import moment from 'moment'
import { Link } from 'react-router'
import Progress from './status/Progress'
import TagList from './TagList'
import Avatar from './Avatar'

export default class TaskHead extends React.Component {

    render() {
        const { task } = this.props;

        return (
            <div>
                <h3 className="title"><Link to={`/task/${task.id}/`}>{task.title}</Link></h3>
                {task.details?(
                <div>
                    <Avatar src={task.details.user.avatar_url}/> <Link to={`/member/${task.user}/`}>{task.details.user.display_name}</Link>
                    <TagList tags={task.details.skills}/>
                    <div>
                        <strong>Created</strong> <span>{moment.utc(task.created_at).local().format('Do, MMMM YYYY, h:mm a')}</span>
                    </div>
                </div>
                    ):''}
            </div>
        );
    }
}
