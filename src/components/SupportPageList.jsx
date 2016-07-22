import React from 'react'
import { Link } from 'react-router'
import Progress from './status/Progress'
import LoadMore from './status/LoadMore'

export default class SupportPageList extends React.Component {

    componentDidMount() {
        this.props.SupportActions.listSupportPages({search: this.props.search});
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.search != this.props.search) {
            this.props.SupportActions.listSupportPages({search: this.props.search});
        }
    }

    render() {
        const { Support, SupportActions } = this.props;

        return (
            <div>
                {Support.Page.list.isFetching?
                    (<Progress/>)
                    :
                    (<div>
                        <div>
                            {Support.Page.list.pages.map((page) => {
                                return(
                                <div key={page.id}>
                                    <Link to={`/support/${page.section.slug}/${page.slug}/`}>{page.title}</Link>
                                </div>
                                    );
                                })}
                        </div>
                        <LoadMore url={Support.Page.list.next} callback={SupportActions.listMoreSupportPages} loading={Support.Page.list.isFetchingMore}/>
                        {Support.Page.list.pages.length?null:(
                        <div className="alert alert-info">No pages to display</div>
                            )}
                    </div>)
                    }
            </div>
        );
    }
}
