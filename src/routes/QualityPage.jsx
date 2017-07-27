import React from 'react';
import {Link} from 'react-router';
import Reveal from 'react-reveal';
import YouTube from 'react-youtube';

import ShowcaseContainer from '../containers/ShowcaseContainer';
import MetaTags from '../components/MetaTags';
import ShowCaseFooter from '../containers/ShowCaseFooter';

const STEP_DETAILS = [
  {
    title: '1. Screening Portfolio',
    description:
      'The first thing that we do is screening the CV, references, recent projects of the applicant. If the experience of the developer meets our standard we invite them to a remote interview with one of our senior developers or project coordinators. During this interview, we assess their English proficiency level and communication skills.',
    icon: 'tunga-icon-soft-skills',
  },
  {
    title: '2. Soft skills',
    description:
      '                  When a developer has successfully passed the first stage of our program we assess our developers on several "soft skills". Such as communication skills, management of expectations, work ethics, stress management and time management. At Tunga, we believe that soft skills are as much or more important than software development skills.',
    icon: 'tunga-icon-coding-skills',
  },
  {
    title: '3. Coding Skills',
    description:
      'When a developer passed all our assessments he or she gets to work on a first project on Tunga. For the first couple of projects the developers work under the guidance of a senior Tunga developer to ensure great collaboration between you and the developer(s).',
    icon: 'tunga-icon-teamwork',
  },
  {
    title: '4. Guidance Program',
    description:
      'When a developer passed all our assessments he or she gets to work on the first project on Tunga. For the first couple of projects, the developers work under the guidance of a senior Tunga developer to ensure great collaboration between you and the developer(s) and that all our developer produce top notch products.',
    icon: 'tunga-icon-teamwork',
  },
];

export default class QualityPage extends React.Component {
  renderHeaderContent() {
    return (
      <div>
        <h1>Our quality assurance program</h1>
      </div>
    );
  }

  render() {
    let meta_title = 'Tunga | Quality';
    let meta_description = 'Our quality assurance program';

    return (
      <ShowcaseContainer
        className="quality-page"
        headerContent={this.renderHeaderContent()}>
        <MetaTags title={meta_title} description={meta_description} />

 

        <section>
          <div className="container">
              <div className="section-header" id="tunga-isnot-just">
                Tunga isn’t just a network of developers, Tunga is a community.<br/>
                We thoroughly select the brightest developers from the African continent. Tunga<br/>
                nourish and constantly improve our community of developers by providing them<br/>
                with the tools and guidance they need to be even more successful.
              </div>
            </div>
        
        </section>

        <section id="press">
          <div className="container ">
            <Reveal effect="animated fadeInLeft">
              <div>
                <ul className="press-links">
                  <li>
                    <a
                      href="http://www.bbc.co.uk/news/world-africa-38294998"
                      target="_blank">
                      <img src={require('../images/press/bbc.png')} />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.youtube.com/watch?v=v9uRtYpZDQs"
                      target="_blank">
                      <img src={require('../images/press/campus-party.png')} />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.oneworld.nl/startup-tunga-lanceert-pilot-programma-voor-nieuw-soort-freelance-platform"
                      target="_blank">
                      <img src={require('../images/press/OWlogo.png')} />
                    </a>
                  </li>
                  <li>
                    <a
                      href="http://trendwatching.com/blog/featured-innovator-tunga/"
                      target="_blank">
                      <img
                        src={require('../images/press/trend-watching.png')}
                      />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://soundcloud.com/african-tech-round-up/a-chat-with-ernesto-spruyt-of-tungaio?in=african-tech-round-up/sets/quick-chats"
                      target="_blank">
                      <img
                        src={require('../images/press/African-Tech-Round-Up.png')}
                      />
                    </a>
                  </li>
                  <li>
                    <a
                      href="http://spendmatters.com/2016/04/01/tunga-wip-of-the-week/"
                      target="_blank">
                      <img src={require('../images/press/Spend-Matters.png')} />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.nabc.nl/africa-business-news/5/technology/377/tunga-founder-ernesto-spruyt-we-create-21st-century-jobs-in-africa"
                      target="_blank">
                      <img
                        src={require('../images/press/netherlands-african-business-council.png')}
                      />
                    </a>
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>
        </section>
        
        <section id="quality-pg">
          <div className="container-fluid" id="custom_container-fluid" >    
            <div className="row"  >
              <div className="col-md-12" id="title" >
                How we select the best developers
              </div>
            </div>
    
            <div className="row" id="step1">
              <img id="step1_img" src={require('../images/icons/step1_img')}    />         
              <div className="col-md-8" id="step1_col-md-8"   >
                <span id="Drop_cap" >1</span>
                <span id="step_title">Screening portolio  </span>                      
              <div id="step_body">                 
                     The first thing that we do is screening the CV, references, recent projects of the applicant. If the experience of the developer meets our standard we invite them to a remote interview with one of our senior developers or project coordinators. During this interview, we assess their English proficiency level and communication skills. 
              </div>             
            </div>
          </div> 
          <div className="row" >
            <img src={require('../images/icons/dot_curve1.png')}  id="dotted_curve_img"  alt="" />
          </div>   
          <div className="row" id="step2">      
            <div className="col-md-8" id="step2_col-md-8"    >
              <span id="Drop_cap2"  >2</span>
              <span id="step_title2"> Soft skills</span>                
              <div id="step_body2" >                 
                When a developer has successfully passed the first stage of our program we assess our developers on several "soft skills". Such as communication skills, management of expectations, work ethics, stress management and time management. At Tunga, we believe that soft skills are as much or more important than software development skills. </div>
            </div>            
              <img src={require('../images/icons/step2_img.png')} id="img2-unique"   />          
          </div>   
          <div className="row" >
            <img src={require('../images/icons/dot_curve2.png')}  alt="" name="dotted_curve_img2"  id="dotted_curve_img3" />
          </div>    
          <div className="row" id="step3">
              <img src={require('../images/icons/step3_img.png')}  />              
                <div className="col-md-8" id="step3_col-md-8"  >
                  <span id="Drop_cap3">3</span>
                  <span id="step_title3">Coding skills </span>                    
                  <div id="step_body3" >                     
                    When the developer has passed our soft skills assessment we thoroughly test their coding skills. We do this in several ways: reviewing recent projects, online coding tests, and in depth Skype interviews. Only the brightest developers are selected to go to the next stage of our program.</div>
                  </div>
                </div>   
        <div className="row" >
          <img src={require('../images/icons/dot_curve1.png')}  alt="" name="dotted_curve_img3"  id="dotted_curve_img3" />
        </div>     
        <div className="row" id="step4"  >          
            <div className="col-md-8" id="step4_col-md-8" >
              <span id="Drop_cap4"  >4</span>
              <span id="step_title4" >Guidance program</span>                
              <div id="step_body4" >                  
                When a developer passed all our assessments he or she gets to work on the first project on Tunga. For the first couple of projects, the developers work under the guidance of a senior Tunga developer to ensure great collaboration between you and the developer(s) and that all our developer produce top notch products. 
              </div>             
          </div>      
          <img src={require('../images/icons/step4_img.png')}   />       
    </div>    
    <div className="row">
      <p className="text-center">
        <Link to="/start/" className="btn btn-callout btn-main-cta">
          <i className="tunga-icon-rocket fa-lg" /> Get me started!
        </Link>
      </p>    
    </div>
   </div>
  </section>

      
        <ShowCaseFooter />
      </ShowcaseContainer>
    );
  }
}
