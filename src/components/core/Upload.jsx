import React from 'react';
import Dropzone from 'react-dropzone';
import _ from 'lodash';

import Button from './Button';
import Icon from './Icon';

const UPLOAD_TYPES = {
    image: {
        accept: 'image/*',
    }
};

export default class Upload extends React.Component {

    static propTypes = {
        widget: React.PropTypes.string,
        type: React.PropTypes.string,
        className: React.PropTypes.string,
        placeholder: React.PropTypes.string,
        multiple: React.PropTypes.object,
        onChange: React.PropTypes.func,
        size: React.PropTypes.string,
        max: React.PropTypes.number,
        icon: React.PropTypes.number,
    };

    static defaultProps = {
        widget: 'dropzone',
        type: 'file',
        multiple: false,
        max: 0
    };

    constructor(props) {
        super(props);
        this.state = {
            files: [],
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.onChange && !_.isEqual(prevState.files, this.state.files)) {
            this.props.onChange(this.state.files);
        }
    }

    getProperties() {
        return UPLOAD_TYPES[this.props.type] || {};
    }

    onDrop(files) {
        this.setState({files: this.props.multiple?[...this.state.files, ...files]:[files[0]]});
    }

    onUpload() {
        this.refs.dropzone.open();
    }

    onRemoveFile(file) {
        let updatedFiles = [];
        this.state.files.forEach(item => {
            if(item.preview !== file.preview) {
                updatedFiles.push(item);
            }
        });

        this.setState({files: updatedFiles});
    }

    render() {
        return (
            <div className={`upload-input ${this.props.className || ''}`}>
                {this.state.files.length && (this.props.widget !== 'dropzone' || this.props.multiple)?(
                    <div className="file-list">
                        {this.state.files.map(file => {
                            return (
                                <div className="file-item">
                                    <i className="tg-ic-file"/> {file.name}
                                    <button className="btn" onClick={this.onRemoveFile.bind(this, file)}><i className="tg-ic-close"/></button>
                                </div>
                            )
                        })}
                    </div>
                ):null}

                <Dropzone
                    ref="dropzone"
                    className={`dropzone ${this.props.widget === 'dropzone'?'':'hidden'}`}
                    multiple={this.props.multiple}
                    {...this.getProperties()}
                    onDrop={this.onDrop.bind(this)}>
                    <div>
                        {this.state.files.length?this.state.files.map(file => {
                            return (
                                <div>
                                    {this.props.type === 'image'?(
                                        <img src={file.preview}/>
                                    ):null}
                                    <div className="filename"><i className="tg-ic-file"/> {file.name}</div>
                                </div>
                            );
                        }):(
                            <i className="tg-ic-upload"/>
                        )}

                        {(!this.props.multiple && this.state.files.length === 0) || (this.props.multiple && (this.state.files.length < this.props.max || this.props.max === 0))?(
                            <div className="help">
                                Drop {this.props.type || 'file'}{this.props.multiple?'s':''} here or click to select from your device.
                            </div>
                        ):null}
                    </div>
                </Dropzone>

                {['button', 'icon'].indexOf(this.props.widget) > -1?(
                    <Button variant={this.props.widget === 'icon'?'icon':null}
                            size={this.props.widget === 'button'?(this.props.size || 'md'):null}
                            onClick={this.onUpload.bind(this)}>
                        <Icon name={this.props.icon || (this.props.widget === 'icon'?'add':'upload')}
                              size={this.props.widget === 'icon'?(this.props.size || 'md'):null}/>
                        {this.props.widget === 'button'?' Upload':''}
                    </Button>

                ):null}
            </div>
        );
    }
}
