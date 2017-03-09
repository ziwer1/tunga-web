import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import TimeAgo from 'react-timeago';
import TagList from './TagList';
import Avatar from './Avatar';
import ComponentWithModal from './ComponentWithModal';

import { render_excerpt } from '../utils/html';
import { parse_task_status } from '../utils/tasks';
import { isDeveloper, isProjectManager, isAdmin } from '../utils/auth';
import confirm from '../utils/confirm';

export default class TaskCard extends ComponentWithModal {

    onClaimProject() {
        const {TaskActions, task} = this.props;
        TaskActions.claimTask(task.id);
    }

    onReturnProject() {
        const {TaskActions, task} = this.props;
        confirm('Confirm return project').then(
            function () {
                TaskActions.returnTask(task.id);
            }
        );
    }

    getSplitFee() {
        const { task } = this.props;
        var context_fee = 0;
        if(task && task.amount) {
            if(isDeveloper()) {
                context_fee = task.amount.developer;
            } else {
                context_fee = task.amount.pledge;
            }
        }
        if(!context_fee) {
            return null;
        }
        let float_fee = parseFloat(context_fee).toFixed(2);
        let whole_part = Math.floor(float_fee);
        return {whole: whole_part, decimal: float_fee.substring(whole_part.toString().length+1) || '00'}
    }

    render() {
        const { task } = this.props;
        var task_status = parse_task_status(task);
        let split_fee = this.getSplitFee();
        let work_type = task.is_task?'task':'project';

        return (
            <div className="card task-card">
                <div className="time text-right">
                    Posted <TimeAgo date={moment.utc(task.created_at).local().format()}/>
                </div>
                <div className="top">
                    <div className="clearfix">
                        <div className="task-status pull-right" title={task_status.message}><i className={"fa fa-circle " + task_status.css}/></div>
                        <h3 className="title pull-left"><Link to={`/work/${task.id}/`}>{task.title}</Link></h3>
                    </div>
                    <div className="pledge text-center">
                        {split_fee?(
                            <div>
                                {task.amount?task.amount.currency:'&euro;'}{split_fee.whole}
                                <span className="decimal" style={{fontSize: '50%'}}>{split_fee.decimal}</span>
                            </div>
                        ):(
                            <span>No pledge</span>
                        )}
                    </div>
                    <div className="media">
                        <div className="media-left">
                            <Avatar src={task.user.avatar_url}/>
                        </div>
                        <div className="media-body">
                            <Link to={`/people/${task.user.username}/`}>{task.user.display_name}</Link>
                            <div>{task.user.company}</div>
                        </div>
                    </div>
                    <div>
                        {task.deadline?"Deadline "+moment.utc(task.deadline).local().format('Do, MMMM YYYY'):<span dangerouslySetInnerHTML={{__html: '&nbsp;'}}/>}
                    </div>
                </div>
                <div className="middle">
                    {task.details.skills.length?(
                    <TagList tags={task.details.skills} max={3} linkPrefix="/work/skill/" moreLink={`/work/${task.id}/`}/>
                        ):(
                    <div style={{height: '20px'}}></div>
                        )}
                </div>
                <div className="bottom">
                    <div className="short-description" dangerouslySetInnerHTML={{__html: render_excerpt(task.excerpt)}}/>
                    <div className="actions">
                        {isDeveloper()?(
                        <div className="row">
                            <div className="col-sm-12">
                                {task.can_apply?(
                                <Link to={`/work/${task.id}/apply`} className="btn btn-block">Apply for this {work_type}</Link>
                                    ):(task.closed || !task.apply?(
                                <div className="btn btn-block">Applications are closed for this {work_type}</div>
                                    ):(
                                <div className="btn btn-block" style={{visibility: 'hidden'}}></div>
                                    ))}
                            </div>
                        </div>
                            ):null}

                        {isProjectManager() || isAdmin()?(
                            <div className="row">
                                <div className="col-sm-12">
                                    {task.can_claim?(
                                        <button className="btn btn-block" onClick={this.onClaimProject.bind(this)}>Claim {work_type}</button>
                                    ):(task.can_return?(
                                        <button className="btn btn-block" onClick={this.onReturnProject.bind(this)}>Return {work_type}</button>
                                    ):null)}
                                </div>
                            </div>
                        ):null}
                        <div className="row">
                            <div className="col-sm-12">
                                <Link to={`/work/${task.id}/`} className="btn btn-block">View detailed page</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

TaskCard.propTypes = {
    task: React.PropTypes.object.isRequired
};

TaskCard.defaultProps = {
    task: {}
};
