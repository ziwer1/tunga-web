import React from 'react';
import {Link, IndexLink} from 'react-router';
import moment from 'moment';
import _ from 'lodash';

import Progress from './status/Progress';
import LoadMore from './status/LoadMore';
import GenericListContainer from '../containers/GenericListContainer';

import {ENDPOINT_TASK} from '../constants/Api';

import {
  isAdmin,
  isDeveloper,
  isProjectManager,
  isProjectOwner,
} from '../utils/auth';

export default class PaymentList extends GenericListContainer {
  constructor(props) {
    super(props);
    this.state = {...this.state, toPay: [], toDistribute: []};
  }

  componentDidUpdate(prevProps, prevState) {
    super.componentDidUpdate(prevProps, prevState);

    if (
      prevProps.location &&
      this.props.location &&
      prevProps.location.pathname != this.props.location.pathname
    ) {
      this.getList();
    }

    if (prevProps.search != this.props.search) {
      this.setState({
        selection_key: this.state.selection_key + (this.props.search || ''),
        prev_key: this.state.selection_key,
      });
    }

    if (
      this.props.Task.MultiTaskPayment.detail.isSaved &&
      !prevProps.Task.MultiTaskPayment.detail.isSaved
    ) {
      const {router} = this.context;
      router.replace(
        `/payments/bulk/${this.props.Task.MultiTaskPayment.detail
          .multi_task_payment.id}`,
      );
    }
  }

  getList(filters) {
    var payment_status = this.props.params.filter || null;
    this.props.TaskActions.listTasks(
      {payment_status, filter: 'payments'},
      this.state.selection_key,
      this.state.prev_key,
    );
  }

  getPaymentStatusFilter() {
    return this.props.params.filter || null;
  }

  isDistributionMode() {
    return this.getPaymentStatusFilter() == 'distribute';
  }

  onSelectTask(task, e) {
    let targetState = this.isDistributionMode()
      ? this.state.toDistribute
      : this.state.toPay;
    let tasks = [...targetState];
    if (e.target.checked) {
      tasks = [...targetState, task];
    } else {
      _.remove(tasks, content => {
        return task.id == content.id;
      });
    }
    let new_state = {},
      stateKey = this.isDistributionMode() ? 'toDistribute' : 'toPay';
    new_state[stateKey] = tasks;
    this.setState(new_state);
  }

  totalPayAmount() {
    return _.reduce(
      this.isDistributionMode() ? this.state.toDistribute : this.state.toPay,
      function(sum, task) {
        return sum + parseFloat(task.pay);
      },
      0,
    );
  }

  isTaskSelected(task) {
    let idx = _.findIndex(
      this.isDistributionMode() ? this.state.toDistribute : this.state.toPay,
      ['id', task.id],
    );
    return idx > -1;
  }

  onPay() {
    const {Task, TaskActions} = this.props;
    let task_info = {
        //amount: this.totalPayAmount(),
        distribute_only: this.isDistributionMode(),
      },
      tasks = (this.isDistributionMode()
        ? this.state.toDistribute
        : this.state.toPay).map(task => {
        return task.id;
      });
    if (this.isDistributionMode()) {
      task_info.distribute_tasks = tasks;
      task_info.withhold_tunga_fee = true;
    } else {
      task_info.tasks = tasks;
    }
    TaskActions.createMultiTaskPayment(task_info);
  }

  render() {
    const {Task, TaskActions} = this.props;

    const all_tasks = Task.list.ids[this.state.selection_key] || [],
      totalPay = this.totalPayAmount();

    return (
      <div>
        <h2>Payments</h2>

        <ul className="nav nav-pills nav-top-filter">
          <li role="presentation">
            <IndexLink to="/payments" activeClassName="active">
              All
            </IndexLink>
          </li>
          <li role="presentation">
            <Link to="/payments/filter/pending" activeClassName="active">
              Pending
            </Link>
          </li>
          <li role="presentation">
            <Link to="/payments/filter/processing" activeClassName="active">
              Processing
            </Link>
          </li>
          <li role="presentation">
            <Link to="/payments/filter/paid" activeClassName="active">
              Paid
            </Link>
          </li>
          {isAdmin()
            ? <li role="presentation">
                <Link to="/payments/filter/distribute" activeClassName="active">
                  Distribute
                </Link>
              </li>
            : null}
        </ul>

        {totalPay
          ? <div className="form-group clearfix">
              <button
                className="btn pull-right"
                onClick={this.onPay.bind(this)}>
                {this.isDistributionMode() ? 'Distribute' : 'Pay'} €{totalPay}
              </button>
            </div>
          : null}

        {Task.list.isFetching || Task.MultiTaskPayment.detail.isSaving
          ? <Progress />
          : <div>
              {all_tasks.length
                ? <table className="table table-striped table-responsive">
                    <thead>
                      <tr>
                        <th>Task</th>
                        <th>Date</th>
                        {isDeveloper()
                          ? [
                              <th>Pledge</th>,
                              <th>Payment fee</th>,
                              <th>Tunga fee</th>,
                              <th>To Receive</th>,
                            ]
                          : [
                          <th>Pledge</th>,
                          <th>Developers</th>
                        ]}
                        <th>Invoice</th>
                        <th>Status</th>
                        {isAdmin() || isProjectOwner()
                          ? <th>Select To Pay</th>
                          : null}
                      </tr>
                    </thead>
                    <tbody>
                      {all_tasks.map(id => {
                        const task = Task.list.tasks[id];
                        const invoice = task.invoice || {
                          amount: task.amount,
                          developer_amount: {},
                          created_at: task.invoice_date,
                        };
                        return (
                          <tr key={task.id}>
                            <td>
                              <Link to={`/work/${task.id}/`}>
                                {task.summary}
                              </Link>
                            </td>
                            <td>
                              {moment
                                .utc(invoice.created_at || task.closed_at)
                                .local()
                                .format('D/MMM/YYYY')}
                            </td>
                            {isDeveloper() && invoice.amount
                              ? [
                                  <td>
                                    {invoice.amount.currency}
                                    {parseFloat(invoice.amount.pledge).toFixed(
                                      2,
                                    )}
                                  </td>,
                                  <td>
                                    {invoice.amount.currency}
                                    {parseFloat(
                                      invoice.developer_amount.processing || 0,
                                    ).toFixed(2)}
                                  </td>,
                                  <td>
                                    {invoice.amount.currency}
                                    {parseFloat(
                                      invoice.developer_amount.tunga || 0,
                                    ).toFixed(2)}
                                  </td>,
                                  <td>
                                    {invoice.amount.currency}
                                    {parseFloat(
                                      invoice.developer_amount.developer || 0,
                                    ).toFixed(2)}
                                  </td>,
                                ]
                              : [
                              <td>
                                {task.display_fee}
                              </td>,
                              <td>
                                {task.details && task.details.active_participants?(
                                  <div>
                                    {task.details.active_participants.map(participant => {
                                      let dev = participant.user || participant;
                                      return (
                                        <div><a href={`/people/${dev.username}`} target="_blank">{dev.display_name}</a></div>
                                      );
                                    })}
                                  </div>
                                ):null}
                              </td>
                            ]}
                            <td>
                              {task.invoice
                                ? <div>
                                    <a
                                      href={`${ENDPOINT_TASK}${task.id}/download/invoice/?format=pdf&type=client`}
                                      target="_blank">
                                      <span>
                                        <i className="fa fa-download" />{' '}
                                        {isDeveloper() ||
                                        isProjectManager() ||
                                        isAdmin()
                                          ? 'Client'
                                          : 'Download'}{' '}
                                        Invoice(s)
                                      </span>
                                    </a>
                                    <br />
                                    {isDeveloper() || isAdmin()
                                      ? <div>
                                          <a
                                            href={`${ENDPOINT_TASK}${task.id}/download/invoice/?format=pdf&type=developer`}
                                            target="_blank">
                                            <span>
                                              <i className="fa fa-download" />{' '}
                                              Developer Invoice(s)
                                            </span>
                                          </a>
                                          <br />
                                          <a
                                            href={`${ENDPOINT_TASK}${task.id}/download/invoice/?format=pdf&type=tunga`}
                                            target="_blank">
                                            <span>
                                              <i className="fa fa-download" />{' '}
                                              Tunga Invoice(s)
                                            </span>
                                          </a>
                                        </div>
                                      : null}
                                  </div>
                                : <div>
                                    Contact{' '}
                                    <a href="mailto:hello@tunga.io">
                                      hello@tunga.io
                                    </a>
                                  </div>}
                            </td>
                            <td>
                              {isProjectOwner() &&
                              !isAdmin() &&
                              task.payment_status == 'Processing'
                                ? 'Paid'
                                : task.payment_status}
                            </td>
                            <td>
                              {(task.payment_status == 'Pending' &&
                                (isProjectOwner() || isAdmin())) ||
                              (isAdmin() && this.isDistributionMode())
                                ? <input
                                    type="checkbox"
                                    className="tasks_to_pay"
                                    value={task.id}
                                    checked={this.isTaskSelected(task)}
                                    onChange={this.onSelectTask.bind(
                                      this,
                                      task,
                                    )}
                                  />
                                : null}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                : <div className="alert alert-info">
                    No payments to display
                  </div>}
              {all_tasks.length && Task.list.next
                ? <LoadMore
                    url={Task.list.next}
                    callback={x => {
                      TaskActions.listMoreTasks(x, this.state.selection_key);
                    }}
                    loading={Task.list.isFetchingMore}
                  />
                : null}
            </div>}
        {totalPay
          ? <div className="form-group clearfix">
              <button
                className="btn pull-right"
                onClick={this.onPay.bind(this)}>
                {this.isDistributionMode() ? 'Distribute' : 'Pay'} €{totalPay}
              </button>
            </div>
          : null}
      </div>
    );
  }
}

PaymentList.contextTypes = {
  router: React.PropTypes.object.isRequired,
};
