import React from 'react'
import { Link } from 'react-router'

export default class TagList extends React.Component {

    render() {
        const { tags, link } = this.props;
        const max = this.props.max || tags.length;
        const excess = tags.length - max;
        const more_link = link || '#';
        var tag_list = tags.slice(0, max);

        return (
            <div className="tag-list">
                {tag_list.map((tag, idx) => {
                    return (<Link key={tag.id} to={`/task/tag/${tag.name}/`}>{tag.name}{idx < tag_list.length-1?',':''} </Link>)
                    })}
                {excess > 0?(
                <Link to={more_link}> and {excess} more</Link>
                    ):null}
            </div>
        );
    }
}
