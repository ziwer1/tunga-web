import React from 'react'
import Progress from './status/Progress'
import FormStatus from './status/FormStatus'
import FieldError from './status/FieldError'

import { TASK_PAYMENT_METHOD_CHOICES, TASK_PAYMENT_METHOD_BITONIC, TASK_PAYMENT_METHOD_BITCOIN, TASK_PAYMENT_METHOD_BANK, ENDPOINT_TASK } from '../constants/Api'

export default class TaskPay extends React.Component {

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {showForm: true};
    }

    componentDidMount() {
        const { Task, TaskActions } = this.props;
        const { task, Invoice } =  Task.detail;
        if(task.id && task.payment_method) {
            TaskActions.retrieveTaskInvoice(task.id);
            this.setState({showForm: false});
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.Task.detail.Invoice.isSaved && !prevProps.Task.detail.Invoice.isSaved) {
            const { Task } = this.props;
            const { task, Invoice } =  Task.detail;

            this.setState({showForm: false});

            if(Invoice.invoice.payment_method == TASK_PAYMENT_METHOD_BITONIC) {
                window.location.href = `${ENDPOINT_TASK}${task.id}/pay/bitonic/`;
            }
        }
    }

    changePayMethod() {
        this.setState({showForm: true});
    }

    handleSubmit(e) {
        e.preventDefault();
        var fee = this.refs.fee.value.trim();
        var payment_method = this.refs.payment_method.value.trim();

        const { Task, TaskActions } = this.props;
        const { task } =  Task.detail;
        TaskActions.createTaskInvoice(task.id, {fee, payment_method});
    }

    render() {
        const { Task, Auth } = this.props;
        const { task, Invoice } =  Task.detail;
        const { invoice } =  Invoice;

        var btc_amount = null;
        var btc_address = null;
        if(invoice) {
            btc_amount = parseFloat(invoice.fee/invoice.btc_price).toFixed(6);
            btc_address = `bitcoin:${invoice.btc_address}?amount=${btc_amount}&message=${invoice.summary}`;
        }

        return (
            <div>
                {Task.detail.isRetrieving || Task.detail.Invoice.isRetrieving?
                    (<Progress/>)
                    :
                    (<div style={{marginTop: '20px'}}>
                        <h4 className="title">Make Payment</h4>

                        {this.state.showForm || !invoice.id?(
                            <form onSubmit={this.handleSubmit.bind(this)} name="task" role="form" ref="invoice_form">

                                <FormStatus loading={Task.detail.Invoice.isSaving}
                                            success={Task.detail.Invoice.isSaved}
                                            message={'Invoice saved successfully'}
                                            error={Task.detail.Invoice.error.create}/>

                                {(Task.detail.Invoice.error.create && Task.detail.Invoice.error.create.fee)?
                                    (<FieldError message={Task.detail.Invoice.error.create.fee}/>):null}
                                <div className="form-group">
                                    <label className="control-label">Fee (in Euro) *</label>
                                    <div><input type="text" className="form-control" ref="fee" required placeholder="Fee in €" defaultValue={parseFloat(task.fee).toPrecision(2)}/></div>
                                    <div style={{marginTop: '10px'}}>13% of fee goes to Tunga</div>
                                </div>

                                {(Task.detail.Invoice.error.create && Task.detail.Invoice.error.create.payment_method)?
                                    (<FieldError message={Task.detail.Invoice.error.create.payment_method}/>):null}
                                <div className="form-group">
                                    <div>
                                        <label className="control-label">Payment method</label>
                                        <div>
                                            <select type="text" className="form-control" ref="payment_method">
                                                <option value=''>-- Choose a payment method  --</option>
                                                {TASK_PAYMENT_METHOD_CHOICES.map((payment_method) => {
                                                    return (<option key={payment_method.id} value={payment_method.id}>{payment_method.name}</option>);
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <button type="submit" className="btn btn-default btn-action" disabled={Task.detail.Invoice.isSaving}>Continue</button>
                                </div>
                            </form>
                        ):(
                            <div>
                                <h4>Fee: <i className="fa fa-euro"/> {parseFloat(invoice.fee).toFixed(2)}</h4>

                                {invoice.payment_method == TASK_PAYMENT_METHOD_BITCOIN?(
                                    <div>
                                        <h4>Bitcoin: <i className="fa fa-btc"/> {btc_amount}</h4>

                                        Send exactly BTC <strong>{btc_amount}</strong> to <a href={btc_address}><strong>{invoice.btc_address}</strong></a>

                                        <div>
                                            <img src={`https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${btc_address}`}/>
                                        </div>
                                    </div>
                                ):null}

                                {invoice.payment_method == TASK_PAYMENT_METHOD_BANK?(
                                    <div>
                                        <a href={`${ENDPOINT_TASK}${task.id}/download/invoice/?format=pdf`} target="_blank" className="btn btn-action"><i className="fa fa-download"/> Download Invoice</a>
                                    </div>
                                ):null}

                                {invoice.payment_method == TASK_PAYMENT_METHOD_BITONIC?(
                                    <div>
                                        <a href={`${ENDPOINT_TASK}${task.id}/pay/bitonic/`} className="btn btn-action"><i className="fa fa-money"/> Pay with ideal / mister cash</a>
                                    </div>
                                ):null}

                                {!task.paid?(
                                    <div style={{marginTop: '20px'}}>
                                        <button className="btn btn-default" onClick={this.changePayMethod.bind(this)}><i className="fa fa-pencil"/> Change Payment Method</button>
                                    </div>
                                ):null}
                            </div>
                        )}

                    </div>)
                    }
            </div>
        );
    }
}
