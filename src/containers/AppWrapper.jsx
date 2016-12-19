import React from 'react';
import Helmet from "react-helmet"

import NavBar from '../components/NavBar';
import SideBar from './SideBar';
import ChatWindow from '../containers/ChatWindow';

export default class AppWrapper extends React.Component {

    handleAppClick() {
        const { onAppClick } = this.props;
        if(onAppClick) {
            onAppClick();
        }
    }

    render() {
        const {Auth, AuthActions, children, location} = this.props;
        return (
            <div className="app-wrapper" onClick={this.handleAppClick.bind(this)}>
                <Helmet
                    title="Tunga"
                    meta={[
                                {
                                "name": "description",
                                "content": "Tunga is a market network that allows you to build a flexible team " +
                                 "of skilled African software programmers, that you can mobilize on-demand."
                                 }
                              ]}
                />
                <NavBar Auth={Auth} AuthActions={AuthActions} location={location}/>

                <SideBar Auth={Auth} location={location}/>

                <div className="main-content">
                    <div className="main">
                        {children}
                    </div>
                </div>

                {!Auth.user.is_staff?(
                    <ChatWindow />
                ):null}
            </div>
        );
    }
}
