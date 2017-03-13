import React from 'react';
import {Link} from 'react-router';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import { Table } from 'react-bootstrap';

import FormStatus from './status/FormStatus';

import {DEVELOPER_FEE, STATUS_SUBMITTED, STATUS_APPROVED, STATUS_DECLINED, STATUS_ACCEPTED, STATUS_REJECTED} from '../constants/Api';
import {getPayDetails, canEditEstimate, canModerateEstimate, canReviewEstimate} from '../utils/tasks';
import confirm from '../utils/confirm';

momentLocalizer(moment);

export default class EstimateDetail extends React.Component {

    onChangeStatus(status) {
        const { EstimateActions } = this.props;
        const estimate = this.props.estimate || {};

        if([STATUS_DECLINED, STATUS_REJECTED].indexOf(status) > -1) {
            confirm('Are you sure?', true, {placeholder: 'Reason'}).then(
                function (response) {
                    var estimate_info = {status};
                    if(status == STATUS_DECLINED) {
                        estimate_info.moderator_comment = response;
                    } else {
                        estimate_info.reviewer_comment = response;
                    }
                    EstimateActions.updateEstimate(estimate.id, {status, moderator_comment: response});
                }
            );
        } else {
            confirm('Are you sure?').then(
                function () {
                    EstimateActions.updateEstimate(estimate.id, {status});
                }
            );
        }
        return;
    }

    render() {
        const { Estimate } = this.props;
        const task = this.props.task || {};
        const estimate = this.props.estimate || {};

        let payDetails = getPayDetails(estimate.activities);

        return (
            <div className="estimate-presentation">
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
                                <th colSpan="4">Sub Totals</th>
                            </tr>
                            <tr>
                                <th>Development</th>
                                <th>{payDetails.dev.hours} hrs</th>
                                <th>€{payDetails.dev.fee}</th>
                                <th></th>
                            </tr>
                            <tr>
                                <th>Project Management</th>
                                <th>{payDetails.pm.hours} hrs</th>
                                <th>€{payDetails.pm.fee}</th>
                                <th></th>
                            </tr>
                            <tr>
                                <th>Total</th>
                                <th>{payDetails.total.hours} hrs</th>
                                <th>€{payDetails.total.fee}</th>
                                <th></th>
                            </tr>
                            </tfoot>
                        </Table>
                    ):null}

                </div>

                <div className="form-group">
                    <h4>Planning:</h4>
                    <div className="row">
                        <div className="col-md-6">
                            <h5>Start Date</h5>
                            {moment.utc(estimate.start_date).local().format('Do, MMMM YYYY, h:mm a')}
                        </div>
                        <div className="col-md-6">
                            <h5>End Date</h5>
                            {moment.utc(estimate.end_date).local().format('Do, MMMM YYYY, h:mm a')}
                        </div>
                    </div>
                </div>

                <div className="text-center clearfix">
                    {canEditEstimate(task)?(
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
                    ):(
                        canModerateEstimate(task)?(
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
                        ):(
                            canReviewEstimate(task)?(
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
                            ):null
                        )
                    )}
                </div>
            </div>

        );
    }
}
