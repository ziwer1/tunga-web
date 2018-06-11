import React from 'react';

import Input from './Input';
import {filterEventProps} from "./utils";

export default class InputGroup extends React.Component {
    static propTypes = {
        type: React.PropTypes.string,
        className: React.PropTypes.string,
        placeholder: React.PropTypes.string,
        prepend: React.PropTypes.object,
        append: React.PropTypes.object,
        isPrependText: React.PropTypes.bool,
        isAppendText: React.PropTypes.bool,
        size: React.PropTypes.string,
    };

    static defaultProps = {
        isPrependText: true,
        isAppendText: true
    };

    constructor(props) {
        super(props);
        this.state = {focus: false};
    }

    onChangeFocus(focus) {
        this.setState({focus});
    }

    render() {
        return (
            <div className={`input-group ${this.props.className || ''} ${this.state.focus?'state-focus':''}`}>
                {this.props.prepend?(
                    <span className="input-group-prepend">
                        {this.props.isPrependText?(
                            <span className="input-group-text">
                                {this.props.prepend}
                            </span>
                        ):(
                            this.props.prepend
                        )}
                    </span>
                ):null}
                <Input
                    type={this.props.type}
                    className="form-control"
                    size={this.props.size}
                    placeholder={this.props.placeholder}
                    {...filterEventProps(this.props)}
                    onFocus={this.onChangeFocus.bind(this, true)}
                    onBlur={this.onChangeFocus.bind(this, false)}/>
                {this.props.append?(
                    <span className="input-group-prepend">
                        {this.props.isAppendText?(
                            <span className="input-group-text">
                                {this.props.append}
                            </span>
                        ):(
                            this.props.append
                        )}
                    </span>
                ):null}
            </div>
        );
    }
}
