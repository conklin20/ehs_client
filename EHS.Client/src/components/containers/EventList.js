import React, { useState, useEffect} from 'react'; 
import { connect } from "react-redux";
import { fetchSafteyIncidents } from '../../store/actions/safetyIncidents';
import EventItem from '../function/EventItem'; 


const EventList = ( props ) => {

  // Essentially what was componentDidMount and componentDidUpdate before Hooks
	useEffect(() => {
			props.fetchSafteyIncidents();
	}); 

	const { safetyIncidents } = props; 
	
	//the userData array is created on the server when the user is authenticated and the jwt tokens payload is created. 
	//if the order of which these fields are added to the payload changes, the order in the array below will also need updated 
	const userData = props.currentUser.user[`http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata`];
	
	let safetyIncidentList = safetyIncidents.map(si => (            
			<EventItem 
					key={si.eventId}
					data={si}
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
					
					utcOffset={userData[1]} 
					dateFormat={userData[2]} 
			/>
	));

	return ( 
			<div>
					{safetyIncidentList}
			</div>
	)
}


function mapStateToProps(state) {
    // console.log(state)
    return {
        safetyIncidents: state.safetyIncidents
    };
}

export default connect(mapStateToProps, { fetchSafteyIncidents })(EventList); 
