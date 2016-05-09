import React from 'react'
import Progress from './Progress'

export default class LoadMore extends React.Component {

    handleLoadMore(e) {
        e.preventDefault();
        if(this.props.callback) {
            this.props.callback(this.props.url);
        }
    }

    render() {
        return (
            <div>
                {this.props.url?
                    (
                        <div className="load-more">
                            {this.props.loading?
                                (<Progress/>)
                                :
                                (<a href='#' className="btn btn-default btn-sm" onClick={this.handleLoadMore.bind(this)}><span className={"fa fa-angle-" + (this.props.direction == 'up'?"up":"down")}/> {this.props.text || 'Load More'}</a>)
                            }
                        </div>
                    ):''
                }
            </div>
        );
    }
}
