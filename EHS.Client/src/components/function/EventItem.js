import React from 'react'; 
import Moment from 'react-moment'; 
import { Link } from 'react-router-dom'; 

const eventItemCss = {
    backgroundColor: 'lightred',
    display: 'flex'

}
const headerCss = {
    justifyContent: 'space-between'

}
const headerLeftCss = {
    display: 'flex',
    flexDirection: 'column'
}
const headerRightCss = {
    display: 'flex',
    flexDirection: 'column'
}
const bodyCss = {
    
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

const EventItem = ({ data, utcOffset, dateFormat }) => {    
    // console.log(data.eventId);
    return (
        <div style={eventItemCss}>
            <div style={headerCss}>
                <div style={headerLeftCss}>
                    <div>
                        {`${data.department} - ${data.initialCategory}/${data.resultingCategory}`}
                    </div>    
                    <div>
                        {data.eployeeId}
                    </div>
                </div>
                <div style={headerRightCss}> 
                    <div>
                        <Moment add={{ hours: utcOffset }} format={dateFormat || "Do MMM YYYY"}>
                            {data.eventDate}
                        </Moment>
                    </div>
                    <div>
                        {data.eventStatus}
                    </div>
                </div>
            </div>
            <div style={bodyCss}>
                <p>
                    {data.whatHappened}
                </p>
            </div>
        </div>
        // <div style={eventItemMainCss}>
        //     <Moment format={dateFormat || "Do MMM YYYY"}>
        //         {data.eventDate}
        //     </Moment>
        // </div>
    )
};

export default EventItem; 