import React from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

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
        const { Utility } = this.props;

        return (
            <footer className="row">
                <div className="container">
                    <div className="col-sm-3" id="social">
                        <div id="tunga-logo-btm"><img src={require("../images/logo.png")}/></div>
                        <div id="social-networks">
                            <a target="_blank" href="https://www.facebook.com/tunga.io" id="fb" title="Facebook"><i className="fa fa-facebook"></i></a>
                            <a target="_blank" href="https://twitter.com/tunga_io" id="twitter" title="Twitter"><i className="fa fa-twitter"></i></a>
                            <a target="_blank" href="https://blog.tunga.io" id="medium" title="Medium"><i className="fa fa-medium"></i></a>
                            {/*<a target="_blank" href="#" id="g-plus"><i className="fa fa-google-plus"></i></a>
                             <a target="_blank" href="#" id="instagram"><i className="fa fa-instagram"></i></a>*/}
                        </div>
                    </div>
                    <div className="col-sm-4" id="contact-info">
                        <h4>CONTACT INFORMATION</h4>
                        <p><i className="fa fa-map-marker"/> Ms van Riemsdijkweg 57, 1033RC Amsterdam, The Netherlands</p>
                        <p><i className="fa fa-phone"/> 0615955193 <i className="fa fa-envelope"/> bart@tunga.io</p>
                        <form id="contact-form" role="form" name="contact-form" ref="contact_form" onSubmit={this.sendEmail.bind(this)}>
                            {Utility.contact.isSent?(
                                <Success message="Contact request sent"/>
                            ):null}
                            {Utility.error && Utility.error.contact?(
                                <Error message={Utility.error.contact.email || "Your request couldn't be processed. Please try again later."}/>
                            ):null}
                            <div className="input-group input-group-lg">
                                <input className="form-control" ref="email" name="email" type="email" placeholder="Drop your email here and we will contact you" required/>
                                    <span className="input-group-btn">
                                        <button className="btn" type="submit" disabled={Utility.contact.isSending}>
                                            <i className="fa fa-envelope"/>
                                        </button>
                                    </span>
                            </div>
                        </form>
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
                    <div className="col-sm-2" id="quick-links">
                        <h4>QUICK LINKS</h4>
                        <ul className="list-unstyled">
                            <li><Link to="/signin">Login</Link></li>
                            <li><Link to="/signup">Sign Up</Link></li>
                            {/*<li><a href="#">About Us</a></li>
                             <li><a href="#">Team</a></li>
                             <li><a href="#">Contact Us</a></li>*/}
                        </ul>
                    </div>
                </div>
                <div className="row text-center">
                    <p><a href="#">Privacy Policy</a> &nbsp; | &nbsp; <a href="#">Terms and Conditions</a></p>
                    <small>&copy; 2016 Tunga.io &mdash; All rights reserved.</small>
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
