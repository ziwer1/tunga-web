import React from 'react'
import Progress from './status/Progress'
import FormStatus from './status/FormStatus'
import FieldError from './status/FieldError'

import { PAYMENT_METHOD_CHOICES, PAYMENT_METHOD_BTC_WALLET, PAYMENT_METHOD_MOBILE_MONEY, PAYMENT_METHOD_BTC_ADDRESS, SOCIAL_LOGIN_URLS } from '../constants/Api'

export default class PaymentMethod extends React.Component {
    constructor(props) {
        super(props);
        this.state = {payment_method: PAYMENT_METHOD_BTC_WALLET};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.props.ProfileActions.retrieveProfile();
        const { Profile, ProfileActions } = this.props;
        var payment_method = Profile.profile.payment_method || null;
        this.setState({payment_method});
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.Profile.profile.id != prevProps.Profile.profile.id) {
            const { Profile, ProfileActions } = this.props;
            if(Profile.profile.id) {
                this.setState({payment_method: Profile.profile.payment_method});
            }
        }
    }

    onPaymentMethodChange(payment_method) {
        this.setState({payment_method});
    }

    handleSubmit(e) {
        e.preventDefault();
        var payment_method = this.state.payment_method;
        var mobile_money_number = this.refs.mobile_money_number?this.refs.mobile_money_number.value.trim():null;
        var btc_address = this.refs.btc_address?this.refs.btc_address.value.trim():null;
        const { Profile, ProfileActions } = this.props;
        ProfileActions.updateProfile(Profile.profile.id, {payment_method, mobile_money_number, btc_address});
        return;
    }

    render() {
        const { Profile, Auth } = this.props;

        return (
            <div>
                {Profile.isRetrieving?(
                <Progress/>
                    ):(
                <form onSubmit={this.handleSubmit} name="profile" role="form" ref="profile_form">
                    <FormStatus loading={Profile.isSaving.profile}
                                success={Profile.isSaved.profile}
                                message={'Payment details saved'}
                                error={Profile.error.profile}/>

                    {(Profile.error.profile && Profile.error.profile.payment_method)?
                        (<FieldError message={Profile.error.profile.payment_method}/>):null}
                    <div className="form-group">
                        <label className="control-label">Payment Method *</label>
                        <div>
                            <div className="btn-group btn-choices select" role="group" aria-label="payment method">
                                {PAYMENT_METHOD_CHOICES.map(payment_method => {
                                    return (
                                        <button key={payment_method.id} type="button"
                                                className={"btn btn-default" + (this.state.payment_method == payment_method.id?' active':'')}
                                                onClick={this.onPaymentMethodChange.bind(this, payment_method.id)}>{payment_method.name}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {this.state.payment_method == PAYMENT_METHOD_BTC_WALLET?(
                        <div>
                            {Profile.profile.payment_method == PAYMENT_METHOD_BTC_WALLET && Profile.profile.btc_wallet && Profile.profile.btc_wallet.provider == 'coinbase'?(
                                <div style={{color: '#0168bb'}}>
                                    <i className="fa fa-check-square-o"/>
                                    <div className="btn btn-default"
                                         style={{color: '#0168bb', background: '#fff none', marginLeft: '5px'}}>
                                        <i className="fa fa-btc fa-lg"/> Connected to Coinbase
                                    </div>
                                </div>
                            ):(
                                <a href={SOCIAL_LOGIN_URLS.coinbase + `?action=connect&next=/profile/payment/coinbase/`}
                                   className="btn btn-default" title="Connect with Coinbase"
                                   style={{color: '#0168bb', background: '#fff none'}}>
                                    <i className="fa fa-btc fa-lg"/> Connect with Coinbase
                                </a>
                            )}
                        </div>
                    ):null}

                    {this.state.payment_method == PAYMENT_METHOD_MOBILE_MONEY?(
                        <div>
                            {(Profile.error.profile && Profile.error.profile.mobile_money_number)?
                                (<FieldError message={Profile.error.profile.mobile_money_number}/>):null}
                            <div className="form-group">
                                <label className="control-label">Mobile Money Number</label>
                                <div><input type="text" className="form-control" ref="mobile_money_number" placeholder="Enter a phone number registered for mobile money" defaultValue={Profile.profile.mobile_money_number}/></div>
                                <div>This number <strong>MUST BE REGISTERED</strong> for Mobile Money</div>
                            </div>
                        </div>
                    ):null}

                    {this.state.payment_method == PAYMENT_METHOD_BTC_ADDRESS?(
                        <div>
                            {(Profile.error.profile && Profile.error.profile.btc_address)?
                                (<FieldError message={Profile.error.profile.btc_address}/>):null}
                            <div className="form-group">
                                <label className="control-label">Bitcoin Address</label>
                                <div><input type="text" className="form-control" ref="btc_address" placeholder="Enter a bitcoin address you own" defaultValue={Profile.profile.btc_address}/></div>
                            </div>
                        </div>
                    ):null}

                    {this.state.payment_method != PAYMENT_METHOD_BTC_WALLET && this.state.payment_method != null?(
                        <button type="submit" className="btn btn-default pull-right" disabled={Profile.isSaving.profile}>Save</button>
                    ):null}
                    <div className="clearfix"></div>
                </form>
                    )}
            </div>

        );
    }
}
