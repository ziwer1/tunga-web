import React from 'react';
import {Link} from 'react-router';
import {Tooltip} from 'reactstrap';
import randomstring from 'randomstring';

export default class Avatar extends React.Component {
    static propTypes = {
        className: React.PropTypes.string,
        image: React.PropTypes.string,
        icon: React.PropTypes.string,
        size: React.PropTypes.string,
        title: React.PropTypes.string,
        link: React.PropTypes.string,
        badge: React.PropTypes.number,
    };

    constructor(props) {
        super(props);
        this.state = {tooltipOpen: false};
    }

    toggle() {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen
        });
    }

    render() {
        const {className, image, icon, size, title, link, badge} = this.props,
            avatarId = `avatar${randomstring.generate()}`;
        let avatar = (
            <div>
                {badge ? <span className="badge">{badge}</span> : null}
                <div
                    className={`avatar ${size?`avatar-${size}`:''} ${image?'':'avatar-icon'}`}
                    style={image?{backgroundImage: `url(${image})`}:{}}>
                    {image ? null : (
                        icon || <i className="tg-ic-avatar"/>
                    )}
                </div>
            </div>
        );

        let linkedAvatar = link ? <Link to={link}>{avatar}</Link> : avatar;

        return title ? (
            <div id={avatarId} className={`avatar-wrapper ${className || ''}`}>
                {linkedAvatar}
                <Tooltip
                    placement="top"
                    target={avatarId}
                    isOpen={this.state.tooltipOpen}
                    toggle={this.toggle.bind(this)}>
                    <strong>{title}</strong>
                </Tooltip>
            </div>
        ) : (
            linkedAvatar
        );
    }
}
