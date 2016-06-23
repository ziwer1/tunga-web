import React from 'react'
import { Link } from 'react-router'
import moment from 'moment'
import {Button, OverlayTrigger, Tooltip, ButtonGroup, Popover} from 'react-bootstrap'

export default class Timeline extends React.Component {

    constructor(props) {
        super(props);
        this.state = {min: null, max: null, duration: 0, all_events: []};
    }

    componentDidMount() {
        const { events } = this.props;
        this.parseTimeline();
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.events.length != prevProps.events.length) {
            this.parseTimeline();
        }
    }

    parseTimeline() {
        const { start, end, events } = this.props;
        var all_events = [];
        if(start) {
            all_events.push({title: 'Task created', due_at: start});
        }
        if(end) {
            all_events.push({title: 'Deadline', due_at: end});
        }
        all_events = [...all_events, ...events];
        var timestamps = all_events.map((event) => {
            return moment.utc(event.due_at).unix();
        });
        var min = null,
            max = null,
            duration = 0;
        if(timestamps.length) {
            min = Math.min(...timestamps);
            max = Math.max(...timestamps);
            duration = max - min;
        }
        this.setState({min, max, duration, all_events});
    }

    renderEvent(event) {
        if(!this.state.duration) {
            return null;
        }
        const timestamp = moment.utc(event.due_at).unix();
        const length = timestamp - this.state.min;
        const pos = (length/this.state.duration)*100;
        const popover = (
            <Popover id="popover">
                <div className="title">{event.title}</div>
                {event.due_at?moment.utc(event.due_at).local().format('Do, MMMM YYYY, h:mm a'):null}
            </Popover>);
        return (
            <OverlayTrigger key={event.due_at} placement={timestamp == this.state.max?"left":"top"} overlay={popover}>
                <div key={event.id} className={"event" + (moment.utc(event.due_at) < moment.utc()?' past':'')} style={{left: pos + '%'}}><span><i className="fa fa-circle"/></span></div>
            </OverlayTrigger>
        );
    }

    render() {
        const { events } = this.props;
        if(this.state.all_events.length < 2 || this.state.min == null || this.state.duration == 0) {
            return null;
        }

        const timestamp = moment.utc().unix();
        const length = timestamp - this.state.min;
        var progress_width = (length/this.state.duration)*100;
        if(progress_width > 100) {
            progress_width = 100;
        } else if(progress_width < 0) {
            progress_width = 0;
        }


        return (
            <div className="timeline">
                <div className="line duration-line"/>

                <div className="line progress-line" style={{width: progress_width + '%'}}/>
                {this.state.all_events.map((event) => {
                    return this.renderEvent(event);
                    })}
            </div>
        );
    }
}
