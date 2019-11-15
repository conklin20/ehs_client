import React, { useEffect } from 'react'; 
import { Switch, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { logout } from '../../store/actions/auth';
import { removeNotification } from '../../store/actions/notifications'; 
import { Hidden } from '@material-ui/core'; 
//components
import AppBar from './AppBar';
import Homepage from './Homepage';
import Dashboard from '../events/shared/Dashboard'; 
import SafetyEventForm from '../events/safety/incidents/SafetyEventForm'; 
import UserAside from '../userAside/UserAside';
import ReportAside from '../reportAside/ReportAside';
import UserProfile from '../user/UserProfile';
import UserManagement from '../admin/user/UserManagement'; 
import HierarchyManagement from '../admin/hierarchy/HierarchyManagement'; 
import Logout from '../user/Logout'; 
import Notification from '../shared/Notification';


const useStyles = makeStyles(theme => ({
    index: {
        display: 'flex',
        flexDirection: 'column',
        margin: 0, 
        padding: 0, 
    },
    appBar: {
        backgroundColor: theme.palette.primary.light,
    },
    body: {
        display: 'flex',
        // padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        // height: '80vh',
        // // overflowY: 'scroll',
        // margin: '0', 
        // padding: '0',
        minWidth: '80vw',
    }, 
    reportAside: {
        display: 'flex', 
        flexDirection: 'column',
        flex: 1, 
        justifyItems: 'space-between',
        backgroundColor: theme.palette.primary.light,
        color: 'white',
        paddingTop: theme.spacing(2),
    },     
    main: {
        flex: 4,
    },
    userAside: {
        display: 'flex', 
        flexDirection: 'column',
        flex: 1, 
        justifyItems: 'space-between',
        backgroundColor: theme.palette.primary.light,
        color: 'white',
        padding: theme.spacing(2),
    }
})); 

const Routes = props => {
    const classes = useStyles(); 

    const { notifications } = props; 

 	// Essentially what was componentDidMount and componentDidUpdate before Hooks
	useEffect(() => {
		return () => {
			console.log('Routes Component Unmounting')
		}
    }, []); //this 2nd arg is important, it tells what to look for changes in, and will re-run the hook when this changes 

    return (
        <div className={classes.index}>
            {/* 
            THIS FIRST PART IS TO DISPLAY BRIEF NOTIFICATIONS THE USER IN THE LOWER LEFT PART OF THE SCREEN 
            */}
            {notifications && notifications.message && (					
                <Notification
                    open={true} 
                    className={classes.margin}
                    variant={notifications.variant}
                    message={notifications.message}	
                    removeNotification={props.removeNotification}							
                />		
            )}
            {/* 
            APP BODY STARTS HERE 
             */}
            <div className={classes.appBar}>
                { props.currentUser.isAuthenticated ? <AppBar onLogout={props.logout} { ...props } /> : null }
            </div>
            <div id='body' className={classes.body}>
                { props.currentUser.isAuthenticated ? <Hidden smDown><div className={classes.reportAside}><ReportAside /> </div></Hidden> : null }
                <Switch>
                    <Route path='/' exact component={Homepage} ></Route>
                    <Route path='/logout' component={Logout} ></Route>
                    <Route path='/dashboard' render={(props) => <div className={classes.main}><Dashboard /> </div> } ></Route>
                    <Route path='/events/si/new' exact component={SafetyEventForm} ></Route>
                    <Route path='/events/si/:eventId' exact component={SafetyEventForm} ></Route>
                    <Route path='/events/si/:eventId/step/:stepNo' component={SafetyEventForm} ></Route>
                    <Route path='/user/profile' render={(props) => <div className={classes.main}><UserProfile /> </div> }  ></Route>
                    <Route path='/manage/users' exact render={(props) => <div className={classes.main}><UserManagement /> </div> }  ></Route>
                    <Route path='/manage/users/:userId' exact render={(props) => <div className={classes.main}><UserManagement /> </div> }  ></Route>
                    <Route path='/manage/hierarchies' exact render={(props) => <div className={classes.main}><HierarchyManagement /> </div> }  ></Route>
                    
                    {/* /manage/attributes */}
                    {/* /reports */}
                </Switch>
                { props.currentUser.isAuthenticated ? <div className={classes.userAside}><UserAside /> </div> : null }
            </div>
        </div>
    )
}

function mapStateToProps(state){
    return {
        // lookupData: state.lookupData,
        currentUser: state.currentUser,
        notifications: state.notifications, 
    }
}

export default withRouter(
    connect(mapStateToProps,  { 
        logout,
        removeNotification,
})(Routes)); 
