import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import * as UtilityActions from '../actions/UtilityActions';
import Success from '../components/status/Success';
import Error from '../components/status/Error';
import ShowcaseContainer from './ShowcaseContainer';

import ComponentWithModal from '../components/ComponentWithModal';
import LargeModal from '../components/LargeModal';
import EmailVisitorWidget from '../components/EmailVisitorWidget';

import { OFFER_REQUEST_ITEMS } from '../constants/Api'

const OFFER_DETAILS = [
    {
        title: 'Do-it-yourself',
        sub: 'Agree on fee with freelancer per task',
        description: 'Build your own flexible team with Tunga tasks. We deduct 13% from the total fee.',
        icon: 'tunga-icon-do-it-yourself',
        key: OFFER_REQUEST_ITEMS.self_guided
    },
    {
        title: 'Intensive Guidance & Support',
        sub: 'Let us onboard your flexible remote team for you',
        description: 'Minimum 1000 hours worth of tasks.Guaranteed fixed fee of €20/hour.',
        icon: 'tunga-icon-intensive-guildance',
        key: OFFER_REQUEST_ITEMS.onboarding
    },
    {
        title: 'Dedicated Monitor & Troubleshooter',
        sub: 'Discount and premium support for heavy users',
        description: '> €50,000 per year. We deduct 12% from the total fee.',
        icon: 'tunga-icon-dedicated-monitor',
        key: OFFER_REQUEST_ITEMS.project
    }
];

class PricingPage extends ComponentWithModal {

    constructor(props) {
        super(props);
        this.state = {email: null, offer: null, slider_offer_index: null, step: 0, action: null};
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.Utility.contact.isSent && !prevProps.Utility.contact.isSent && this.refs.request_form) {
            this.refs.request_form.reset();
        }
    }

    onChangeSliderStep(step) {
        this.setState({step});
    }

    onSelectOffer(offer) {
        this.setState({offer});
    }

    addEmailToRequest(offer) {
        this.setState({offer, action: "email"});
        this.open();
    }

    addOfferToRequest(email) {
        this.setState({email, action: "offer"});
        this.open();
    }

    onCompleteRequestWithEmail(e) {
        e.preventDefault();
        const email = this.refs.request_email.value.trim();
        const item = this.state.offer;
        this.sendEmail(email, item);
        return;
    }

    onCompleteRequestWithOffer() {
        this.sendEmail(this.state.email, this.state.offer);
    }

    sendEmail(email, item) {
        const { UtilityActions } = this.props;
        UtilityActions.sendContactRequest({email, item});
    }

    renderModalContent() {
        const { Utility } = this.props;

        return (
            <LargeModal title="Request offer" bsStyle="md"
                        show={this.state.showModal} onHide={this.close.bind(this)}>
                {Utility.contact.isSent?(
                    <Success message="Request sent successfully"/>
                ):(
                    <div>
                        {this.state.action == "email"?(
                            <form id="request-form" role="form" name="request-form" ref="request_form" onSubmit={this.onCompleteRequestWithEmail.bind(this)}>
                                {Utility.error && Utility.error.contact?(
                                    <Error message={Utility.error.contact.email || "Your request couldn't be processed. Please try again later."}/>
                                ):null}

                                <div className="pricing-options">
                                    <div className="card active">
                                        <h4 dangerouslySetInnerHTML={{__html: OFFER_DETAILS[this.state.step].title}}/>
                                        <div className="icon">
                                            <i className={OFFER_DETAILS[this.state.step].icon}/>
                                        </div>
                                        <div className="description">
                                            <div className="subtitle bold" dangerouslySetInnerHTML={{__html: OFFER_DETAILS[this.state.step].sub}}/>
                                            <div dangerouslySetInnerHTML={{__html: OFFER_DETAILS[this.state.step].description}}/>
                                        </div>
                                    </div>
                                </div>

                                <div className="input-group">
                                    <input className="form-control" ref="request_email" name="email" type="email" placeholder="Drop your email here and we will contact you" required/>
                                <span className="input-group-btn">
                                    <button className="btn" type="submit" disabled={Utility.contact.isSending}>
                                        <i className="fa fa-paper-plane"/> Send
                                    </button>
                                </span>
                                </div>
                            </form>
                        ):null}

                        {this.state.action == "offer"?(
                            <div className="pricing-options">
                                {Utility.error && Utility.error.contact?(
                                    <Error message={Utility.error.contact.email || "Your request couldn't be processed. Please try again later."}/>
                                ):null}
                                {OFFER_DETAILS.slice(1).map((offer, idx) => {
                                    return (
                                        <a href="#" key={offer.key}
                                           onClick={this.onSelectOffer.bind(this, offer.key)}
                                           className={`card ${this.state.offer == offer.key?"active":""}`}>
                                            <h4 dangerouslySetInnerHTML={{__html: offer.title}}/>
                                            <div className="icon">
                                                <i className={offer.icon}/>
                                            </div>
                                            <div className="description">
                                                <div className="subtitle bold" dangerouslySetInnerHTML={{__html: offer.sub}}/>
                                                <div dangerouslySetInnerHTML={{__html: offer.description}}/>
                                            </div>
                                        </a>
                                    );
                                })}
                                <button className="btn"
                                        type="submit"
                                        onClick={this.onCompleteRequestWithOffer.bind(this)}
                                        disabled={Utility.contact.isSending || !this.state.offer}>
                                    <i className="fa fa-paper-plane"/> Send Request
                                </button>
                            </div>
                        ):null}
                    </div>
                )}
            </LargeModal>
        );
    }

    renderHeaderContent() {
        const { Utility } = this.props;

        return (
            <div>
                <h1>
                    Flexible and affordable.
                </h1>
                <h2>Choose from 3 different plans.</h2>
                <div style={{margin: "60px 0 30px 0"}}>
                    <EmailVisitorWidget btnText="Request Offer" onSubmit={this.addOfferToRequest.bind(this)} disabled={Utility.contact.isSending}/>
                </div>
            </div>
        );
    }

    render() {
        let meta_title = "Tunga | Pricing";
        return (
            <ShowcaseContainer className="pricing-page" headerContent={this.renderHeaderContent()}>
                <Helmet
                    title={meta_title}
                    meta={[
                        {name: "twitter:title", content: meta_title},
                        {property: "og:title", content: meta_title}
                    ]}/>
                {this.renderModalContent()}

                <section className="pricing-options">
                    <div className="container">
                        <div className="step-slider three">
                            <ul>
                                {OFFER_DETAILS.map((offer, idx) => {
                                    return (
                                        <li key={offer.key}>
                                            <a href="#"
                                               onClick={this.onChangeSliderStep.bind(this, idx)}
                                               onMouseOver={this.onChangeSliderStep.bind(this, idx)}
                                               className={`slide ${this.state.step == idx?"active":""}`}>
                                                <span className="bold" dangerouslySetInnerHTML={{__html: offer.title}}/>
                                                <div className="icon">
                                                    <i className={offer.icon}/>
                                                </div>
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                            <div className="description">
                                <div className="subtitle bold" dangerouslySetInnerHTML={{__html: OFFER_DETAILS[this.state.step].sub}}/>
                                <p dangerouslySetInnerHTML={{__html: OFFER_DETAILS[this.state.step].description}}/>
                                {OFFER_DETAILS[this.state.step].key != OFFER_REQUEST_ITEMS.self_guided?(
                                    <button className="btn"
                                            onClick={this.addEmailToRequest.bind(this, OFFER_DETAILS[this.state.step].key)}>
                                        Request this offer
                                    </button>
                                ):null}
                            </div>
                        </div>
                    </div>
                </section>
            </ShowcaseContainer>
        );
    }
}

function mapStateToProps(state) {
    return {Utility: state.Utility};
}

function mapDispatchToProps(dispatch) {
    return {
        UtilityActions: bindActionCreators(UtilityActions, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(PricingPage);

