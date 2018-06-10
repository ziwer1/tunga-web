import React from 'react';
import ReactDOMServer from 'react-dom/server';
import jsxToString from 'jsx-to-string';
import _ from 'lodash';
import {DateTimePicker, Calendar} from 'react-widgets';

import Icon from '../../components/core/Icon';
import Button from '../../components/core/Button';
import Input from '../../components/core/Input';
import InputGroup from '../../components/core/InputGroup';
import CustomInputGroup from '../../components/core/CustomInputGroup';
import TextArea from '../../components/core/TextArea';
import Avatar from '../../components/core/Avatar';
import moment from "moment/moment";
import momentLocalizer from "react-widgets/lib/localizers/moment";

let avatarUrl = require('../images/deadpool.jpg');

momentLocalizer(moment);

export default class StyleGuide extends React.Component {

    document(component, showComponent=true, showHTML=false, componentName=null) {
        let options = {};
        if(componentName) {
            options.displayName = componentName;
        }

        return (
            <div>
                {showComponent?(
                    <div>
                        {showComponent && showHTML?(
                            <h6>Component:</h6>
                        ):null}
                        <code>
                            {jsxToString(component, options)}
                        </code>
                    </div>
                ):null}
                {showHTML?(
                    <div>
                        {showComponent && showHTML?(
                            <h6>HTML:</h6>
                        ):null}
                        <code>
                            {ReactDOMServer.renderToStaticMarkup(component)}
                        </code>
                    </div>
                ):null}
            </div>
        );
    }

    renderAndDocument(component, showHTML=false, extraDocs=null, componentName=null) {
        return (
            <div>
                {this.document(component, true, showHTML, componentName)}
                {extraDocs || null}
                <div>
                    {component}
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="container">
                <h1>Style & Component Guide</h1>
                <div className="section">
                    <h2>Colors</h2>
                    {[
                        ['black', '#444'],
                        ['white', '#fff'],
                        ['pink', '#ee1f54'],
                        ['lightest-grey', '#fafafa'],
                        ['light-grey', '#f8f8f8'],
                        ['dark-grey', '#888'],
                        ['green', '#40bb56'],
                        ['orange', '#ff7904'],
                        ['red', '#e93232']
                    ].map(color => {
                        return (
                            <div>
                                <span className={`color color-${color[0]}`}/> <span className="hex">{color[1]}</span> | <span className="name">{_.upperFirst(color[0].split('-').join(' '))}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="section">
                    <h2>Typography</h2>
                    <div className="sub-section">
                        <h4>Font</h4>
                        Fira Sans <a href="https://fonts.google.com/specimen/Fira+Sans" target="_blank">https://fonts.google.com/specimen/Fira+Sans</a>
                    </div>

                    <div className="sub-section">
                        <h4>Weight</h4>
                        {this.renderAndDocument(
                            <div className="font-weight-thin">Thin (100 | .font-weight-thin)</div>
                        )}
                        {this.renderAndDocument(
                            <div className="font-weight-light">Light (300 | .font-weight-light) - Default font weight</div>
                        )}
                        {this.renderAndDocument(
                            <div className="font-weight-normal">Regular (400 | .font-weight-normal)</div>
                        )}
                        {this.renderAndDocument(
                            <div className="font-weight-medium">Regular (500 | .font-weight-medium) - Default for headings</div>
                        )}
                        {this.renderAndDocument(
                            <div className="font-weight-bold">Bold (700 | .font-weight-bold)</div>
                        )}
                    </div>

                    <div className="sub-section">
                        <h4>HTML Headings</h4>
                        {this.renderAndDocument(
                            <h1>h1 (2.5 rem)</h1>
                        )}
                        {this.renderAndDocument(
                            <h2>h2 (2.0 rem)</h2>
                        )}
                        {this.renderAndDocument(
                            <h3>h3 (1.75 rem)</h3>
                        )}
                        {this.renderAndDocument(
                            <h4>h4 (1.5 rem)</h4>
                        )}
                        {this.renderAndDocument(
                            <h5>h5 (1.25 rem)</h5>
                        )}
                        {this.renderAndDocument(
                            <h6>h6 (1 rem)</h6>
                        )}
                    </div>

                    <div className="sub-section">
                        <h4>Custom headings</h4>
                        {this.renderAndDocument(
                            <div className="showcase-title">Showcase title</div>
                        )}
                        {this.renderAndDocument(
                            <div className="showcase-section-title">Showcase section title</div>
                        )}
                        {this.renderAndDocument(
                            <div className="page-title">Page title</div>
                        )}
                        {this.renderAndDocument(
                            <div className="page-sub-title">Page sub title</div>
                        )}
                        {this.renderAndDocument(
                            <div className="pop-up-title">Pop up title</div>
                        )}
                    </div>

                    <div className="sub-section">
                        <h4>Text</h4>
                        {this.renderAndDocument(
                            <div className="text text-sm">Small text</div>
                        )}
                        {this.renderAndDocument(
                            <div className="text">Normal text - Default text size</div>
                        )}
                        {this.renderAndDocument(
                            <div className="text text-lg">Large text</div>
                        )}
                        {this.renderAndDocument(
                            <div className="showcase-desc">Showcase description</div>
                        )}
                    </div>
                </div>

                <div className="section detailed">
                    <h2>Icon sizes</h2>
                    {[
                        'navbar', 'sidebar', 'topbar',
                        'webfunnel', 'card',
                        ['main-sm', 'Main Small', ['sm']],
                        'main',
                        ['main-lg', 'Main Large', ['lg']],
                        ['main-xl', 'Main Extra Large', ['xl', 'main-xlg']],
                    ].map(icon => {
                        let iconName = icon,
                            sizeTitle = icon, aliases = null;
                        if(Array.isArray(icon)) {
                            iconName = icon[0];
                            sizeTitle = icon[1];
                            aliases = icon[2];
                        }

                        let extraDoc = null;

                        if(aliases) {
                            extraDoc = (
                                <div>
                                    <h6>Aliases:</h6>
                                    {aliases.map(alias => {
                                        return (
                                            this.document(
                                                <Icon name="check" size={alias}/>
                                            )
                                        );
                                    })}
                                </div>
                            );
                        }

                        return (
                            <div>
                                <h4>{_.upperFirst(sizeTitle)}</h4>
                                {this.renderAndDocument(
                                    <Icon name="check" size={iconName}/>,
                                    false, extraDoc
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="section detailed">
                    <h2>Buttons</h2>
                    {[
                        [null, 'Small', {size: 'sm'}],
                        [null, 'Default'],
                        [null, 'Large', {size: 'lg'}],
                        [null, 'Extra Large', {size: 'xl'}],
                        [null, 'Extra Extra Large', {size: 'xxl'}],
                        'negative',
                        'skill',
                        'outline-primary', 'outline-negative'
                    ].map(button => {
                        let buttonProps = {},
                            buttonName = button,
                            buttonTitle = null;

                        if(button) {
                            if(Array.isArray(button)) {
                                if(button[0]) {
                                    buttonProps.variant = button[0];
                                }
                                buttonName = button[1];
                                buttonTitle = button[1];
                                if(button[2]) {
                                    buttonProps = {...buttonProps, ...button[2]};
                                }
                            } else {
                                buttonProps.variant = button;
                                buttonTitle =_.upperFirst(button);
                            }
                        }

                        function cleanName(name) {
                            return name.split('-').map(str => {
                                return _.upperFirst(str);
                            }).join(' ');
                        }

                        return (
                            <div>
                                <h4>{cleanName(buttonTitle)}</h4>
                                {this.renderAndDocument(
                                    <Button {...buttonProps}>{cleanName(buttonName)}</Button>, true
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="section detailed">
                    <h2>Inputs</h2>

                    {[
                        ['Small', {size: 'sm'}],
                        ['Default'],
                        ['Large', {size: 'lg'}]
                    ].map(input => {
                        return (
                            <div>
                                <h4>{input[0]}</h4>
                                {this.renderAndDocument(
                                    <Input {...(input[1] || {})} placeholder="Placeholder"/>
                                )}
                            </div>
                        );
                    })}

                    {[
                        ['personal', 'Personal Information'],
                        ['password', 'Password'],
                        ['tel', 'Phone Number'],
                        ['address', 'Address'],
                        ['url', 'URL Input'],
                        ['message', 'Message'],
                        ['search', 'Search'],
                        ['search-plain', 'Search Plain'],
                    ].map(input => {
                        let inputProps = {};

                        if(input[0]) {
                            inputProps.widget = input[0];
                        }
                        if(input[2]) {
                            inputProps.placeholder = input[2];
                        }
                        if(input[3]) {
                            inputProps = {...inputProps, ...input[2]};
                        }

                        return (
                            <div>
                                <h4>{input[1]}</h4>
                                {this.renderAndDocument(
                                    <CustomInputGroup {...inputProps}/>
                                )}
                            </div>
                        );
                    })}

                    <div>
                        <h4>TextArea</h4>
                        {this.renderAndDocument(
                            <TextArea placeholder="Type message here"/>
                        )}
                    </div>

                    {[
                        ['DateTimePicker', true, true],
                        ['DatePicker', true, false],
                        ['TimePicker', false, true],
                    ].map(picker => {
                        return (
                            <div>
                                <h4>{picker[0]}</h4>
                                {this.renderAndDocument(
                                    <DateTimePicker calendar={picker[1]} time={picker[2]}/>,
                                    false, null, 'DateTimePicker'
                                )}
                            </div>
                        );
                    })}

                    <div>
                        <h4>Calendar</h4>
                        {this.renderAndDocument(
                            <Calendar/>, false, null, 'Calendar'
                        )}
                    </div>
                </div>

                <div className="section detailed">
                    <h2>Avatars</h2>
                    {[
                        ['xs', avatarUrl, 'Extra Small (20px)'],
                        ['sm', avatarUrl, 'Small (30px)'],
                        [null, avatarUrl, 'Default (40px)'],
                        ['md', avatarUrl, 'Medium (60px)'],
                        ['lg', avatarUrl, 'Large (80px)'],
                        ['xl', avatarUrl, 'Extra Large (100px)'],
                        ['xxl', avatarUrl, 'Extra Extra Large (120px)'],
                        [null, null, 'Missing Image'],
                        [null, avatarUrl, 'Notification Badge', {badge: 5}],
                    ].map(avatar => {
                        let avatarProps = {};
                        if(avatar[0]) {
                            avatarProps.size = avatar[0];
                        }
                        if(avatar[1]) {
                            avatarProps.image = avatar[1];
                        }
                        if(avatar[3]) {
                            avatarProps = {...avatarProps, ...avatar[3]};
                        }

                        return (
                            <div>
                                <h4>{avatar[2]}</h4>
                                {this.renderAndDocument(
                                    <Avatar {...avatarProps}/>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}
