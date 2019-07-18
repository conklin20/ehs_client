import React, { Component } from 'react'; 
import { connect } from "react-redux";


class UserAside extends Component {
    componentDidMount() {
        // this.props.fetchUserActions();
        // this.props.fetchUserApprovals();
        // this.props.fetchUserDrafts();
    }
    render() {
        return ( 
            <div className="user-aside">
                Complete later
            </div>
        )
    }
}

function mapStateToProps(state) {
    // console.log(state)
    return {
        userActions: state.userActions,
        userApprovals: state.userApprovals,
        userDrafts: state.userDrafts 
    };
}

export default connect(mapStateToProps, null)(UserAside); 
// export default connect(mapStateToProps, { fetchUserActions, fetchUserApprovals, fetchUserDrafts })(UserAside); 
