import React from 'react'
import Dropzone from 'react-dropzone'
import Progress from './status/Progress'
import FormStatus from './status/FormStatus'
import Avatar from './Avatar'

export default class ProfilePicture extends React.Component {
    constructor(props) {
        super(props);
        this.state = {photo: null};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.props.ProfileActions.retrieveProfile();
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.Profile.isSaved.user && !prevProps.Profile.isSaved.user) {
            this.setState({photo: null});
        }
    }

    onDrop(files) {
        this.setState({photo: files[0]});
    }

    onClickOpen() {
        this.refs.dropzone.open();
    }

    handleSubmit(e) {
        e.preventDefault();

        const image = this.state.photo;
        const { ProfileActions } = this.props;

        ProfileActions.updateAuthUser({image});
        return;
    }

    render() {
        const { Auth, Profile } = this.props;

        return (
            <div>
                {Profile.isRetrieving?(
                <Progress/>
                    ):(
                <form onSubmit={this.handleSubmit} name="profile" role="form" ref="profile_form">
                    <FormStatus loading={Profile.isSaving.user}
                                success={Profile.isSaved.user}
                                message={'Profile picture saved'}
                                error={Profile.error.user}/>

                    <Dropzone ref="dropzone" className="dropzone" multiple={false} accept={'image/*'}
                              onDrop={this.onDrop.bind(this)}>
                        <div className="msg">
                            {this.state.photo?(
                            <div>
                                <Avatar src={this.state.photo.preview} size="xxl"/>
                                <p>{this.state.photo.name}</p>
                            </div>
                                ):(
                            <i className="fa fa-cloud-upload fa-2x" style={{marginTop: '30px'}}/>)}
                            <div>Drop an image here or click to select an image to upload.</div>
                        </div>
                    </Dropzone>

                    <button type="submit" className="btn  pull-right" disabled={Profile.isSaving.user || !this.state.photo}>Upload</button>
                    <div className="clearfix"></div>
                </form>
                    )}
            </div>

        );
    }
}
