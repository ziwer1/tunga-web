import React from 'react';
import {Link} from 'react-router';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';

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

    render() {
        const {className, image, icon, size, title, link, badge} = this.props;
        let avatar = (
            <div className={`avatar-wrapper ${className || ''}`}>
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
            <OverlayTrigger
                placement="top"
                overlay={
                    <Tooltip id="tooltip">
                        <strong>{title}</strong>
                    </Tooltip>
                }>
                {linkedAvatar}
            </OverlayTrigger>
        ) : (
            linkedAvatar
        );
    }
}
