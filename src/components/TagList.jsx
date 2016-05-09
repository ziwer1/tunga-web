import React from 'react'
import { Link } from 'react-router'

export default class TagList extends React.Component {

    render() {
        const { tags, link } = this.props;
        const max = this.props.max || tags.length;
        const excess = tags.length - max;
        const more_link = link || '#';

        return (
            <div className="tag-list">
                {tags.slice(0, max).map((tag) => {
                    return (<Link key={tag.id} to={`/task/tag/${tag.name}/`} className="tag">{tag.name}</Link>)
                    })}
                {excess > 0?(
                <Link to={more_link} className="tag">{excess} more</Link>
                    ):''}
            </div>
        );
    }
}
