import React, { useState, useEffect, Fragment } from 'react'; 
import { connect } from "react-redux";
import { Hidden, Typography, Divider,  } from '@material-ui/core';
import MyActions from './MyActions'; 
import MyApprovals from './MyApprovals';
import MyDrafts from './MyDrafts';
import { fetchDrafts, deleteSafetyIncident } from '../../store/actions/safetyIncidents';
import { fetchMyPendingApprovals } from '../../store/actions/approvals';
import { fetchActions } from '../../store/actions/actions'; 

const UserAside = props => {
    
    const [myActions, setMyActions] = useState([]);
    const [myPendingApprovals, setMyPendingApprovals] = useState([]);
    const [myDrafts, setMyDrafts] = useState([]);

    // Essentially what was componentDidMount and componentDidUpdate before Hooks
	useEffect(() => {
        //get users open actions 
        props.fetchActions(`?userId=${props.currentUser.user.userId}&eventStatus=Open`)
            .then(res => {
                // console.log(res); 
                setMyActions(res.filter(a => !a.completionDate)); 
            })

        //get users pending approvals 
        props.fetchMyPendingApprovals(props.currentUser.user.userId)
            .then(res => {
                setMyPendingApprovals(res)
            })

        //get users drafts
        props.fetchDrafts('?eventStatuses=Draft')
            .then(res => {
                setMyDrafts(res); 
            })
        
        
		return () => {
			console.log('UserAside Unmounting')
		}
	}, []); //this 2nd arg is important, it tells what to look for changes in, and will re-run the hook when this changes 

    //deleting a draft
    const handleDelete = (eventId) => {
        // console.log(`Deleting EventId: ${eventId}`); 
        props.deleteSafetyIncident(eventId, props.currentUser.user.userId)
            .then(res => {
                setMyDrafts(myDrafts.filter(d => d.eventId !== eventId))
            })
            .catch(err => {
                console.log(err); 
            }); 
    }

    // console.log(props.employees)
    return (     
        <Hidden mdDown>
            {props.employees && props.employees.length ? 
                <Fragment>
                    {/* <Typography variant="h4" gutterBottom>User Aside</Typography>   */}
                    <Typography>
                        <MyActions 
                            actions={myActions}
                        />
                        <MyApprovals
                            pendingApprovals={myPendingApprovals}
                        />
                        <MyDrafts 
                            drafts={myDrafts}
                            handleDelete={handleDelete}
                            employees={props.employees}
                        />
                    </Typography>
                </Fragment>
            : null
            }
        </Hidden>
    )
    
}


function mapStateToProps(state) {
    // console.log(state)
    return {
        currentUser: state.currentUser,
        employees: state.lookupData.employees
    };
}

export default connect(mapStateToProps, { 
    fetchActions, 
    fetchDrafts, 
    fetchMyPendingApprovals,
    deleteSafetyIncident,
})(UserAside); 

