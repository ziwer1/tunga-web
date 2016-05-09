import React from 'react'
import { Link } from 'react-router'
import moment from 'moment'
import Progress from './status/Progress'

export default class PaymentCard extends React.Component {
    render() {
        const { Auth, task } = this.props;

        return (
            <div className="well card">
                <div className="pledge">{task.display_fee}</div>
                <h4>{task.title}</h4>
                {task.closed && !task.paid && task.closed_at?(
                <div>
                    Closed on {moment.utc(task.closed_at).local().format('Do, MMMM YYYY')}
                </div>
                    ):''}
                {task.paid && task.paid_at?(
                <div>
                    Paid on {moment.utc(task.paid_at).local().format('Do, MMMM YYYY')}
                </div>
                    ):''}
            </div>
        );
    }
}
