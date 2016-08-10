import React from 'react';
import Rating from 'react-rating';

import { RATING_CRITERIA_CODING, RATING_CRITERIA_COMMUNICATION, RATING_CRITERIA_SPEED, RATING_CRITERIA_CHOICES } from '../constants/Api';

export default class RateDevelopers extends React.Component {

    constructor(props) {
        super(props);
        this.state = {ratings_map: null};
    }

    componentDidMount() {
        this.mapRatings();
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.Task.detail.isSaved && !prevProps.Task.detail.isSaved) {
            this.mapRatings();
        }
    }

    mapRatings() {
        const { Task } = this.props;
        const { task } = Task.detail;
        if(task && task.ratings && task.ratings.length) {
            var ratings_map = {};
            task.ratings.forEach(rating => {
                ratings_map[rating.criteria] = rating.score;
            });
            this.setState({ratings_map});
        }
    }

    handleRating(criteria, rating) {
        const { TaskActions, Task } = this.props;
        TaskActions.updateTask(Task.detail.task.id, {ratings: [{criteria, score: rating}]});
    }

    handleSubmit(e) {
        e.preventDefault();

        return;
    }

    render() {

        const { Task } = this.props;
        const { task } = Task.detail;

        return (
            <div>
                <form onSubmit={this.handleSubmit.bind(this)} name="rate" role="form" ref="rate_form">
                <h4 className="title">Rate Developer{task.details && task.details.participation && task.details.participation.length==1?'':'s'}</h4>

                <div className="card">
                    It would help the Tunga community a great deal if you could rate our
                    developers. You can rate a developer on three scales. Please take 5 seconds of your to rate our Developers. Thank you in advance
                </div>
                {RATING_CRITERIA_CHOICES.map(criteria => {
                    return (
                        <div key={criteria.id} style={{margin: '15px 0'}}>
                            <h5>{criteria.name}</h5>
                            <Rating start={0} stop={10} step={2} fractions={2} initialRate={this.state.ratings_map?this.state.ratings_map[criteria.id]:0}
                                    empty={'fa fa-star-o fa-lg rating'} full={'fa fa-star fa-lg rating'}
                                    onChange={this.handleRating.bind(this, criteria.id)}/>
                        </div>
                    );
                })}
                </form>
            </div>
        );
    }
}
