import React from 'react'
import { Link } from 'react-router'
import moment from 'moment'
import TagList from './TagList'
import Avatar from './Avatar'
import Progress from './status/Progress'
import CommentSection from '../containers/CommentSection'
import ProgressReportForm from './ProgressReportForm'

export default class Milestone extends React.Component {

    constructor(props) {
        super(props);
        this.state = {editReport: false};
    }

    componentDidMount() {
        this.props.MilestoneActions.retrieveMilestone(this.props.milestone_id);
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.ProgressReport.detail.isSaved && !prevProps.ProgressReport.detail.isSaved) {
            this.setState({editReport: false});
        }
    }

    onEditReport() {
        this.setState({editReport: true});
    }

    renderChildren() {
        return React.Children.map(this.props.children, function (child) {
            return React.cloneElement(child, {
                Auth: this.props.Auth,
                Milestone: this.props.Milestone,
                milestone: this.props.Milestone.detail,
                MilestoneActions: this.props.MilestoneActions,
                ProgressReport: this.props.ProgressReport,
                ProgressReportActions: this.props.ProgressReportActions,
            });
        }.bind(this));
    }

    render() {
        const { Auth, Milestone, MilestoneActions, ProgressReport, ProgressReportActions } = this.props;
        const { milestone } = Milestone.detail;
        const { report } = milestone;

        const timestamp = moment.utc(milestone.due_at).unix();
        const ts_now = moment.utc().unix();
        let is_missed = ((timestamp + 24*60*60) < ts_now && milestone.type); // Developers have 24 hrs before a task update is missed

        return (
            Milestone.detail.isRetrieving?
            (<Progress/>)
            :milestone.id?(
            <div>
                <div style={{marginBottom: '10px'}}>
                    {milestone.due_at?(
                    <div><strong>Due Date:</strong> {moment.utc(milestone.due_at).local().format('Do, MMMM YYYY, h:mm a')}</div>
                        ):null}

                    {milestone.description?(
                    <div>
                        <strong>Description</strong>
                        <div className="description" dangerouslySetInnerHTML={{__html: milestone.description}}/>
                    </div>
                        ):null}
                </div>


                {report && (!this.state.editReport || !Auth.user.is_developer)?(
                <div>
                    <h4>Progress Report</h4>
                    <p>
                        <strong>Status: </strong><span>{report.status_display}</span>
                    </p>
                    <p>
                        <strong>Percentage completed: </strong><span>{report.percentage || 0} %</span>
                    </p>
                    {report.accomplished?(
                    <div>
                        <strong>Accomplished</strong>
                        <div dangerouslySetInnerHTML={{__html: report.accomplished}}/>
                    </div>
                        ):null}
                    {report.uploads && report.uploads.length?(
                    <div>
                        <strong>Files</strong>
                        {report.uploads.map(upload => {
                            return (
                            <div key={upload.id} className="file">
                                <a href={upload.url}><i className="fa fa-download"/> {upload.name} <strong>[{upload.display_size}]</strong></a>
                            </div>
                                );
                            })}
                    </div>
                        ):null}
                    {report.next_steps?(
                    <div>
                        <strong>Next steps</strong>
                        <div dangerouslySetInnerHTML={{__html: report.next_steps}}/>
                    </div>
                        ):null}
                    {report.remarks?(
                    <div>
                        <strong>Remarks</strong>
                        <div dangerouslySetInnerHTML={{__html: report.remarks}}/>
                    </div>
                        ):null}
                    {report.user?(
                    <div>
                        <strong>Posted by</strong>
                        <div>
                            <Avatar src={report.user.avatar_url}/> <Link to={`/member/${report.user.id}/`}>{report.user.display_name}</Link>
                        </div>
                    </div>
                        ):null}
                    {Auth.user.is_developer && !is_missed?(
                    <button className="btn " onClick={this.onEditReport.bind(this)}><i className="fa fa-pencil"/> Edit Report</button>
                        ):null}
                </div>
                    ):(
                    is_missed?(
                    <div>
                        <strong>{event.type == 3?'Milestone':'Update'} missed</strong>
                    </div>
                        ):(
                    Auth.user.is_developer?(
                    <ProgressReportForm milestone={milestone}
                                        progress_report={report}
                                        ProgressReport={ProgressReport}
                                        ProgressReportActions={ProgressReportActions}/>
                        ):null
                        )
                    )}
            </div>
        ):(
            <div className="alert alert-danger">Milestone not found</div>
        )
        );
    }
}
