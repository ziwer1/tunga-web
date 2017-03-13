import React from 'react';
import { Link, IndexLink } from 'react-router';
import { Table } from 'react-bootstrap';
import moment from 'moment';
import Progress from './status/Progress';
import LoadMore from './status/LoadMore';

import { ENDPOINT_TASK } from '../constants/Api';

import { isAdmin, isDeveloper } from '../utils/auth';

export default class PaymentList extends React.Component {

    componentDidMount() {
        var payment_status = this.props.params.filter || null;
        this.props.TaskActions.listTasks({payment_status, filter: 'payments'});
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.location.pathname != this.props.location.pathname) {
            var payment_status = this.props.params.filter || null;
            this.props.TaskActions.listTasks({payment_status, filter: 'payments'});
        }
    }

    render() {
        const { Task, TaskActions } = this.props;
        return (
            <div>
                <h2>Payments</h2>

                <ul className="nav nav-pills nav-top-filter">
                    <li role="presentation"><IndexLink to="/payments" activeClassName="active">All</IndexLink></li>
                    <li role="presentation"><Link to="/payments/pending" activeClassName="active">Pending</Link></li>
                    <li role="presentation"><Link to="/payments/processing" activeClassName="active">Processing</Link></li>
                    <li role="presentation"><Link to="/payments/paid" activeClassName="active">Paid</Link></li>
                </ul>
                {Task.list.isFetching?
                    (<Progress/>)
                    :
                    (<div>
                        {Task.list.ids.length?(
                            <Table>
                                <thead>
                                <tr>
                                    <th>Task</th>
                                    <th>Date</th>
                                    {isDeveloper()?(
                                        [
                                            <th>Pledge</th>,
                                            <th>Payment fee</th>,
                                            <th>Tunga fee</th>,
                                            <th>To Receive</th>
                                        ]
                                    ):(
                                        <th>Pledge</th>
                                    )}
                                    <th>Invoice</th>
                                    <th>Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                {Task.list.ids.map((id) => {
                                    const task = Task.list.tasks[id];
                                    const invoice = task.invoice || {
                                            amount: task.amount,
                                            developer_amount: {},
                                            created_at: task.invoice_date
                                        };
                                    return(
                                        <tr key={task.id}>
                                            <td><Link to={`/work/${task.id}/`}>{task.summary}</Link></td>
                                            <td>{moment.utc(invoice.created_at || task.closed_at).local().format('D/MMM/YYYY')}</td>
                                            {isDeveloper()?(
                                                [
                                                    <td>{invoice.amount.currency}{parseFloat(invoice.amount.pledge).toFixed(2)}</td>,
                                                    <td>{invoice.amount.currency}{parseFloat(invoice.developer_amount.processing || 0).toFixed(2)}</td>,
                                                    <td>{invoice.amount.currency}{parseFloat(invoice.developer_amount.tunga || 0).toFixed(2)}</td>,
                                                    <td>{invoice.amount.currency}{parseFloat(invoice.developer_amount.developer || 0).toFixed(2)}</td>
                                                ]
                                            ):(
                                                <td>{task.display_fee}</td>
                                            )}
                                            <td>
                                                {task.invoice?(
                                                    <div>
                                                        <a href={`${ENDPOINT_TASK}${task.id}/download/invoice/?format=pdf&type=client`}
                                                           target="_blank">
                                                            <span><i className="fa fa-download"/> {isDeveloper() || isAdmin()?'Client':'Download'} Invoice(s)</span>
                                                        </a><br/>
                                                        {isDeveloper() || isAdmin()?(
                                                            <a href={`${ENDPOINT_TASK}${task.id}/download/invoice/?format=pdf&type=developer`}
                                                               target="_blank">
                                                                <span><i className="fa fa-download"/> Developer Invoice(s)</span>
                                                            </a>
                                                        ):null}
                                                    </div>
                                                ):(
                                                    <div>Contact <a href="mailto:support@tunga.io">support@tunga.io</a></div>
                                                )}
                                            </td>
                                            <td>{task.payment_status}</td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </Table>
                        ):(
                        <div className="alert alert-info">No payments to display</div>
                            )}
                        <LoadMore url={Task.list.next} callback={TaskActions.listMoreTasks} loading={Task.list.isFetchingMore}/>
                    </div>)
                    }
            </div>
        );
    }
}
