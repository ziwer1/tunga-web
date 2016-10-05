import React from 'react';
import ShowcaseContainer from './ShowcaseContainer';

export default class HowItWorksPage extends React.Component {

    render() {
        return (
            <ShowcaseContainer className="how-it-works-page" headerContent={<h1>Problems we solve?</h1>}>
                <div className="content">
                    <section>
                        <div className="media">
                            <div className="container">
                                <div className="media-body">
                                    <h2><span className="bold">Build</span> a network of software freelancers</h2>
                                    <div>
                                        Tunga allows you to build a network of African freelance software developers.
                                        Creating an account, browsing and connecting with developers and managing your network is always free.
                                        In addition, you can post a task and agree on the fee with the developer(s) you have chosen to execute it.
                                        Upon successful completion and payment of the task, Tunga will deduct 13% from this fee.
                                        After this the remainder is forwarded to the developer.
                                        This plan is suitable for both incidental users and frequent users, as you are totally in control yourself.
                                    </div>
                                </div>
                                <div className="media-right">
                                    <img className="media-object" src={require('../images/showcase/howitworks1.png')}/>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section>
                        <div className="media">
                            <div className="container">
                                <div className="media-left">
                                    <img className="media-object" src={require('../images/showcase/howitworks2.png')}/>
                                </div>
                                <div className="media-body">
                                    <h2><span className="bold">Focus</span> on skills you need</h2>
                                    <div>
                                        <p>
                                            Tunga works exclusively with African software developers.
                                            This is for a reason: we noticed that many clients complain about the unreliable quality of traditional software outsourcing and free-lance marketplaces.
                                            We believe that the more we build the community and flows on our platform around a common professional and cultural background, the better it is possible to ensure quality.
                                            We have chosen to work exclusively with African developers, because we noticed there is a huge untapped pool of skilled and talented professionals on the African continent which provides a major opportunity to improve the livelihoods of African youths.
                                        </p>
                                        <p>
                                            The skills in the Tunga community are very broad and cover all the most popular software languages (Node.js, Javascript, PHP, Python, Ruby, Html5, etc) and frameworks (AngularJS, React.js, Ruby on Rails, Django, etc).
                                            In general, the more complex your need and environment, the more time it takes to onboard a freelancer (any freelancer).
                                            For clients who'd like to kickstart their network, we have developed a special Onboarding Plan.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section>
                        <div className="media">
                            <div className="container">
                                <div className="media-body">
                                    <h2><span className="bold">Post</span> and manage tasks</h2>
                                    <div>
                                        <p>
                                            Once you have connected with developers who have relevant skills, you can post a task.
                                            This is as simple as clicking a button, upon which we'll run you through a wizard that helps you to structure the task in the most effective way.
                                            The wizard helps you to describe the task, integrate with your work environment if necessary (e.g. Github, Bitbucket), target right coders, set milestones and determine the height of the fee you offer.
                                        </p>
                                        <p>
                                            Then the programmers that have been targeted (from your own network or broader if you wish) can apply and through the Tunga interface you can agree with them on the final scope and fee.
                                            The programmer will receive a mini-survey for each milestone you've set, to update you on the progress of the task execution.
                                            Further, you can track progress on the task page and communicate there directly with the developer.
                                        </p>
                                    </div>
                                </div>
                                <div className="media-right">
                                    <img className="media-object" src={require('../images/showcase/howitworks3.png')}/>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section>
                        <div className="media">
                            <div className="container">
                                <div className="media-left">
                                    <img className="media-object" src={require('../images/showcase/howitworks4.png')}/>
                                </div>
                                <div className="media-body">
                                    <h2><span className="bold">Fast,</span> cheap and secure payments</h2>
                                    <div>
                                        <p>
                                            Upon successful completion the client is prompted to make the payment.
                                            Tunga includes a unique payment system that uses bitcoin to allow clients to pay (unbanked) developers directly to their mobile money wallet from anywhere in the world.
                                            If that sounds complicated: it isn't!
                                            The client can pay-in through bank transfer (€/$), iDeal (€) and Bitcoin.
                                            So no worries if Bitcoin is not your thing. The received funds are converted to Bitcoin and sent in local currency to the mobile money wallet of the developers through a service called Bitpesa.
                                            This is totally secure, and the fastest, cheapest and in some case the only way to send money to the developers.
                                        </p>
                                        <p>
                                            The client only pays when the work is completed successfully.
                                            As it is both the client's and the freelancer's interest to build a long term working relationship, they both have an incentive to minimize payment disputes.
                                            In addition, we have built in a scope-adjustment tool that can be used while the task is open in case the execution of the task goes totally different than expected, as sometimes happens with software development (e.g. it turns out to be a lot more work than expected).
                                            In case a dispute does arise, we have a dispute resolution procedure in place to help minimize damages for both sides.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </ShowcaseContainer>
        );
    }
}

