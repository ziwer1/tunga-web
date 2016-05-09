import React from 'react'
import { Link, IndexLink } from 'react-router'
import Progress from './status/Progress'
import LoadMore from './status/LoadMore'
import PaymentCard from './PaymentCard'

export default class PaymentList extends React.Component {

    componentDidMount() {
        var paid = this.props.params.filter == 'history'?'True':'False';
        this.props.TaskActions.listTasks({closed: 'True', paid});
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.location.pathname != this.props.location.pathname) {
            var paid = this.props.params.filter == 'history'?'True':'False';
            this.props.TaskActions.listTasks({closed: 'True', paid});
        }
    }

    render() {
        const { Auth, Task, TaskActions } = this.props;
        return (
            <div>
                <h2>{this.props.params.filter == 'history'?'History':'Pending Payments'}</h2>
                {Task.list.isFetching?
                    (<Progress/>)
                    :
                    (<div>
                        <div className="row flex-row">
                            {Task.list.ids.map((id) => {
                                const task = Task.list.tasks[id];
                                return(
                                <div className="col-md-4" key={id}>
                                    <PaymentCard Auth={Auth} task={task} TaskActions={TaskActions}/>
                                </div>
                                    );
                                })}
                        </div>
                        <LoadMore url={Task.list.next} callback={TaskActions.listMoreTasks} loading={Task.list.isFetchingMore}/>
                        {Task.list.ids.length?'':(
                        <div className="alert alert-info">No payments to display</div>
                            )}
                    </div>)
                    }
            </div>
        );
    }
}
