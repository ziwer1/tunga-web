import React from 'react';

export default class Clock extends React.Component {

    constructor(props) {
        super(props);
        const output = this.renderTime();
        this.state = {...output};
    }

    componentWillMount() {
        this.intervals = [];
    }

    componentDidMount() {
        this.setInterval(this.tick.bind(this), 1000);
    }

    componentWillUnmount() {
        this.intervals.map(clearInterval);
    }

    setInterval() {
        this.intervals.push(setInterval.apply(null, arguments));
    }

    renderTime() {
        const currentTime = new Date();
        let h = currentTime.getHours();
        let m = currentTime.getMinutes();
        let s = currentTime.getSeconds();

        if (m < 10) {
            m = '0' + m;
        }
        if (s < 10) {
            s = '0' + s;
        }

        return {
            hours: h,
            minutes: m,
            seconds: s
        };
    }

    tick() {
        const output = this.renderTime();
        this.setState({...output});
    }

    render() {
        return (
            <h3 className='clock'>
                { this.state.hours }:{ this.state.minutes }:{ this.state.seconds }
            </h3>
        );
    }
}
