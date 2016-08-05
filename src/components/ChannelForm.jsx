import React from 'react'
import FormStatus from './status/FormStatus'
import FieldError from './status/FieldError'
import UserSelector from '../containers/UserSelector'

export default class ChannelForm extends React.Component {

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {participants: []};
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.Channel.detail.isSaved && !prevProps.Channel.detail.isSaved) {
            const { Channel } = this.props;
            this.refs.channel_form.reset();
            this.setState({participants: []});
            const { router } = this.context;
            router.replace('/channel/'+ Channel.detail.channel.id);
        }
    }

    onParticipantChange(participants) {
        this.setState({participants: participants});
    }

    handleSubmit(e) {
        e.preventDefault();
        var subject = this.refs.subject.value.trim();
        const { ChannelActions } = this.props;
        const participants = this.state.participants;
        ChannelActions.createChannel({subject, participants});
        return;
    }

    render() {
        const { Channel, Auth } = this.props;
        return (
            <div className="new-channel">
                <form onSubmit={this.handleSubmit.bind(this)} name="channel" role="form" ref="channel_form">
                    <FormStatus loading={Channel.detail.isSaving}
                                success={Channel.detail.isSaved}
                                message={'Channel Sent'}
                                error={Channel.detail.error.create}/>

                    <h3>You are about to start a new conversation</h3>

                    {(Channel.detail.error.create && Channel.detail.error.create.participants)?
                        (<FieldError message={Channel.detail.error.create.participants}/>):null}
                    <div className="form-group">
                        <label className="control-label">Select users</label>
                        <div>
                            <UserSelector filter={{filter: null}} onChange={this.onParticipantChange.bind(this)}/>
                        </div>
                    </div>

                    {(Channel.detail.error.create && Channel.detail.error.create.subject)?
                        (<FieldError message={Channel.detail.error.create.subject}/>):null}

                    <div className="form-group" style={{display: (this.state.participants.length>1?'block':'none')}} >
                        <label className="control-label">Subject</label>
                        <div>
                            <input type="text" className="form-control" ref="subject" placeholder="Subject"/>
                        </div>
                    </div>

                    <div className="text-center">
                        <button type="submit" className="btn " disabled={Channel.detail.isSaving}>
                            Start
                        </button>
                    </div>
                    <div className="clearfix"></div>
                </form>
            </div>
        );
    }
}
