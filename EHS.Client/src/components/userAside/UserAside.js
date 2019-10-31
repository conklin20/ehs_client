import React, { useState, useEffect, Fragment } from 'react'; 
import { connect } from "react-redux";
import { Hidden, Typography, } from '@material-ui/core';
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

    const { fetchActions, fetchMyPendingApprovals, fetchDrafts, currentUser, employees } = props; 

    // Essentially what was componentDidMount and componentDidUpdate before Hooks
	useEffect(() => {
        //get users open actions 
        fetchActions(`?userId=${currentUser.user.userId}&eventStatus=Open`)
            .then(res => {
                if(res) setMyActions(res.filter(a => !a.completionDate)); 
            })

        //get users pending approvals 
        fetchMyPendingApprovals(currentUser.user.userId)
            .then(res => {
                if(res) setMyPendingApprovals(res)
            })

        //get users drafts
        fetchDrafts('?eventStatuses=Draft')
            .then(res => {
                if(res) setMyDrafts(res); 
            })
                
		return () => {
			console.log('UserAside Unmounting')
		}
	}, [props.safetyIncidents]); //this 2nd arg is important, it tells what to look for changes in, and will re-run the hook when this changes 

    //deleting a draft
    const handleDelete = (eventId) => {
        // console.log(`Deleting EventId: ${eventId}`); 
        props.deleteSafetyIncident(eventId, currentUser.user.userId)
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
            {employees && employees.length ? 
                <Fragment>
                    {/* <Typography variant="h4" gutterBottom>User Aside</Typography>   */}
                    <Typography>
                        {myActions.length ? 
                            <MyActions 
                                actions={myActions}
                            />
                            : null
                        }
                        {myPendingApprovals.length ? 
                            <MyApprovals
                                pendingApprovals={myPendingApprovals}
                            />
                            : null
                        }
                        {myDrafts.length ?                         
                            <MyDrafts 
                                drafts={myDrafts}
                                handleDelete={handleDelete}
                                employees={employees}
                            />
                            : null
                        }
                    </Typography>
                </Fragment>
            : null
            }
        </Hidden>
    )
    
}


function mapStateToProps(state) {
    console.log(state)
    return {
        currentUser: state.currentUser,
        employees: state.lookupData.employees, 
        safetyIncidents: state.safetyIncidents, 
    };
}

export default connect(mapStateToProps, { 
    fetchActions, 
    fetchDrafts, 
    fetchMyPendingApprovals,
    deleteSafetyIncident,
})(UserAside); 

