import React from 'react'
import {} from 'react'
import Progress from './status/Progress'
import FormStatus from './status/FormStatus'
import Error from './status/Error'

export default class TaskPay extends React.Component {

    constructor(props) {
        super(props);
        this.state = {users: {}};
    }

    componentDidMount() {
        const { Task, TaskActions } = this.props;
        const { task } =  Task.detail;
        if(task.details && task.details.participation_shares.length) {
            this.parseUsers(task.details.participation_shares);
        }
    }

    parseUsers(participation_shares) {
        var users = {};
        participation_shares.forEach(item => {
            users[item.participant.user.id] = item.percentage;
        });
        this.setState({users});
    }

    getTotalShares() {
        var total = 0;
        Object.keys(this.state.users).forEach(key => {
            total += Math.round(parseFloat(this.state.users[key]) || 0, 2);
        });
        return total;
    }

    getParticipation() {
        var participation = [];
        Object.keys(this.state.users).forEach(key => {
            participation.push({user: key, share: parseFloat(this.state.users[key]).toFixed(2) || 0});
        });
        return participation;
    }

    onShareChange(user, e) {
        var new_user = {};
        new_user[user] = e.target.value;
        this.setState({users: {...this.state.users, ...new_user}})
    }

    handleSubmit(e) {
        e.preventDefault();

        const { Task, TaskActions } = this.props;
        const { task } =  Task.detail;
        TaskActions.updateTask(task.id, {participation: this.getParticipation()});
    }

    render() {
        const { Task, Auth } = this.props;
        const { task } =  Task.detail;
        let total_shares = this.getTotalShares();

        return (
            <div>
                {Task.detail.isRetrieving?
                    (<Progress/>)
                    :
                    (<div style={{marginTop: '20px'}}>
                        <h4 className="title">Participation Shares</h4>

                        <form onSubmit={this.handleSubmit.bind(this)} name="participation" role="form" ref="participation_form">

                            <FormStatus loading={Task.detail.isSaving}
                                        success={Task.detail.isSaved}
                                        message={'Participation details saved successfully'}
                                        error={Task.detail.error.update}/>

                            {(total_shares != 100)?
                                (<Error message={`Shares don't add up to 100 (${total_shares})`}/>):null}

                            {task.details && task.details.participation_shares.length?(
                                <div>
                                    {task.details.participation_shares.map((item) => {
                                        return (
                                            <div key={item.participant.id} className="row form-group">
                                                <div className="col-md-6">
                                                    <label className="control-label">{item.participant.user.display_name}</label>
                                                </div>
                                                <div className="col-md-6">
                                                    <input type="text" className="form-control" required placeholder="Share"
                                                           defaultValue={item.percentage}
                                                           onChange={this.onShareChange.bind(this, item.participant.user.id)}/>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ):null}

                            <div className="text-center">
                                <button type="submit"
                                        className="btn  "
                                        disabled={Task.detail.isSaving || total_shares != 100}>Save</button>
                            </div>
                        </form>

                    </div>)
                    }
            </div>
        );
    }
}
