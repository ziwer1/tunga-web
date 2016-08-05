import React from 'react'
import Progress from './status/Progress'
import FormStatus from './status/FormStatus'
import FieldError from './status/FieldError'

import { TASK_PAYMENT_METHOD_CHOICES, TASK_PAYMENT_METHOD_BITONIC, TASK_PAYMENT_METHOD_BITCOIN, TASK_PAYMENT_METHOD_BANK, ENDPOINT_TASK } from '../constants/Api'
import { objectToQueryString } from '../utils/html'

export default class TaskPay extends React.Component {

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {pay_method: null, pay_details: null, showForm: true};
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

    onChangePayMethod(pay_method) {
        this.setState({pay_method: pay_method.id, pay_details: pay_method.details});
    }

    handleSubmit(e) {
        e.preventDefault();
        var fee = this.refs.fee.value.trim();
        var payment_method = this.state.pay_method;

        const { Task, TaskActions } = this.props;
        const { task } =  Task.detail;
        TaskActions.createTaskInvoice(task.id, {fee, payment_method});
    }

    getBitonicPaymentUrl() {
        const { Task } = this.props;
        const { task } =  Task.detail;

        return 'https://bitonic.nl/partner/263?'+ objectToQueryString({
                bitcoinaddress: encodeURIComponent(task.btc_address),
                ext_data: encodeURIComponent(task.summary),
                ordertype: 'buy',
                euros: encodeURIComponent(task.fee)
            });
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
                    (<div>
                        <h4 className="title">Make Payment</h4>

                        {this.state.showForm || !invoice.id?(
                            <form onSubmit={this.handleSubmit.bind(this)} name="invoice" role="form" ref="invoice_form">

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
                                    <label className="control-label">Payment method</label>
                                    <hr style={{marginTop: '0'}}/>
                                    <div className="pay-choices">
                                        {TASK_PAYMENT_METHOD_CHOICES.map((payment_method) => {
                                            return (
                                                <div key={payment_method.id}  className="row">
                                                    <div className="col-md-6">
                                                        <button type="button"
                                                                className={"btn btn-block "+(this.state.pay_method == payment_method.id?'active':'')}
                                                                onClick={this.onChangePayMethod.bind(this, payment_method)}>
                                                            <i className={payment_method.icon_class + " fa-lg pull-left"}/>{payment_method.name}
                                                        </button>
                                                    </div>
                                                    <div className="col-md-6">{payment_method.meta}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {this.state.pay_details?(<div className="card">{this.state.pay_details}</div>):null}

                                <div className="text-center">
                                    <button type="submit" className="btn" disabled={Task.detail.Invoice.isSaving}>Continue</button>
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
                                        <a href={`${ENDPOINT_TASK}${task.id}/download/invoice/?format=pdf`} target="_blank" className="btn "><i className="fa fa-download"/> Download Invoice</a>
                                    </div>
                                ):null}

                                {invoice.payment_method == TASK_PAYMENT_METHOD_BITONIC?(
                                    <div>
                                        <div>
                                            {/*<iframe src={this.getBitonicPaymentUrl()}
                                                    style={{border: "none"}}
                                                    width="400px" height="413px" sandbox/>*/}
                                        </div>
                                        <a href={`${ENDPOINT_TASK}${task.id}/pay/bitonic/`} className="btn "><i className="fa fa-money"/> Pay with iDeal</a>
                                    </div>
                                ):null}

                                {!task.paid?(
                                    <div style={{marginTop: '20px'}}>
                                        <button className="btn btn-alt" onClick={this.changePayMethod.bind(this)}><i className="fa fa-pencil"/> Change Payment Method</button>
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
