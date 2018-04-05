import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import moment from 'moment';

import * as UtilityActions from '../actions/UtilityActions';

class ShowCaseFooter extends React.Component {
  componentDidMount() {
    const {UtilityActions} = this.props;
    UtilityActions.getMediumPosts();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.Utility.contact.isSent && !prevProps.Utility.contact.isSent) {
      this
        .refs
        .contact_form
        .reset();
    }
  }

  sendEmail(e) {
    e.preventDefault();
    const email = this
      .refs
      .email
      .value
      .trim();
    const {UtilityActions} = this.props;
    UtilityActions.sendContactRequest({email});
    return;
  }

  render() {
    const {Utility} = this.props;

    return (
      <footer>
        <div className="container">
          <div className="row">
            <div className="col-md-3" id="social">
              <div id="tunga-logo-btm">
                <img src={require('../images/logo_round.png')}/>
              </div>
              {/* <p><a href="http://web.butterflyworks.org/">a butterfly works initiative</a></p> */}
              <div id="social-networks">
                <a
                  target="_blank"
                  href="https://www.linkedin.com/company/tunga"
                  id="fb"
                  title="LinkedIn">
                  <i className="fa fa-linkedin"/>
                </a>
                <a
                  target="_blank"
                  href="https://www.facebook.com/tunga.io"
                  id="fb"
                  title="Facebook">
                  <i className="fa fa-facebook"/>
                </a>
                <a
                  target="_blank"
                  href="https://twitter.com/tunga_io"
                  id="twitter"
                  title="Twitter">
                  <i className="fa fa-twitter"/>
                </a>
                <a target="_blank" href="https://blog.tunga.io" id="medium" title="Medium">
                  <i className="fa fa-medium"/>
                </a>
              </div>
              <div className="footer-address">
                <p>Wibauttstraat 131</p>
                <p>Amsterdam, The Netherlands</p>
                <p>hello@tunga.io</p>
                <p>+31615955194</p>
                <p>Schedule a call with us</p>
              </div>
            </div>
            <div className="col-md-3" id="contact-info">
              <h4>Top Pages</h4>
              <ul className="list-info">
                <li>
                  <a href="/pricing">Pricing</a>
                </li>
                <li>
                  <a href="/story">Our Story</a>
                </li>
                <li>
                  <a href="https://blog.tunga.io/">Blog</a>
                </li>
                <li>
                  <a>Effortless Software project</a>
                </li>
                <li>
                  <a>Dedicated Developers</a>
                </li>
                <li>
                  <a>Recruitment Services</a>
                </li>
                <li>
                  <a>iOS Developers</a>
                </li>
                <li>
                  <a>African Developers</a>
                </li>
                <li>
                  <a>Remote Teams</a>
                </li>
              </ul>
            </div>
            <div className="col-md-3" id="contact-info">
              <h4>Contact & legal information</h4>
              <ul className="list-info">
                <li>
                  <a href="https://tunga.io/privacy" target="_blank">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="https://tunga.io/agreement" target="_blank">
                    Terms and Conditions
                  </a>
                </li>
                <li>
                  <a href="https://tunga.io/code-of-conduct" target="_blank">
                    Code of Conduct
                  </a>
                </li>
              </ul>

              <div>
                <p>
                  KVK: NL21746292
                </p>
              </div>
            </div>
            <div className="col-md-3" id="latest-from-blog">
              <h4>Latest from our blog</h4>
              <ul className="list-unstyled">
                {Utility.posts.length
                  ? Utility
                    .posts
                    .slice(0, 4)
                    .map(article => {
                      return (
                        <li>
                          <a target="_blank" href={article.url}>
                            <i className="fa fa-angle-right"/> {article.title}
                          </a>
                        </li>
                      );
                    })
                  : null}
              </ul>
            </div>
          </div>
          <div className="row"><p className="text-center">2018 Tunga BV - All rights reserved</p></div>
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
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(ShowCaseFooter);
