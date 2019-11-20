import React, { useState, useEffect, Fragment } from 'react'; 
import { connect } from "react-redux";
import MyActions from './MyActions'; 
import MyApprovals from './MyApprovals';
import MyDrafts from './MyDrafts';
import { fetchDrafts, deleteSafetyIncident } from '../../store/actions/safetyIncidents';
import { fetchMyPendingApprovals } from '../../store/actions/approvals';
import { fetchActions } from '../../store/actions/actions';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    sectionTitle:{
        marginTop: theme.spacing(3),
    },
    sectionBody: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
      maxHeight: '33vh',
      overflowY: 'scroll',      
    },
    link: {
        textDecoration: 'none',
        color: theme.palette.primary.dark
    },
    badge: {
        paddingLeft: theme.spacing(2),
    }
})); 

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
                // console.log(res)
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
        <Fragment>
            {employees && employees.length ? 
                <Fragment>                   
                        <MyActions 
                            actions={myActions}
                            currentUser={currentUser}
                            useStyles={useStyles} 
                        />
                        <MyApprovals
                            pendingApprovals={myPendingApprovals}
                            currentUser={currentUser}
                            useStyles={useStyles} 
                        />          
                        <MyDrafts 
                            drafts={myDrafts}
                            handleDelete={handleDelete}
                            employees={employees}
                            currentUser={currentUser}
                            useStyles={useStyles} 
                        />
                </Fragment>
            : null
            }
        </Fragment>
    )
    
}


function mapStateToProps(state) {
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

