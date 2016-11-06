import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import btoa from 'btoa';

export default class PaymentCard extends React.Component {
    render() {
        const { Auth, task } = this.props;
        const task_url = `${window.location.protocol}//${window.location.host}/task/${task.id}/`;

        return (
            <div className="card">
                <div className="pledge">{task.display_fee}</div>
                <h4><Link to={`/task/${task.id}/`}>{task.title}</Link></h4>
                {task.closed && !task.paid?(
                <div>
                    {task.closed_at?(
                    <p>Closed on {moment.utc(task.closed_at).local().format('Do, MMMM YYYY')}</p>
                        ):null}
                    {Auth.user.id == task.user.id || Auth.user.is_staff?(
                    <p><Link to={`/task/${task.id}/`}>Go to Payment</Link></p>
                        ):null}
                </div>
                    ):''}
                {task.paid?(
                <div>
                    {task.paid_at?(
                    <p>Paid on {moment.utc(task.paid_at).local().format('Do, MMMM YYYY')}</p>
                        ):null}
                    <p>
                        <a target="_blank" href={'https://mobbr.com/#/task/'+btoa(task_url)+'/payments'}>
                            View payment on Mobbr <i className="fa fa-external-link"/>
                        </a>
                    </p>
                </div>
                    ):''}
            </div>
        );
    }
}
