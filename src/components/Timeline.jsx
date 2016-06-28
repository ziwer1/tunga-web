import React from 'react'
import { Link } from 'react-router'
import moment from 'moment'
import TimeAgo from 'react-timeago'
import {Button, OverlayTrigger, Tooltip, ButtonGroup, Popover} from 'react-bootstrap'
import { resizeOverviewBox } from './TaskOverview'
import LargeModal from './ModalLarge'
import ComponentWithModal from './ComponentWithModal'
import MilestonePage from '../containers/MilestonePage'
import Milestone from './Milestone'

export default class Timeline extends ComponentWithModal {

    constructor(props) {
        super(props);
        this.state = {min: null, max: null, duration: 0, all_events: [], next_event: null, modalEvent: {}};
    }

    componentDidMount() {
        this.parseTimeline();
        $(document).ready(resizeOverviewBox);
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.events.length != prevProps.events.length) {
            this.parseTimeline();
            $(document).ready(resizeOverviewBox);
        }
    }

    parseTimeline() {
        var selected = this.props.selected;
        var selected_event = null;
        const { start, end, events } = this.props;
        var all_events = [];
        if(start) {
            all_events.push({title: 'Task created', due_at: start});
        }
        if(end) {
            all_events.push({title: 'Deadline', due_at: end});
        }
        all_events = [...all_events, ...events];
        var next_event = null;
        const now = moment.utc().unix();
        var timestamps = all_events.map((event) => {
            let this_tm = moment.utc(event.due_at).unix();
            if((this_tm > now) && (!next_event || next_event && this_tm < moment.utc(next_event.due_at).unix())) {
                next_event = event;
            }
            if(selected && event.id == selected) {
                selected_event = event;
            }
            return this_tm;
        });
        var min = null,
            max = null,
            duration = 0;
        if(timestamps.length) {
            min = Math.min(...timestamps);
            max = Math.max(...timestamps);
            duration = max - min;
        }
        this.setState({min, max, duration, all_events, next_event});
        if(selected_event) {
            this.openMilestone(selected_event);
        }
    }

    openMilestone(event) {
        if(event.id) {
            this.setState({modalEvent: event});
            this.open();
        }
    }

    renderEvent(event) {
        if(!this.state.duration || (event.is_now && !this.state.next_event)) {
            return null;
        }
        const timestamp = moment.utc(event.due_at).unix();
        const length = timestamp - this.state.min;
        const pos = (length/this.state.duration)*100;
        const ts_now = moment.utc().unix();
        let is_missed = ((timestamp + 24*60*60) < ts_now && event.type); // Developers have 24 hrs before a task update is missed

        const popover = (
            <Popover id="popover">
                <div className="title">{event.title || 'Scheduled Update'}</div>
                {event.is_now?(
                <div>
                    {this.state.next_event.type?('Next '+(this.state.next_event.type ==3?'Milestone':'Update')):'Deadline'}
                    <span> is </span>
                    <TimeAgo date={moment.utc(this.state.next_event.due_at).local().format()}/>
                </div>
                    ):(
                <div>
                    {event.due_at?moment.utc(event.due_at).local().format('ddd Do, MMMM YYYY, h:mm a'):null}
                    {event.report?(
                    <div>
                        <strong>Status: </strong><span>{event.report.status_display}</span><br/>
                        <strong>Completed: </strong><span>{event.report.percentage}%</span>
                    </div>
                        ):(
                        is_missed?(
                        <div>
                            <strong>{event.type == 3?'Milestone':'Update'} missed</strong>
                        </div>
                            ):null
                        )}
                </div>
                    )}
            </Popover>);
        return (
            <OverlayTrigger key={event.due_at} placement={timestamp == this.state.max?"left":"top"} overlay={popover}
                            onClick={this.openMilestone.bind(this, event)}>
                <div key={event.id}
                     className={"event" + (moment.utc(event.due_at) < moment.utc() && !event.is_now?' past':'')}
                     style={{left: pos + '%'}}>
                    <span>{event.is_now?<i className="fa fa-square"/>:<i className="fa fa-circle"/>}</span>
                </div>
            </OverlayTrigger>
        );
    }

    renderModalContent() {
        return (
            <div>
                <LargeModal title={this.state.modalEvent.title || 'Task Update'} show={this.state.showModal} onHide={this.close.bind(this)}>
                    <MilestonePage>
                        <Milestone milestone_id={this.state.modalEvent.id}/>
                    </MilestonePage>
                </LargeModal>
            </div>
        );
    }

    render() {
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
                {this.renderModalContent()}

                <div className="line duration-line"/>

                <div className="line progress-line" style={{width: progress_width + '%'}}/>

                {this.state.all_events.map((event) => {
                    return this.renderEvent(event);
                    })}

                {this.renderEvent({title: 'Reminder', due_at: moment.utc().format(), is_now: true})}
            </div>
        );
    }
}
