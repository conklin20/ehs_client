import React from 'react'; 
import Moment from 'react-moment'; 
import { Link } from 'react-router-dom'; 

const IncidentItem = incident => {    
    return (
        <tr>
            <td>{incident.eventId}</td>
            <td>{incident.status}</td>
            <td>
                <Moment format="Do MMM YYYY">
                    {incident.eventDate}
                </Moment>
                </td>
            <td>
                <Moment format="HH:MM">
                    {incident.eventTime}
                </Moment>
            </td>
            <td>{incident.whatHappened}</td>
        </tr>
    )
}

export default IncidentItem; 