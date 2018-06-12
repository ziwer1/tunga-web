import React from 'react';
import ReactDOMServer from 'react-dom/server';
import jsxToString from 'jsx-to-string';
import _ from 'lodash';
import {DateTimePicker, Calendar} from 'react-widgets';
import moment from "moment/moment";
import momentLocalizer from "react-widgets/lib/localizers/moment";

import Icon from '../../components/core/Icon';
import Button from '../../components/core/Button';
import Input from '../../components/core/Input';
import CustomInputGroup from '../../components/core/CustomInputGroup';
import TextArea from '../../components/core/TextArea';
import Upload from '../../components/core/Upload';
import ChoiceGroup from '../../components/core/ChoiceGroup';
import Avatar from '../../components/core/Avatar';
import NavBar from '../../components/core/NavBar';
import SideBar from '../../components/core/SideBar';

momentLocalizer(moment);

let avatarUrl = require('../images/deadpool.jpg');

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

    renderAndDocument(component, showHTML=false, componentName=null, extraDocs=null) {
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
            <div>
                <NavBar/>
                <div className="container">
                    <h1>Style & Component Guide</h1>

                    <div className="row">
                        <nav id="side-nav" className="col-md-2">
                            <ul data-spy="affix" data-offset-top="0">
                                {[
                                    'Colors', 'Typography', 'Navigation',
                                    ['Icons', 'Icon Sizes'],
                                    'Buttons',
                                    ['Inputs', 'Text Input'],
                                    ['DateTime', 'DateTime Input'],
                                    ['Uploads', 'File Uploads'],
                                    ['Choices', 'Choice Input'],
                                    'Avatars'
                                ].map((section, idx) => {
                                    let sectionId = section,
                                        sectionTitle = section;

                                    if(Array.isArray(section)) {
                                        sectionId = section[0];
                                        sectionTitle = section[1];
                                    }

                                    return (
                                        <li><a href={`#id${sectionId}`}>{ idx + 1 }. {sectionTitle}</a></li>
                                    );
                                })}
                            </ul>
                        </nav>
                        <div className="col-md-10">
                            <div className="section">
                                <h2 id="idColors">Colors</h2>
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
                                <h2 id="idTypography">Typography</h2>
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
                                <h2 id="idNavigation">Navigation</h2>

                                {[
                                    ['Navbar', false],
                                    ['Navbar for Admins', true]
                                ].map(navbar => {
                                    return (
                                        <div className="sub-section">
                                            <h4>{navbar[0]}</h4>
                                            {this.renderAndDocument(
                                                <NavBar user={{is_admin: navbar[1], display_name: 'DeadPool', avatar_url: avatarUrl}}/>,
                                                false, 'NavBar'
                                            )}
                                        </div>
                                    );
                                })}

                                <div className="sub-section">
                                    <h4>Sidebar</h4>
                                    {this.renderAndDocument(
                                        <SideBar/>,
                                        false, 'SideBar'
                                    )}
                                </div>
                            </div>

                            <div className="section detailed">
                                <h2 id="idIcons">Icon sizes</h2>

                                <div>
                                    Checkout <a target="_blank" href="http://resources.tunga.io/tunga-assets/icons/latest/demo.html">http://resources.tunga.io/tunga-assets/icons/latest/demo.html</a> for a list of all available icons and their name.

                                    <div>
                                        <strong>NOTE: </strong> Our custom <code>&lt;Icon&gt;</code> component takes an abbreviated name for the icon.
                                        e.g <code>check</code> instead of <code>tg-ic-check</code> or <code>search</code> instead <code>tg-ic-search</code>
                                    </div>
                                </div>
                                {[
                                    'navbar', 'sidebar', 'topbar',
                                    ['showcase', 'Showcase', ['webfunnel']],
                                    'card',
                                    ['sm', 'Small', ['main-sm']],
                                    ['icon', 'Icon', ['main']],
                                    ['md', 'Medium', ['main-md']],
                                    ['lg', 'Large', ['main-lg']],
                                    ['xl', 'Extra Large', ['main-xl', 'main-xlg']],
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
                                                            <Icon name="check" size={alias}/>, true, false, 'Icon'
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
                                                false, 'Icon', extraDoc
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="section detailed">
                                <h2 id="idButtons">Buttons</h2>
                                {[
                                    [null, 'Small', {size: 'sm'}],
                                    [null, 'Default'],
                                    [null, 'Large', {size: 'lg'}],
                                    [null, 'Extra Large', {size: 'xl'}],
                                    [null, 'Extra Extra Large', {size: 'xxl'}],
                                    'secondary',
                                    'skill',
                                    'outline-primary', 'outline-secondary'
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
                                                <Button {...buttonProps}>{cleanName(buttonName)}</Button>,
                                                true, 'Button'
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="section detailed">
                                <h2 id="idInputs">Input Widgets</h2>

                                {[
                                    ['Small', {size: 'sm'}],
                                    ['Default'],
                                    ['Large', {size: 'lg'}]
                                ].map(input => {
                                    return (
                                        <div>
                                            <h4>{input[0]}</h4>
                                            {this.renderAndDocument(
                                                <Input {...(input[1] || {})} placeholder="Placeholder"/>,
                                                false, 'Input'
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
                                        inputProps.variant = input[0];
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
                                                <CustomInputGroup {...inputProps}/>,
                                                false, 'CustomInputGroup'
                                            )}
                                        </div>
                                    );
                                })}

                                <div>
                                    <h4>TextArea</h4>
                                    {this.renderAndDocument(
                                        <TextArea placeholder="Type message here"/>,
                                        false, 'TextArea'
                                    )}
                                </div>

                                <div>
                                    <code>&lt;DateTimePicker&gt;</code> and <code>&lt;Calendar&gt;</code> components are from the thirdparty <a target="_blank" href="https://jquense.github.io/react-widgets/api/DateTimePicker/">React Widgets</a> library.
                                </div>
                            </div>

                            <div className="section detailed">
                                <h2 id="id"></h2>
                            </div>

                            <div className="section detailed">
                                <h2 id="idDateTime">DateTime Input</h2>
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
                                                false, 'DateTimePicker'
                                            )}
                                        </div>
                                    );
                                })}

                                <div>
                                    <h4>Calendar</h4>
                                    {this.renderAndDocument(
                                        <Calendar/>, false, 'Calendar'
                                    )}
                                </div>
                            </div>

                            <div className="section detailed">
                                <h2 id="idUploads">File Uploads</h2>
                                {[
                                    [null, 'Upload'],
                                    ['image', 'Image Upload'],
                                    [null, 'Upload Button', {variant: 'button'}],
                                    [null, 'Upload Icon', {variant: 'icon'}],
                                    [null, 'Upload Button Small', {variant: 'button', size: 'sm'}],
                                    [null, 'Upload Button Large', {variant: 'button', size: 'lg'}],
                                    [null, 'Upload Icon Large', {variant: 'icon', size: 'lg'}],
                                    [null, 'Multiple File Upload', {multiple: true}],
                                    ['image', 'Multiple Image Upload', {multiple: true}],
                                    ['image', 'Upload (with custom placeholder)', {placeholder: <Icon name="avatar" size="xl"/>}],
                                    [null, 'Upload (with custom instructions)', {instructions: 'Drag and drop or click and upload'}],
                                    [null, 'Upload (with no instructions)', {instructions: false}],
                                ].map(upload => {
                                    let uploadProps = {};
                                    if(upload[0]) {
                                        uploadProps.type = upload[0];
                                    }
                                    if(upload[2]) {
                                        uploadProps = {...uploadProps, ...upload[2]};
                                    }

                                    return (
                                        <div>
                                            <h4>{upload[1]}</h4>
                                            {this.renderAndDocument(
                                                <Upload {...uploadProps}/>, false, 'Upload'
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="section detailed">
                                <h2 id="idChoices">Choice Input</h2>
                                {[
                                    [null, 'Choice Group'],
                                    ['primary', 'Choice Group Primary Small', {size: 'sm'}],
                                    ['primary', 'Choice Group Primary Default'],
                                    ['primary', 'Choice Group Primary Large', {size: 'lg'}],
                                    ['outline-primary', 'Choice Group Outline Primary'],
                                    ['secondary', 'Choice Group Secondary'],
                                    ['outline-secondary', 'Choice Outline Group Secondary'],
                                ].map(input => {
                                    let inputProps = {};

                                    if(input[0]) {
                                        inputProps.variant = input[0];
                                    }

                                    if(input[2]) {
                                        inputProps = {...inputProps, ...input[2]};
                                    }

                                    let choices = [
                                        [1, 'One'],
                                        [2, 'Two'],
                                        [3, 'Three']
                                    ];

                                    return (
                                        <div>
                                            <h4>{input[1]}</h4>
                                            {this.renderAndDocument(
                                                <ChoiceGroup {...inputProps}
                                                             choices={choices} selected={2}/>,
                                                false, 'ChoiceGroup'
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="section detailed">
                                <h2 id="idAvatars">Avatars</h2>
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
                                    [null, avatarUrl, 'Title', {title: 'Deadpool'}],
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
                                                <Avatar {...avatarProps}/>, false, 'Avatar'
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
