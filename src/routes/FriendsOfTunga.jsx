import React from 'react';
import {Link} from 'react-router';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as UtilityActions from '../actions/UtilityActions';
import ShowcaseContainer from '../containers/ShowcaseContainer';
import ShowCaseFooter from '../containers/ShowCaseFooter';

import ComponentWithModal from '../components/ComponentWithModal';
import MetaTags from '../components/MetaTags';

import {OFFER_REQUEST_ITEMS, TASK_SCOPE_TASK, TASK_SCOPE_PROJECT} from '../constants/Api';
import {openCalendlyWidget} from '../utils/router';

let checkMark = <i className="fa fa-check"/>;

let crossMark = <i className="fa fa-times"/>;

 
class FriendOfTungaPage extends ComponentWithModal {
  renderHeaderContent() {
    return (     
      <div>
        <h1>Help Us Create Tech Jobs for <br /> African Youths </h1>
        <h2> Become a Friend of Tunga by referring leads to us. For each lead that becomes a paying customer we donate 5% up to EUR1,000 to <a href="">Bits Academy</a>, a network of schools that gives free tech education to African youths from less privileged backgrounds</h2>
        <h2 style={{ 'text-decoration':'underline'}}>
            <Link to="/friends-of-tunga-rules">
            Schedule a call now
           </Link>
        </h2>
      </div>
    );
  }

 
  render() {
    let meta_title = 'Tunga | Friends of Tunga';
    let meta_description = 'Become a Friend of Tunga by referring leads to us';

    return (
      <ShowcaseContainer
        className="friends-page"
        headerContent={this.renderHeaderContent()}>
        <MetaTags title={meta_title} description={meta_description}/>    
        <div className="content">    
            <section className="container">
                <p className="text-center"><b>Who are we looking for?</b></p>
                <div className="col-md-12 ">
                    <div className="col-md-4">
                        <div className="col-md-12 rectangle">
                            <img className="col-md-2" height="50" width="50"  src={require('images/showcase/Companies large and small.png')}/>
                        <div className="col-md-10">
                            <p><b>Companies large and small </b>that want to develop their app or website</p>
                         </div>
                         </div>
                    </div>
                    <div className="col-md-4">
                     <div className="col-md-12 rectangle">                          
                         <img className="col-md-2" height="50" width="50"   src={require('images/showcase/software teams.png')} />
                          <div className="col-md-10">
                            <p><b>Software teams</b> that have trouble finding flexible access to good developers</p>
                         </div>
                     </div>
                    </div>
                    <div className="col-md-4">
                    <div className="col-md-12 rectangle">
                          <img className="col-md-2" height="50" width="50"  src={require('images/showcase/Startups.png')}/>
                          <div className="col-md-10">
                            <p><b>Startups and innovation teams </b>that need to build a prototype or MVP</p>
                         </div>
                        </div>
                    </div>
                </div> 
            </section> 
            <section className="container">
                <div className="col-md-12 ">
                    <div className="col-md-8 ">
                        <p>Send your friends a personal e-mail with bart@tunga.io in cc. To make it easy for you, we made an example email that you can copy or use to draft your own e-mail.</p>
                        <div className="col-md-12  rectangle-form">
                        <form className="form-horizontal "> 
                            <div className=" col-md-8">                       
                                <div className="form-group">
                                    <label className="col-md-2 control-label">To CC</label>
                                    <div className="col-md-10">
                                        <input type="text" className="form-control rectangle-field" name="emailcc" value="bart@tunga.io"/>  
                                        <span className="pull-right"><img src={require('images/showcase/copyicon.png')}/></span>   
                                    </div>                     
                                </div>
                                <div className="form-group">
                                    <label className="col-md-2 control-label ">Subject</label>
                                    <div className="col-md-10">
                                        <input type="text" className="form-control rectangle-field" name="subject" value="Introduction to Tunga"/>
                                        <span className="pull-right"><img src={require('images/showcase/copyicon.png')}/></span>    
                                    </div>                    
                                </div>
                                <div className="form-group">   
                                    <div className="col-md-10 col-md-offset-2">  
                                                           
                                        <textarea type="text" className="form-control rectangle-field" rows="10" name="emailcc">
                                        <p> Hey,<span className="pull-right"><img src={require('images/showcase/copyicon.png')}/></span>  </p>                                        
                                        <p>
                                            I wanted to connect you with Bart Leijssenaar of Tunga (cc), which helps companies build 
                                             software and find good developers. Their mission is to create tech jobs for African youths</p>. 
                                        <p>I think this could be interesting for you and a contact would be mutually beneficial. I’ll let you guys take it from here.</p>   
                                        </textarea> 
                                    </div>                       
                                </div>
                                </div>                                
                                <div className="col-md-4">
                                    <select class="form-control">
                                        <option selected><span className="pull-right"><img src={require('images/showcase/English.png')}/></span></option>
                                        <option><span className="pull-right"><img src={require('images/showcase/Dutch.png')}/></span></option>
                                    </select>
                                </div>                            
                        </form>
                       
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="rectangle-share">
                            <div className="row">
                            <div className="col-md-12">
                               <a href="" className="btn rectangle-social col-md-9"><b>Share this post on LinkedIn</b></a>
                               <span style={{'padding-left':'3px'}}><img src={require('images/showcase/Linkedin.png')} alt="icon"/></span>
                            </div>
                            <div className="col-md-12">
                                <div className="rectangle-post">
                                    <p><b>LinkedIn Post:</b></p>
                                    <p>
                                        Trouble finding good developers or looking to build an app? Please check out this great initiative 
                                        called Tunga . 
                                    </p>
                                    <p>
                                        If you send me a message I can connect you to them by e-mail. For every paying customer
                                        I refer to them they donate 5% up to EUR1,000 to Bits Academy, a network of schools that gives free tech
                                        education to African youths from less privileged backgrounds
                                    </p>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div> 
            </section> 
        </div>      
        <ShowCaseFooter/>
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
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(FriendOfTungaPage );
