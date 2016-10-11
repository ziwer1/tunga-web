import React from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import * as UtilityActions from '../actions/UtilityActions';
import Success from '../components/status/Success';
import Error from '../components/status/Error';
import ShowcaseContainer from './ShowcaseContainer';

import ComponentWithModal from '../components/ComponentWithModal';
import LargeModal from '../components/ModalLarge';

import { OFFER_REQUEST_ITEMS } from '../constants/Api';

class PricingPage extends ComponentWithModal {

    constructor(props) {
        super(props);
        this.state = {offer: null};
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.Utility.contact.isSent && !prevProps.Utility.contact.isSent) {
            this.refs.request_form.reset();
        }
    }

    onRequestOffer(offer) {
        this.setState({offer});
        this.open();
    }

    sendEmail(e) {
        e.preventDefault();
        const email = this.refs.request_email.value.trim();
        const item = this.state.offer;
        const { UtilityActions } = this.props;
        UtilityActions.sendContactRequest({email, item});
        return;
    }

    scrollToDetails() {
        $('body').animate({'scrollTop':$('.pricing-details').offset().top},500)
    }

    renderModalContent() {
        const { Utility } = this.props;

        return (
            <LargeModal title="Request offer" modalSize="medium"
                        show={this.state.showModal} onHide={this.close.bind(this)}>
                <form id="request-form" role="form" name="request-form" ref="request_form" onSubmit={this.sendEmail.bind(this)}>
                    {Utility.contact.isSent?(
                        <Success message="Contact request sent"/>
                    ):null}
                    {Utility.error && Utility.error.contact?(
                        <Error message={Utility.error.contact.email || "Your request couldn't be processed. Please try again later."}/>
                    ):null}
                    <div className="input-group">
                        <input className="form-control" ref="request_email" name="email" type="email" placeholder="Drop your email here and we will contact you" required/>
                                <span className="input-group-btn">
                                    <button className="btn " type="submit" disabled={Utility.contact.isSending}>
                                        <i className="fa fa-paper-plane"/> Send
                                    </button>
                                </span>
                    </div>
                </form>
            </LargeModal>
        );
    }

    render() {
        return (
            <ShowcaseContainer className="pricing-page" headerContent={<h1>Affordable access to coding talent.</h1>}>
                <Helmet title="Tunga | Pricing" />
                {this.renderModalContent()}
                <section className="pricing-cards">
                    <div className="container">
                        <div className="row flex-row">
                            <div className="col-md-3 com-sm-6 col-xs-12">
                                <div className="card">
                                    <h3>Tunga tasks</h3>
                                    <div>
                                        <img className="icon" src={require('../images/icons/publish.png')}/>
                                    </div>
                                    <div className="description">
                                        <h5>Build your own flexible remote team</h5>
                                        <p>Agree on fee with freelancer per task</p>
                                        <p>We deduct 13% from the total fee</p>
                                        <p>Do it yourself</p>
                                    </div>
                                    <div className="bottom">
                                        <Link className="btn btn-alt" to="/signup/project-owner">POST A TASK</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 com-sm-6 col-xs-12">
                                <div className="card">
                                    <h3>Tunga onboarding</h3>
                                    <div>
                                        <img className="icon" src={require('../images/icons/invite.png')}/>
                                    </div>
                                    <div className="description">
                                        <h5>We onboard your team for you</h5>
                                        <p>Minimum 1,000 hours worth of tasks</p>
                                        <p>Guaranteed fixed fee of €20/hour</p>
                                        <p>Intensive guidance & support</p>
                                    </div>
                                    <div className="bottom">
                                        <button className="btn btn-alt" onClick={this.onRequestOffer.bind(this, OFFER_REQUEST_ITEMS.onboarding)}>REQUEST OFFER</button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 com-sm-6 col-xs-12">
                                <div className="card callout">
                                    <h3>Onboarding special offer</h3>
                                    <div>
                                        <img className="icon" src={require('../images/icons/invite_alt.png')}/>
                                    </div>
                                    <div className="description">
                                        <h5>We onboard your team for you</h5>
                                        <p>Minimum 800 hours worth of tasks</p>
                                        <p>Guaranteed fixed fee of €12.50/hour</p>
                                        <p>Intensive guidance & support</p>
                                    </div>
                                    <div className="bottom">
                                        <button className="btn btn-alt" onClick={this.onRequestOffer.bind(this, OFFER_REQUEST_ITEMS.onboarding_special)}>REQUEST OFFER</button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 com-sm-6 col-xs-12">
                                <div className="card">
                                    <h3>Tunga project</h3>
                                    <div>
                                        <img className="icon" src={require('../images/icons/work.png')}/>
                                    </div>
                                    <div className="description">
                                        <h5>Ideal for heavy users</h5>
                                        <p>> € 50,000 fees per year</p>
                                        <p>We deduct 11% from the total fee</p>
                                        <p>Dedicated monitor & troubleshooter</p>
                                    </div>
                                    <div className="bottom">
                                        <button className="btn btn-alt" onClick={this.onRequestOffer.bind(this, OFFER_REQUEST_ITEMS.project)}>TRY FOR 30 DAYS</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="learn-more" onClick={this.scrollToDetails.bind(this)}>
                    Learn more<br/>
                    <i className="fa fa-chevron-down"/>
                </div>
                <section className="pricing-details content">
                    <div className="media">
                        <div className="container">
                            <div className="media-left">
                                <img className="media-object" src={require('../images/showcase/circlespricing1.jpg')}/>
                            </div>
                            <div className="media-body">
                                <h2><span className="bold">Plan 1:</span> Tunga tasks</h2>
                                <div>
                                    Tunga allows you to build a network of African freelance software developers.
                                    Creating an account, browsing and connecting with developers and managing your network is always free.
                                    In addition, you can post a task and agree on the fee with the developer(s) you have chosen to execute it.
                                    Upon successful completion and payment of the task, Tunga will deduct 13% from this fee.
                                    After this the remainder is forwarded to the developer.
                                    This plan is suitable for both incidental users and frequent users, as you are totally in control yourself.
                                </div>
                                <Link className="btn btn-alt" to="/signup/project-owner">Start building your network</Link>
                            </div>
                        </div>
                    </div>

                    <div className="media">
                        <div className="container">
                            <div className="media-body">
                                <h2><span className="bold">Plan 2:</span> Tunga onboarding</h2>
                                <div>
                                    Clients have frequently asked us to help them kickstart their network of Tunga software developers,
                                    by onboarding a remote team on one of their projects.
                                    For these clients we have developed a special onboarding program in which the client guarantees 1,000 hours of work
                                    for the team we select for them during a (roughly) 20-week period at a fixed rate of €20,-/hour.
                                    During this program Tunga can help with determining the scope of work,
                                    setting up sprints and arranging an online work environment (if you don't have that already).
                                    Also, we familiarize our coders with your working environment and methods, provide guidance to them,
                                    monitor progress and troubleshoot where necessary.
                                </div>
                                {/*<button className="btn btn-alt">Request offer</button>*/}
                            </div>
                            <div className="media-right">
                                <img className="media-object" src={require('../images/showcase/circlespricing2.jpg')}/>
                            </div>
                        </div>
                        <div className="media callout">
                            <div className="container">
                                <div className="media-left">
                                    <img className="media-object" src={require('../images/showcase/circlespricing3.jpg')}/>
                                </div>
                                <div className="media-body">
                                    <h2><span className="bold">Limited offer</span></h2>
                                    <div>
                                        We can now temporarily offer the Tunga Onboarding program at even more favorable conditions:
                                        Under this special offer the fixed rate is only €12,50/hour and the minimum amount of hours is 800.
                                        All the other parameters stay the same. This offer is available from September 21st 2016 up to
                                        October 15 2016 and has limited availability (first come, first served). Interested to participate?
                                        Then please apply and we'll get back to you shortly.
                                    </div>
                                    <button className="btn btn-alt" onClick={this.onRequestOffer.bind(this, OFFER_REQUEST_ITEMS.onboarding_special)}>Request offer now</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="media">
                        <div className="container">
                            <div className="media-body">
                                <h2><span className="bold">Plan 3:</span> Tunga projects</h2>
                                <div>
                                    This plan is suitable for those clients that have a robust and active network that works frequently on their projects.
                                    Basically your Tunga network is integrated in your way of working.
                                    If you guarantee a minimum annual €50,000 worth of fees,
                                    we can provide you with permanent monitoring,
                                    support and troubleshooting on the execution of your tasks to ensure quality and get the most out of your freelancer network.
                                    On top of that we give a ~7,7% percent discount on our fee (deducting 12% instead of 13%).
                                </div>
                                <button className="btn btn-alt" onClick={this.onRequestOffer.bind(this, OFFER_REQUEST_ITEMS.project)}>Try for 30 days</button>
                            </div>
                            <div className="media-right">
                                <img className="media-object" src={require('../images/showcase/circlespricing4.jpg')}/>
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

