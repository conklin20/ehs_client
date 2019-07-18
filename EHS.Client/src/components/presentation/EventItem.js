import React from 'react'; 
import Moment from 'react-moment'; 
import { Link } from 'react-router-dom'; 

const eventItemMainCss = {

}

// key={si.eventId}
// id={si.eventId}
// type={si.eventType}
// status={si.eventStatus}
// dateOccurred={si.eventDate}
// timeOccurred={si.EventTime}
// initialCategory={si.initialCategory}
// resultingCategory={si.resultingCategory}
// employeeId={si.employeeId}
// jobTitle={si.jobTitle}
// area={si.area}
// department={si.department}
// localePlant={si.localePlant}
// localePlantArea={si.localePlantArea}
// whatHappened={si.whatHappened}
// actions={si.actions}

const EventItem = si => {    
    return (
        <div style={eventItemMainCss}>
            
                <Moment format="Do MMM YYYY">
                    {si.eventDate}
                </Moment>
        </div>
    )
};

export default EventItem; 