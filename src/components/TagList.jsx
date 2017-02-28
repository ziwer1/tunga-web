import React from 'react';
import { Link } from 'react-router';

export default class TagList extends React.Component {

    render() {
        const { tags, linkPrefix, moreLink } = this.props;
        const max = this.props.max || tags.length;
        const excess = tags.length - max;
        var tag_list = tags.slice(0, max);

        return (
            <div className="tag-list">
                {tag_list.map((tag, idx) => {
                    return (<Link key={tag.id} to={`${linkPrefix || '/work/skill/'}${tag.name}/`}>{tag.name}{idx < tag_list.length-1?',':''} </Link>)
                    })}
                {excess > 0?(
                <Link to={moreLink || '#'}> and {excess} more</Link>
                    ):null}
            </div>
        );
    }
}

TagList.propTypes = {
    tags: React.PropTypes.array.isRequired,
    linkPrefix: React.PropTypes.string,
    moreLink: React.PropTypes.string
};

TagList.defaultProps = {
    tags: []
};
