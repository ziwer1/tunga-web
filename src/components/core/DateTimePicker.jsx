import React from 'react';

import {DateTimePicker as DTP, Calendar} from 'react-widgets';
import moment from "moment/moment";
import momentLocalizer from "react-widgets/lib/localizers/moment";

momentLocalizer(moment);

const DateTimePicker = (props) => {
    return (
        <DTP {...props}/>
    );
};

export default DateTimePicker;
