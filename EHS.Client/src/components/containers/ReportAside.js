import React, { Component } from 'react'; 
import { connect } from "react-redux";


class ReportAside extends Component {
    componentDidMount() {
        // this.props.fetchUserActions();
        // this.props.fetchUserApprovals();
        // this.props.fetchUserDrafts();
    }
    render() {
        return ( 
            <div className="report-aside">
                Complete later
            </div>
        )
    }
}

function mapStateToProps(state) {
    // console.log(state)
    return {
    };
}

export default connect(mapStateToProps, null)(ReportAside); 
