import React from 'react'
import Progress from './Progress'
import Waypoint from 'react-waypoint'

export default class LoadMore extends React.Component {

    constructor(props) {
        super(props);
    }

    handleLoadMore() {
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
                                (<button type='button' className="btn btn-default btn-sm" onClick={this.handleLoadMore.bind(this)}><span className={"fa fa-angle-" + (this.props.direction == 'up'?"up":"down")}/> {this.props.text || 'Load More'}</button>)
                            }
                            <Waypoint
                                onEnter={this.handleLoadMore()}
                                threshold={0.2}
                            />
                        </div>
                    ):null
                }
            </div>
        );
    }
}
