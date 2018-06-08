import React from 'react';
import ReactDOMServer from 'react-dom/server';
import jsxToString from 'jsx-to-string';

import Button from '../../components/core/Button';
import Input from '../../components/core/Input';
import InputGroup from '../../components/core/InputGroup';
import CustomInputGroup from '../../components/core/CustomInputGroup';
import TextArea from '../../components/core/TextArea';

export default class StyleGuide extends React.Component {

    renderAndDocument(component) {
        return (
            <div>
                <div>
                    <h6>Component:</h6>
                    <code>
                        {jsxToString(component)}
                    </code>
                </div>
                <div>
                    <h6>HTML:</h6>
                    <code>
                        {ReactDOMServer.renderToStaticMarkup(component)}
                    </code>
                </div>
                <div>
                    {component}
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="container">
                <div className="section">
                    <h2>Typography</h2>
                    <div className="sub-section">
                        <h4>Font</h4>
                        Fira Sans <a href="https://fonts.google.com/specimen/Fira+Sans" target="_blank">https://fonts.google.com/specimen/Fira+Sans</a>
                    </div>

                    <div className="sub-section">
                        <h4>Weight</h4>
                        <div className="font-weight-thin">Thin (100 | .font-weight-thin)</div>
                        <div className="font-weight-light">Light (300 | .font-weight-light) - Default font weight</div>
                        <div className="font-weight-normal">Regular (400 | .font-weight-normal)</div>
                        <div className="font-weight-medium">Regular (500 | .font-weight-medium) - Default for headings</div>
                        <div className="font-weight-bold">Bold (700 | .font-weight-bold)</div>
                    </div>

                    <div className="sub-section">
                        <h4>HTML Headings</h4>
                        <h1>h1 (2.5 rem)</h1>
                        <h2>h2 (2.0 rem)</h2>
                        <h3>h3 (1.75 rem)</h3>
                        <div><h4>h4 (1.5 rem)</h4></div>
                        <h5>h5 (1.25 rem)</h5>
                        <h6>h6 (1 rem)</h6>
                    </div>

                    <div className="sub-section">
                        <h4>Custom headings</h4>
                        <div className="showcase-title">Showcase title (.showcase-title)</div>
                        <div className="showcase-section-title">Showcase section title (.showcase-section-title)</div>
                        <div className="page-title">Page title (.page-title)</div>
                        <div className="page-sub-title">Page sub title (.page-sub-title)</div>
                        <div className="pop-up-title">Pop up title (.pop-up-title)</div>
                    </div>

                    <div className="sub-section">
                        <h4>Text</h4>
                        <div className="text text-sm">Small text (.text.text-sm)</div>
                        <div className="text">Normal text (.text) - Default text size</div>
                        <div className="text text-lg">Large text (.text.text-lg)</div>
                        <div className="showcase-desc">Showcase description (.showcase-desc)</div>
                    </div>
                </div>

                <div className="section">
                    <h2>Icon sizes</h2>
                    <div>
                        <i className="tg-ic-check tunga-ic-sz-navbar"/> .tunga-ic-sz-navbar
                    </div>
                    <div>
                        <i className="tg-ic-check tunga-ic-sz-sidebar"/> .tunga-ic-sz-sidebar
                    </div>
                    <div>
                        <i className="tg-ic-check tunga-ic-sz-topbar"/> .tunga-ic-sz-topbar
                    </div>
                    <div>
                        <i className="tg-ic-check tunga-ic-sz-main-sm"/> .tunga-ic-sz-main-sm
                    </div>
                    <div>
                        <i className="tg-ic-check tunga-ic-sz-main"/> .tunga-ic-sz-main
                    </div>
                    <div>
                        <i className="tg-ic-check tunga-ic-sz-main-lg"/> .tunga-ic-sz-main-lg
                    </div>
                    <div>
                        <i className="tg-ic-check tunga-ic-sz-main-xlg"/> .tunga-ic-sz-main-xlg
                    </div>
                    <div>
                        <i className="tg-ic-check tunga-ic-sz-webfunnel"/> .tunga-ic-sz-webfunnel
                    </div>
                    <div>
                        <i className="tg-ic-check tunga-ic-sz-card"/> .tunga-ic-sz-card
                    </div>
                </div>

                <div className="section detailed">
                    <h2>Buttons</h2>
                    <div>
                        <h4>Primary Button</h4>
                        {this.renderAndDocument(
                            <Button variant="primary">Primary Button</Button>
                        )}
                    </div>
                    <div>
                        <h4>Negative Button</h4>
                        {this.renderAndDocument(
                            <Button variant="negative">Negative Button</Button>
                        )}
                    </div>
                    <div>
                        <h4>Skill Button</h4>
                        {this.renderAndDocument(
                            <Button variant="skill">Skill</Button>
                        )}
                    </div>
                </div>

                <div className="section detailed">
                    <h2>Inputs</h2>
                    <div>
                        <h4>Default Input</h4>
                        {this.renderAndDocument(
                            <Input placeholder="Placeholder"/>
                        )}
                    </div>
                    <div>
                        <h4>Personal Information Input</h4>
                        {this.renderAndDocument(
                            <CustomInputGroup widget="personal"/>
                        )}
                    </div>
                    <div>
                        <h4>Password Input</h4>
                        {this.renderAndDocument(
                            <CustomInputGroup widget="password"/>
                        )}
                    </div>
                    <div>
                        <h4>Phone Number Input</h4>
                        {this.renderAndDocument(
                            <CustomInputGroup widget="tel"/>
                        )}
                    </div>
                    <div>
                        <h4>Address Input</h4>
                        {this.renderAndDocument(
                            <CustomInputGroup widget="address"/>
                        )}
                    </div>
                    <div>
                        <h4>URL Input</h4>
                        {this.renderAndDocument(
                            <CustomInputGroup widget="url"/>
                        )}
                    </div>

                    <div>
                        <h4>Message Input</h4>
                        {this.renderAndDocument(
                            <CustomInputGroup widget="message"/>
                        )}
                    </div>
                    <div>
                        <h4>Search Input</h4>
                        {this.renderAndDocument(
                            <CustomInputGroup widget="search"/>
                        )}
                    </div>
                    <div>
                        <h4>Search Input Plain (No brand colors)</h4>
                        {this.renderAndDocument(
                            <CustomInputGroup widget="search-plain"/>
                        )}
                    </div>
                    <div>
                        <h4>TextArea</h4>
                        {this.renderAndDocument(
                            <TextArea placeholder="Type message here"/>
                        )}
                    </div>
                    <div></div>
                </div>
            </div>
        );
    }
}
