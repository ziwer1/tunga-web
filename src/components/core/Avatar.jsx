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
                {link?(
                    <Link to={link}>{avatar}</Link>
                ):avatar}
                {verified?(
                    <Icon name="check" className="verified"/>
                ):null}
                {title?(
                    <Tooltip
                        placement="top"
                        target={avatarId}
                        isOpen={this.state.tooltipOpen}
                        toggle={this.toggle.bind(this)}>
                        <strong>{title}</strong>
                    </Tooltip>
                ):null}
            </div>
        );
    }
}
