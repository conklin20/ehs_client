import React, { Component } from 'react'; 
import { Table } from 'react-bootstrap'; 
import { connect } from 'react-redux'; 
import { fetchSafteyIncidents } from '../../../store/actions/safetyIncidents';
import IncidentItem from './IncidentItem'; 

const tableStyles = {
    color: "white"
}

class IncidentList extends Component {
    componentWillMount() {
        this.props.fetchSafteyIncidents();
    }
    render() {
        const { safetyIncidents } = this.props; 
        console.log(safetyIncidents);
        let safetyIncidentList = safetyIncidents.map(i => (
            <IncidentItem 
                key={i.eventId}
                eventId={i.eventId}
                status={i.eventStatus}
                eventDate={i.eventDate}
                eventTime={i.EventTime}
                whatHappened={i.whatHappened}
            />
        ));

        return ( 
            <Table style={tableStyles} striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>INC#</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>What Happened</th>
                    </tr>
                </thead>
                <tbody>
                    {safetyIncidentList}
                </tbody>
            </Table>
        )
    }
}

function mapStateToProps(state) {
    console.log(state)
    return {
        safetyIncidents: state.safetyIncidents
    };
}

export default connect(mapStateToProps, { fetchSafteyIncidents })(IncidentList); 