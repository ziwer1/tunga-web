import React from 'react';
import {Link} from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as UtilityActions from '../actions/UtilityActions';
import Success from '../components/status/Success';
import Error from '../components/status/Error';
import ShowcaseContainer from '../containers/ShowcaseContainer';

import ComponentWithModal from '../components/ComponentWithModal';
import LargeModal from '../components/LargeModal';
import MetaTags from "../components/MetaTags";

import { OFFER_REQUEST_ITEMS, TASK_SCOPE_TASK, TASK_SCOPE_PROJECT } from '../constants/Api';
import { openCalendlyWidget } from '../utils/router';

const OFFER_DETAILS = [
    {
        title: 'Projects',
        sub: 'Post your project on Tunga',
        description: 'On projects Tunga developers cost €19 per hour. We also have very skilled project manager with international experience availible that can manage your project for you. For project managers Tunga are €39 per hour.',
        icon: 'tunga-icon-intensive-guildance',
        key: OFFER_REQUEST_ITEMS.onboarding,
        cta: {
            text: 'Start a project now',
            link: `/start/?scope=${TASK_SCOPE_PROJECT}`
        }
    },
    {
        title: 'Tasks',
        sub: 'Post your task on Tunga',
        description: 'Agree with a developer on the fee. We recommend calculating the fee with around €19 depending on the complexity of your task. ',
        icon: 'tunga-icon-do-it-yourself',
        key: OFFER_REQUEST_ITEMS.self_guided,
        cta: {
            text: 'Start a task now',
            link: `/start/?scope=${TASK_SCOPE_TASK}`
        }
    },
    {
        title: 'Ongoing Project',
        sub: 'Hire developers for your ongoing software need',
        description: 'Contact us to find a great match with the developer you are looking for. We can onboard one or multiple developers to your team! Get an custom made offer from us.',
        icon: 'tunga-icon-dedicated-monitor',
        key: OFFER_REQUEST_ITEMS.project,
        cta: {
            text: 'Talk with us',
            action: function () {
                openCalendlyWidget();
            }
        }
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
                    Flexible and affordable
                </h1>
            </div>
        );
    }

    render() {
        let meta_title = "Tunga | Pricing";
        let meta_description = "Tunga offers flexible and affordable pricing. Choose from 3 different plans.";

        return (
            <ShowcaseContainer className="pricing-page" headerContent={this.renderHeaderContent()}>

                <MetaTags title={meta_title} description={meta_description}/>

                {this.renderModalContent()}

                <section className="pricing-options">
                    <div className="container">
                        <div className="step-slider three-sm clearfix">
                            <ul>
                                {OFFER_DETAILS.map((offer, idx) => {
                                    return (
                                        <li key={offer.key}>
                                            <div className="slide animated slideInRight"
                                                 style={{animationDelay: `${idx}s`}}>
                                                <span className="bold" dangerouslySetInnerHTML={{__html: offer.title}}/>
                                                <div className="icon">
                                                    <i className={offer.icon}/>
                                                </div>
                                                <div className="description">
                                                    <div className="subtitle bold" dangerouslySetInnerHTML={{__html: offer.sub}}/>
                                                    <p dangerouslySetInnerHTML={{__html: offer.description}}/>
                                                    {offer.cta?(
                                                        offer.cta.action?(
                                                            <button className="btn"
                                                                    onClick={offer.cta.action.bind(this)}>
                                                                {offer.cta.text}
                                                            </button>
                                                        ):(offer.cta.link?(
                                                            <Link to={offer.cta.link} className="btn">
                                                                {offer.cta.text}
                                                            </Link>
                                                        ):null)
                                                    ):null}
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
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

