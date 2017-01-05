import React from 'react';
import { Link } from 'react-router';
import { Breadcrumb } from 'react-bootstrap';

export default class BreadCrumb extends React.Component {

    render() {
        const { section, parents } = this.props;

        return (
            section?(
                <Breadcrumb>
                    {parents.map((item) => {
                        return (
                            <li key={item.toString()}><Link to={item.link}>{item.name}</Link></li>
                        );
                    })}
                    <Breadcrumb.Item active>{section}</Breadcrumb.Item>
                </Breadcrumb>
            ):null
        );
    }
}

BreadCrumb.propTypes = {
    parents: React.PropTypes.array,
    section: React.PropTypes.string
};
