import React, { Component } from 'react'; 
import { connect } from "react-redux";
import EventList from './EventList';

class Dashboard extends Component {

    render() {
        return (
            <div className="dashboard">
                <EventList />

            </div>
        ) 
    }
}

export default Dashboard; 