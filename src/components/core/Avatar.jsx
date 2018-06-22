import React from 'react';
import {Link} from 'react-router';
import {Tooltip} from 'reactstrap';
import PropTypes from 'prop-types';
import randomstring from 'randomstring';

import Icon from './Icon';

export default class Avatar extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        image: PropTypes.string,
        icon: PropTypes.string,
        size: PropTypes.string,
        title: PropTypes.string,
        link: PropTypes.string,
        badge: PropTypes.number,
        verified: PropTypes.bool,
    };

    static defaultProps = {
        verified: false
    };

    render() {
        const {className, image, icon, size, title, link, badge, verified} = this.props,
            avatarId = `avatar${randomstring.generate()}`;
        let avatar = (
            <div
                className={`avatar ${size?`avatar-${size}`:''} ${image?'':'avatar-icon'}`}
                style={image?{backgroundImage: `url(${image})`}:{}}>
                {image ? null : (
                    icon || <Icon name="avatar"/>
                )}
            </div>
        );

        return (
            <div id={avatarId} className={`avatar-wrapper ${className || ''}`}>
                {badge?(
                    <span className="badge">{badge}</span>
                ):null}
                {verified?(
                    <Icon name="check" className="verified"/>
                ):null}
                {link || title?(
                    <Link to={link} title={title}>{avatar}</Link>
                ):avatar}
            </div>
        );
    }
}
