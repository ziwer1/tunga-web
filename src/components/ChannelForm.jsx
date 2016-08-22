import React from 'react';
import FormStatus from './status/FormStatus';
import FieldError from './status/FieldError';
import UserSelector from '../containers/UserSelector';

export default class ChannelForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {participants: []};
    }

    componentWillMount() {
        const channel = this.props.channel || {};
        if(channel.id && channel.details) {
            this.setState({participants: channel.details.participants});
        }

        let recipientId = this.getRecipient();
        if(recipientId) {
            this.saveChannel([recipientId]);
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.Channel.detail.isSaved && !this.props.Channel.detail.isSaved) {
            const { Channel } = nextProps;
            this.refs.channel_form.reset();
            this.setState({participants: []});
            const { router } = this.context;
            router.replace('/conversation/'+ Channel.detail.channel.id);
        }
    }

    getRecipient() {
        if(this.props.params && this.props.params.recipientId) {
            return this.props.params.recipientId;
        }
        return null;
    }

    onParticipantChange(participants) {
        this.setState({participants: participants});
    }

    getOtherParticipants() {
        const { Channel, Auth } = this.props;
        let channel = this.props.channel || {};

        var participants = [];
        if(channel.id && channel.details) {
            channel.details.participants.forEach((user) => {
                if(user.id != Auth.user.id) {
                    participants.push(user);
                }
            });
        }
        return participants;
    }

    saveChannel(participants=[], subject=null) {
        const { ChannelActions } = this.props;

        let channel = this.props.channel || {};
        let channel_info = {subject, participants};
        if(channel.id) {
            ChannelActions.updateChannel(channel.id, channel_info);
        } else {
            ChannelActions.createChannel(channel_info);
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        var subject = this.refs.subject.value.trim();
        const participants = this.state.participants;

        this.saveChannel(participants, subject);
        return;
    }

    render() {
        const { Channel, Auth } = this.props;
        let channel = this.props.channel || {};
        return (
            <div className="new-channel">
                <form onSubmit={this.handleSubmit.bind(this)} name="channel" role="form" ref="channel_form">
                    <FormStatus loading={Channel.detail.isSaving}
                                success={Channel.detail.isSaved}
                                message={'Channel Sent'}
                                error={Channel.detail.error.create}/>

                    {channel.id?null:(
                        <h3>You are about to start a new conversation</h3>
                    )}

                    {(Channel.detail.error.create && Channel.detail.error.create.participants)?
                        (<FieldError message={Channel.detail.error.create.participants}/>):null}
                    {(Channel.detail.error.update && Channel.detail.error.update.participants)?
                        (<FieldError message={Channel.detail.error.update.participants}/>):null}
                    <div className="form-group">
                        <label className="control-label">Select users</label>
                        <div>
                            <UserSelector filter={{filter: null}}
                                          onChange={this.onParticipantChange.bind(this)}
                                          selected={this.getOtherParticipants()}
                                          unremovable={this.getOtherParticipants().map(user => {return user.id})}/>
                        </div>
                    </div>

                    {(Channel.detail.error.create && Channel.detail.error.create.subject)?
                        (<FieldError message={Channel.detail.error.create.subject}/>):null}
                    {(Channel.detail.error.update && Channel.detail.error.update.subject)?
                        (<FieldError message={Channel.detail.error.update.subject}/>):null}
                    <div className="form-group" style={{display: (this.state.participants.length>1 || channel.subject?'block':'none')}} >
                        <label className="control-label">Subject</label>
                        <div>
                            <input type="text" className="form-control" ref="subject" placeholder="Subject" defaultValue={channel.subject || ''}/>
                        </div>
                    </div>

                    <div className="text-center">
                        <button type="submit" className="btn " disabled={Channel.detail.isSaving}>
                            {channel.id?'Update':'Start'}
                        </button>
                    </div>
                    <div className="clearfix"></div>
                </form>
            </div>
        );
    }
}

ChannelForm.contextTypes = {
    router: React.PropTypes.object.isRequired
};
