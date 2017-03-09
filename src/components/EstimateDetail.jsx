import React from 'react';
import {Link} from 'react-router';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import { Table } from 'react-bootstrap';

import FormStatus from './status/FormStatus';

import {DEVELOPER_FEE, STATUS_SUBMITTED, STATUS_APPROVED, STATUS_DECLINED, STATUS_ACCEPTED, STATUS_REJECTED} from '../constants/Api';
import {isProjectManager, isAdmin, isProjectOwner} from '../utils/auth';

momentLocalizer(moment);

export default class EstimateDetail extends React.Component {

    getTotalHours() {
        const estimate = this.props.estimate || {};
        if(!estimate.activities || !estimate.activities.length) {
            return 0;
        }
        return estimate.activities.map(function (activity) {
            return activity.hours;
        }).reduce((a,b) => {
            return parseInt(a)+parseInt(b);
        });
    }

    onChangeStatus(status) {
        const { EstimateActions } = this.props;
        const estimate = this.props.estimate || {};

        EstimateActions.updateEstimate(estimate.id, {status});
        return;
    }

    render() {
        const { Estimate } = this.props;
        const task = this.props.task || {};
        const estimate = this.props.estimate || {};

        return (
            <div>
                <FormStatus loading={Estimate.detail.isSaving}
                            success={Estimate.detail.isSaved}
                            message={'Estimate saved successfully'}
                            error={Estimate.detail.error.create}/>

                <div className="form-group">
                    <h4>Introduction:</h4>
                    <div>{estimate.introduction}</div>
                </div>

                <div className="form-group">
                    <h4>Activities:</h4>
                    {estimate.activities && estimate.activities.length?(
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

                            {estimate.activities.map((activity, idx) => {
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

                <div className="text-center clearfix">
                    {isProjectManager() && [STATUS_SUBMITTED, STATUS_APPROVED, STATUS_ACCEPTED].indexOf(estimate.status) == -1?(
                        <div>
                            <Link to={`/work/${estimate.task}/estimate/${estimate.id}/edit`}
                                  className="btn">
                                Edit Estimate
                            </Link>
                            <button type="submit"
                                    className="btn"
                                    disabled={Estimate.detail.isSaving}
                                    onClick={this.onChangeStatus.bind(this, STATUS_SUBMITTED)}>
                                Submit for Review</button>
                        </div>
                    ):null}

                    {isAdmin() && estimate.status == STATUS_SUBMITTED?(
                        <div>
                            <button type="submit"
                                    className="btn"
                                    disabled={Estimate.detail.isSaving}
                                    onClick={this.onChangeStatus.bind(this, STATUS_APPROVED)}>
                                Approve</button>
                            <button type="submit"
                                    className="btn"
                                    disabled={Estimate.detail.isSaving}
                                    onClick={this.onChangeStatus.bind(this, STATUS_DECLINED)}>
                                Decline</button>
                        </div>
                    ):null}

                    {isProjectOwner() && estimate.status == STATUS_APPROVED?(
                        <div>
                            <button type="submit"
                                    className="btn"
                                    isabled={Estimate.detail.isSaving}
                                    onClick={this.onChangeStatus.bind(this, STATUS_ACCEPTED)}>
                                Accept</button>
                            <button type="submit"
                                    className="btn"
                                    disabled={Estimate.detail.isSaving}
                                    onClick={this.onChangeStatus.bind(this, STATUS_REJECTED)}>
                                Reject</button>
                        </div>
                    ):null}
                </div>
            </div>

        );
    }
}
