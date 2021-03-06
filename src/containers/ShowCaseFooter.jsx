import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';

import * as UtilityActions from '../actions/UtilityActions';
import Success from '../components/status/Success';
import Error from '../components/status/Error';

class ShowCaseFooter extends React.Component {

    componentDidUpdate(prevProps, prevState) {
        if(this.props.Utility.contact.isSent && !prevProps.Utility.contact.isSent) {
            this.refs.contact_form.reset();
        }
    }

    sendEmail(e) {
        e.preventDefault();
        const email = this.refs.email.value.trim();
        const { UtilityActions } = this.props;
        UtilityActions.sendContactRequest({email});
        return;
    }

    render() {
        return (
            <footer className="row">
                <div className="container">
                    <div className="col-sm-3" id="social">
                        <div id="tunga-logo-btm"><img src={require("../images/logo_round.png")}/></div>
                        <div id="social-networks">
                            <a target="_blank" href="https://www.facebook.com/tunga.io" id="fb" title="Facebook"><i className="fa fa-facebook"/></a>
                            <a target="_blank" href="https://twitter.com/tunga_io" id="twitter" title="Twitter"><i className="fa fa-twitter"/></a>
                            <a target="_blank" href="https://blog.tunga.io" id="medium" title="Medium"><i className="fa fa-medium"/></a>
                        </div>
                    </div>
                    <div className="col-sm-6" id="contact-info">
                        <h4>CONTACT & LEGAL INFORMATION</h4>
                        <p><i className="fa fa-map-marker"/> Ms van Riemsdijkweg 57, 1033RC Amsterdam, The Netherlands</p>
                        <p><i className="fa fa-phone"/> +31(0)615955194 </p>
                        <p><i className="fa fa-envelope"/> <a href="mailto:hello@tunga.io" target="_blank">hello@tunga.io</a></p>

                        <div>
                            <p><a href="/privacy" target="_blank">Privacy Policy</a> &nbsp; | &nbsp; <a href="/agreement" target="_blank">Terms and Conditions</a> &nbsp; | &nbsp; <a href="/code-of-conduct" target="_blank">Code of Conduct</a></p>
                            <small>&copy; {moment().format('YYYY')} Tunga.io &mdash; All rights reserved.</small>
                        </div>
                    </div>
                    <div className="col-sm-3" id="latest-from-blog">
                        <h4>LATEST FROM OUR BLOG</h4>
                        <ul className="list-unstyled">
                            <li><a target="_blank" href="https://blog.tunga.io/why-its-a-good-idea-to-mobilize-remote-workers-in-africa-f9c707cdced7?source=latest---"><i className="fa fa-angle-right"></i> Why it’s a Good Idea to Mobilize Remote Workers in Africa.</a></li>
                            <li><a target="_blank" href="https://blog.tunga.io/how-using-bitcoin-to-pay-gig-workers-in-africa-is-a-no-brainer-621087d03852?source=latest---"><i className="fa fa-angle-right"></i> How using Bitcoin to pay gig-workers in Africa is a no-brainer</a></li>
                            <li><a target="_blank" href="https://blog.tunga.io/why-i-think-africa-is-a-hotbed-of-innovation-that-everybody-should-know-about-96bd1c649527?source=latest---"><i className="fa fa-angle-right"></i> Why I Think Africa is a Hotbed of Innovation That Everybody Should Know About.</a></li>
                            <li><a target="_blank" href="https://blog.tunga.io/how-to-use-digital-storytelling-for-social-enterprises-a2e92bb40558?source=latest---"><i className="fa fa-angle-right"></i> How to Use Digital Storytelling for Social Enterprises</a></li>
                            <li><a target="_blank" href="https://blog.tunga.io/african-coders-are-more-suited-for-the-gig-economy-than-their-western-counterparts-99a32366fcd3#.5a5ppu93f"><i className="fa fa-angle-right"></i> African coders are more suited for the ‘gig economy’ than their western counterparts</a></li>
                        </ul>
                    </div>
                </div>
            </footer>
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
export default connect(mapStateToProps, mapDispatchToProps)(ShowCaseFooter);
