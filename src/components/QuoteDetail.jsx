import React from 'react';
import {Link} from 'react-router';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import { Table } from 'react-bootstrap';

import FormStatus from './status/FormStatus';

import {DEVELOPER_FEE, STATUS_SUBMITTED, STATUS_APPROVED, STATUS_DECLINED, STATUS_ACCEPTED, STATUS_REJECTED} from '../constants/Api';
import {isProjectManager, isAdmin, isProjectOwner} from '../utils/auth';

momentLocalizer(moment);

export default class QuoteDetail extends React.Component {

    getTotalHours() {
        const quote = this.props.quote || {};
        if(!quote.activities || !quote.activities.length) {
            return 0;
        }
        return quote.activities.map(function (activity) {
            return activity.hours;
        }).reduce((a,b) => {
            return parseInt(a)+parseInt(b);
        });
    }

    onChangeStatus(status) {
        const { QuoteActions } = this.props;
        const quote = this.props.quote || {};
        const task = this.props.task || {};

        QuoteActions.updateQuote(quote.id, {status});
        return;
    }

    render() {
        const { Quote } = this.props;
        const task = this.props.task || {};
        const quote = this.props.quote || {};
        console.log('quote', quote, isProjectManager(), [STATUS_SUBMITTED, STATUS_APPROVED, STATUS_ACCEPTED].indexOf(quote.status) == -1);

        return (
            <div>
                <FormStatus loading={Quote.detail.isSaving}
                            success={Quote.detail.isSaved}
                            message={'Quote saved successfully'}
                            error={Quote.detail.error.create}/>

                <div className="form-group">
                    <h4>Introduction:</h4>
                    <div>{quote.introduction}</div>
                </div>

                <h3>Scope:</h3>
                <div className="form-group">
                    <h4>In scope:</h4>
                    <div>{quote.in_scope}</div>
                </div>

                <div className="form-group">
                    <h4>Out of scope:</h4>
                    <div>{quote.out_scope}</div>
                </div>

                <div className="form-group">
                    <h4>Assumptions:</h4>
                    <div>{quote.assumptions}</div>
                </div>

                <div className="form-group">
                    <h4>Delivearables:</h4>
                    <div>{quote.deliverables}</div>
                </div>

                <h3>Solution:</h3>
                <div className="form-group">
                    <h4>Architecture:</h4>
                    <div>{quote.architecture}</div>
                </div>

                <div className="form-group">
                    <h4>Technology:</h4>
                    <div>{quote.technology}</div>
                </div>

                <h3>Methodology</h3>
                <div className="form-group">
                    <h4>Process:</h4>
                    <div>{quote.process}</div>
                </div>

                <div className="form-group">
                    <h4>Reporting:</h4>
                    <div>{quote.reporting}</div>
                </div>

                <div className="form-group">
                    <h4>Activities:</h4>
                    {quote.activities && quote.activities.length?(
                        <Table>
                            <thead>
                            <tr>
                                <th>Title</th>
                                <th>Hours</th>
                                <th>Fee</th>
                                <th>Description</th>
                            </tr>
                            </thead>
                            <tbody>

                            {quote.activities.map((activity, idx) => {
                                return (
                                    <tr>
                                        <td>{activity.title}</td>
                                        <td>{activity.hours} hrs</td>
                                        <td>€{DEVELOPER_FEE*activity.hours}</td>
                                        <td>{activity.description}</td>
                                    </tr>
                                )
                            })}
                            </tbody>
                            <tfoot>
                            <tr>
                                <th>Totals</th>
                                <th>{this.getTotalHours()} hrs</th>
                                <th>€{DEVELOPER_FEE*this.getTotalHours()}</th>
                                <th></th>
                            </tr>
                            </tfoot>
                        </Table>
                    ):null}
                </div>

                <div className="form-group">
                    <h4>Planning:</h4>

                    {quote.plan && quote.plan.length?(
                        <Table>
                            <thead>
                            <tr>
                                <th>Milestone</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Description</th>
                            </tr>
                            </thead>
                            <tbody>

                            {quote.plan.map((milestone, idx) => {
                                return (
                                    <tr>
                                        <td>{milestone.title}</td>
                                        <td>{moment.utc(milestone.start_date).local().format('Do, MMMM YYYY, h:mm a')}</td>
                                        <td>{moment.utc(milestone.end_date).local().format('Do, MMMM YYYY, h:mm a')}</td>
                                        <td>{milestone.description}</td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </Table>
                    ):null}
                </div>

                <div className="text-center clearfix">
                    {isProjectManager() && [STATUS_SUBMITTED, STATUS_APPROVED, STATUS_ACCEPTED].indexOf(quote.status) == -1?(
                        <div>
                            <Link to={`/work/${quote.task}/quote/${quote.id}/edit`}
                                  className="btn">
                                Edit Quote
                            </Link>
                            <button type="submit"
                                    className="btn"
                                    disabled={Quote.detail.isSaving}
                                    onClick={this.onChangeStatus.bind(this, STATUS_SUBMITTED)}>
                                Submit for Review</button>
                        </div>
                    ):null}

                    {isAdmin() && quote.status == STATUS_SUBMITTED?(
                        <div>
                            <button type="submit"
                                    className="btn"
                                    disabled={Quote.detail.isSaving}
                                    onClick={this.onChangeStatus.bind(this, STATUS_APPROVED)}>
                                Approve</button>
                            <button type="submit"
                                    className="btn"
                                    disabled={Quote.detail.isSaving}
                                    onClick={this.onChangeStatus.bind(this, STATUS_DECLINED)}>
                                Decline</button>
                        </div>
                    ):null}

                    {isProjectOwner() && quote.status == STATUS_APPROVED?(
                        <div>
                            <button type="submit"
                                    className="btn"
                                    isabled={Quote.detail.isSaving}
                                    onClick={this.onChangeStatus.bind(this, STATUS_ACCEPTED)}>
                                Accept</button>
                            <button type="submit"
                                    className="btn"
                                    disabled={Quote.detail.isSaving}
                                    onClick={this.onChangeStatus.bind(this, STATUS_REJECTED)}>
                                Reject</button>
                        </div>
                    ):null}
                </div>
            </div>

        );
    }
}
