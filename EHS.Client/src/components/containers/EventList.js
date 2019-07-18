import React, { Component } from 'react'; 
import { connect } from "react-redux";
import { fetchSafteyIncidents } from '../../store/actions/safetyIncidents';
import EventItem from '../presentation/EventItem'; 


class EventList extends Component {
    componentDidMount() {
        this.props.fetchSafteyIncidents();
    }
    render() {
        const { safetyIncidents } = this.props; 
        let safetyIncidentList = safetyIncidents.map(si => (            
            <EventItem 
                key={si.eventId}
                id={si.eventId}
                type={si.eventType}
                status={si.eventStatus}
                dateOccurred={si.eventDate}
                timeOccurred={si.EventTime}
                initialCategory={si.initialCategory}
                resultingCategory={si.resultingCategory}
                employeeId={si.employeeId}
                jobTitle={si.jobTitle}
                area={si.area}
                department={si.department}
                localePlant={si.localePlant}
                localePlantArea={si.localePlantArea}
                whatHappened={si.whatHappened}
                actions={si.actions}
            />
        ));

        return ( 
            <div>
                {safetyIncidentList}
            </div>
        )
    }
}

function mapStateToProps(state) {
    // console.log(state)
    return {
        safetyIncidents: state.safetyIncidents
    };
}

export default connect(mapStateToProps, { fetchSafteyIncidents })(EventList); 
