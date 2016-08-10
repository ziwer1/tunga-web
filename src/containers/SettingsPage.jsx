import React from 'react';
import Progress from './../components/status/Progress';
import FormStatus from './../components/status/FormStatus';
import VisibilitySetting from './../components/VisibilitySetting';
import SwitchSetting from './../components/SwitchSetting';
import connect from '../utils/connectors/SettingsConnector';

export default class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {switches: null, visibility: null};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const { SettingsActions } = this.props;
        SettingsActions.retrieveSettings();
    }

    onVisibilitySettingChange(setting) {
        this.setState({visibility: {...this.state.visibility, ...setting}});
    }

    onSwitchSettingChange(setting) {
        this.setState({switches: {...this.state.switches, ...setting}});
    }

    handleSubmit(e) {
        e.preventDefault();
        var settings = {switches: this.state.switches, visibility: this.state.visibility};

        const { SettingsActions } = this.props;

        SettingsActions.updateSettings(settings);
        return;
    }

    render() {
        const { Auth, Settings } = this.props;
        const { settings } = Settings;
        const visibility_settings = [
            {name: 'profile_visibility', label: 'Profile visibility'},
            {name: 'social_links', label: 'Social links'},
            {name: 'location_details', label: 'Location details'}
        ];
        const notify_buttons = {on: 'send an email', off: 'notifications only'}
        const switch_settings = [
            {name: 'daily_update_email', label: 'Daily update e-mail'},
            {name: 'direct_messages_email', label: 'Direct messages', buttons: notify_buttons},
            {name: 'new_friend_request_email', label: 'New friend request', buttons: notify_buttons},
            // owner
            {name: 'team_invitation_response_email', label: 'Reply from developer on invitation', buttons: notify_buttons},
            //dev
            {name: 'friend_request_response_email', label: 'Reply to friend request', buttons: notify_buttons},
            {name: 'join_team_request_response_email', label: 'Reply to join team request', buttons: notify_buttons},
            {name: 'new_friend_request_email', label: 'Invitation to join a team', buttons: notify_buttons},
            // dev end
            {name: 'new_task_application_email', label: 'New application for a task', buttons: notify_buttons}, //owner
            {name: 'task_update_email', label: 'Task updates', buttons: notify_buttons},
            {name: 'payment_request_email', label: 'Payment requests', buttons: notify_buttons}, //owner
            {name: 'payment_update_email', label: 'Payment updates', buttons: notify_buttons}, //dev
        ];

        var user_switches = [
            'daily_update_email', 'direct_messages_email', 'new_friend_request_email'
        ];

        if(Auth.user.is_developer) {
            user_switches = user_switches.concat(['friend_request_response_email', 'join_team_request_response_email', 'new_team_invitation_email']);
        } else {
            user_switches = user_switches.concat(['team_invitation_response_email', 'new_task_application_email']);
        }

        user_switches.push('task_update_email');

        if(Auth.user.is_developer) {
            user_switches.push('payment_update_email');
        } else {
            user_switches.push('payment_request_email');
        }

        return (
            <div>
                <h2>Settings</h2>
                {Settings.isRetrieving?(
                <Progress/>
                    ):(
                <div>
                    <div>
                        <FormStatus loading={Settings.isSaving}
                                    success={Settings.isSaved}
                                    message={'Settings updated successfully'}
                                    error={Settings.error.update || Settings.error.update}/>

                        {Auth.user.is_developer?null:(
                        <div>
                            <h4 className="title">Privacy settings</h4>
                            {visibility_settings.map(setting => {
                                return (
                                <div key={setting.name} className="form-group row">
                                    <div className="col-md-3">{setting.label}</div>
                                    <div className="col-md-9">
                                        <VisibilitySetting
                                            name={setting.name}
                                            visibility={settings.visibility[setting.name]}
                                            onChange={this.onVisibilitySettingChange.bind(this)}/>
                                    </div>
                                </div>
                                    )
                                })}
                        </div>
                            )}

                        <h4 className="title">Email Settings</h4>
                        {switch_settings.map(setting => {
                            if(user_switches.indexOf(setting.name) == -1) {
                                return null;
                                }
                            return (
                            <div key={setting.name} className="form-group row">
                                <div className="col-md-3">{setting.label}</div>
                                <div className="col-md-9">
                                    <SwitchSetting
                                        name={setting.name}
                                        status={settings.switches[setting.name]}
                                        buttons={setting.buttons}
                                        onChange={this.onSwitchSettingChange.bind(this)}/>
                                </div>
                            </div>
                                )
                            })}

                        <button type="button" className="btn " disabled={Settings.isSaving} onClick={this.handleSubmit}>Save Changes</button>
                        <div className="clearfix"></div>
                    </div>
                </div>
                    )}
            </div>
        );
    }
}

export default connect(Settings);
