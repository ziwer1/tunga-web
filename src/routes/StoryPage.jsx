import React from 'react';

import ShowcaseContainer from '../containers/ShowcaseContainer';
import MetaTags from "../components/MetaTags";

export default class StoryPage extends React.Component {

    renderHeaderContent() {
        return (
            <div>
                <h1>
                    Our journey to shake up<br/>
                    African Tech
                </h1>
            </div>
        );
    }

    render() {
        let meta_title = "Tunga | Our Story";
        let meta_description = "Our quality assurance program";

        return (
            <ShowcaseContainer className="our-story-page" headerContent={this.renderHeaderContent()}>
                <MetaTags title={meta_title} description={meta_description}/>

                <div className="content">
                    <section>
                        <div className="container">
                            <p>
                                Mid 2015 we embarked on a journey to create 21st century jobs for African youths. We started what became Tunga, an online
                                intermediary that connects young and skilled African developers to tech businesses all over the world in dire need of professional
                                and affordable software programmers. A platform where you can connect with people who have great skills but limited access to
                                well-paid work.
                            </p>

                            <p>
                                As firm believers in Michael Porter’s Shared Value principle, our aim is to build a company that addresses youth unemployment
                                throughout Africa in a way that builds self empowerment, cultivates human connections, fosters innovation and generates social
                                impact. And importantly, at the same time by doing solid business and becoming financially sustainable as a company
                            </p>

                            <div className="image-wrapper">
                                <img src={require('../images/showcase/story1.jpg')}/>
                            </div>

                            <p>
                                Together with strong philanthropical funding partners we were able to bring our idea to light. At the heart of our company are our
                                developers and project managers. We are proud to currently have a vibrant ecosystem of Tunga developer and project managers
                                in four African countries
                            </p>

                            <div className="image-wrapper">
                                <img src={require('../images/showcase/story2.jpg')}/>
                            </div>

                            <p>
                                Tunga was founded because we saw two things happening. <br/>
                                <ol>
                                    <li>In most parts of the world we see a shortage of good developers that you can mobilize on demand. In most case developers are not available or not affordable.</li>
                                    <li>In African emerging economies we see a lot of talented young people not yet connected to the the market of 21st century jobs that match the skills they have</li>
                                </ol>
                            </p>

                            <p>
                                Interested in more of your stories: visit our blog or subscribe to our newsletter, or both of course
                            </p>

                            <p className="highlight">
                                The Tunga team,<br/>
                                Ernesto, Bart, Simon, David, Domieck, Francis
                            </p>

                        </div>
                    </section>
                </div>
            </ShowcaseContainer>
        );
    }
}

