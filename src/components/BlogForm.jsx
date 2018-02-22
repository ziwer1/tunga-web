import React from 'react';
import {Link} from 'react-router';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import Dropzone from 'react-dropzone';

import FormStatus from './status/FormStatus';
import FieldError from './status/FieldError';
import ComponentWithModal from './ComponentWithModal';
import DanteWrapper from './DanteWrapper';

momentLocalizer(moment);

export default class BlogForm extends ComponentWithModal {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      body: '',
      published: false,
      photo: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const blog = this.props.blog || {};
    this.setState({...blog});
  }

  componentDidUpdate(prevProps, prevState) {
    const {Blog} = this.props;
    const blog = this.props.blog || {};

    if (
      this.props.Blog.detail.isSaved &&
      !prevProps.Blog.detail.isSaved
    ) {
      if (
        !this.props.blog ||
        this.props.blog != Blog.detail.blog.id
      ) {
        const {router} = this.context;
        router.replace(
          `/blog/admin/${Blog.detail.blog.id}`,
        );
      }

      this.setState({...Blog.detail.blog});
    }

    if (
      this.props.Blog.detail.blog.id &&
      !prevProps.Blog.detail.blog.id
    ) {
      this.setState({...this.props.Blog.detail.blog});
    }
  }

  onInputChange(key, e) {
    var new_state = {};
    new_state[key] = e.target.value;
    this.setState(new_state);
  }

  onStateValueChange(key, value) {
    var new_state = {};
    new_state[key] = value;
    this.setState(new_state);
  }

  onPublishedChange() {
    this.setState({published: !this.state.published});
  }

  onDrop(files) {
    this.setState({photo: files[0]});
  }

  onContentChange(editorContext, content) {
    console.log('onContentChange: ', editorContext, content);
    this.setState({body: JSON.stringify(content)});
  }

  handleSubmit(e) {
    if(e) {
      e.preventDefault();
    }
    const title = this.state.title;
    const body = this.state.body;
    const published = this.state.published;
    const image = this.state.photo;


    const {BlogActions} = this.props;
    const blog = this.props.blog || {};

    let blog_info = {title, body, published, image};

    if (blog.id) {
      BlogActions.updateBlog(blog.id, blog_info);
    } else {
      BlogActions.createBlog(blog_info);
    }
    return;
  }

  parseContent() {
    const blog = this.props.blog || {};
    if(blog.body && /^{.*}$/ig.test(blog.body)) {
      return JSON.parse(blog.body);
    }
    return null;
  }

  render() {
    const {Blog} = this.props;
    const blog = this.props.blog || {};

    let id_doc = this.state.photo
      ? this.state.photo.preview
      : blog.image;

    return (
      <div className="blog-form">

        <ol className="breadcrumb">
          <li>
            <Link to={`/blog/`}>Blog</Link>
          </li>
          <li>
            {blog && blog.id?blog.title:'New blog post'}
          </li>
        </ol>

        <FormStatus
          loading={Blog.detail.isSaving}
          success={Blog.detail.isSaved}
          message="Blog saved successfully"
          error={Blog.detail.error.create}
        />

        {Blog.detail.error.create && Blog.detail.error.create.message
          ? <FieldError message={Blog.detail.error.create.message} />
          : null}
        {Blog.detail.error.update && Blog.detail.error.update.message
          ? <FieldError message={Blog.detail.error.update.message} />
          : null}

        {Blog.detail.error.create &&
        Blog.detail.error.create.title
          ? <FieldError message={Blog.detail.error.create.title} />
          : null}
        {Blog.detail.error.update &&
        Blog.detail.error.update.title
          ? <FieldError message={Blog.detail.error.update.title} />
          : null}
        <div className="form-group">
          <label className="control-label">Title *</label>
          <input
            className="form-control"
            onChange={this.onInputChange.bind(this, 'title')}
            value={this.state.title}
            ref="title"
            placeholder="Title"
          />
        </div>

        {Blog.detail.error.create &&
        Blog.detail.error.create.published
          ? <FieldError message={Blog.detail.error.create.published} />
          : null}
        {Blog.detail.error.update &&
        Blog.detail.error.update.published
          ? <FieldError message={Blog.detail.error.update.published} />
          : null}
        <div className="form-group">
          <div className="checkbox">
            <label className="control-label">
              <input
                type="checkbox"
                ref="published"
                checked={this.state.published}
                onChange={this.onPublishedChange.bind(this)}
              />
              Publish
            </label>
          </div>
        </div>

        <Dropzone
          ref="dropzone"
          className="dropzone"
          multiple={false}
          accept={'image/*'}
          onDrop={this.onDrop.bind(this)}>
          <div className="msg">
            {id_doc
              ? <div>
                <img
                  src={id_doc}
                  style={{maxWidth: '100%', maxHeight: '300px'}}
                />
                {this.state.photo
                  ? <p>
                    {this.state.photo.name}
                  </p>
                  : null}
              </div>
              : <i
                className="fa fa-cloud-upload fa-2x"
                style={{marginTop: '30px'}}
              />}
            <div>
              Drop an image here or click to select an image to upload.
            </div>
          </div>
        </Dropzone>

        {Blog.detail.error.create &&
        Blog.detail.error.create.body
          ? <FieldError message={Blog.detail.error.create.body} />
          : null}
        {Blog.detail.error.update &&
        Blog.detail.error.update.body
          ? <FieldError message={Blog.detail.error.update.body} />
          : null}
        {/*<div className="form-group">
          <label className="control-label">Body *</label>
          <textarea
            className="form-control"
            onChange={this.onInputChange.bind(this, 'body')}
            value={this.state.body}
            ref="body"
            placeholder="Body"
          />
        </div>*/}

        <div>
          <DanteWrapper onChange={this.onContentChange.bind(this)} content={this.parseContent()}/>
        </div>

        <button
          type="button"
          className="btn"
          disabled={Blog.detail.isSaving} onClick={this.handleSubmit.bind(this)}>
          Save
        </button>
      </div>
    );
  }
}

BlogForm.propTypes = {
  blog: React.PropTypes.object,
};

BlogForm.defaultProps = {
  blog: null,
};

BlogForm.contextTypes = {
  router: React.PropTypes.object.isRequired,
};
