import React, { useEffect, Fragment } from 'react'; 
import { Switch, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { logout } from '../../store/actions/auth';
import { removeNotification } from '../../store/actions/notifications'; 
import { Hidden, Typography, LinearProgress } from '@material-ui/core'; 
import { 
	fetchLogicalHierarchyTree, 
	fetchPhysicalHierarchyTree, 
	fetchGlobalHierarchyAttributes, 
	fetchLogicalHierarchyAttributes, 
	fetchPhysicalHierarchyAttributes, 
	fetchEmployees } from '../../store/actions/lookupData'; 
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
import AttributeManagement from '../admin/attributes/AttributeManagement';
import Reports from '../reports/Reports'
import Logout from '../user/Logout';
import PageNotFound from '../shared/PageNotFound';
import Notification from '../shared/Notification';

const MIN_LOOKUP_DATA_LEN = 6; 

const useStyles = makeStyles(theme => ({
    index: {
        display: 'flex',
        flexDirection: 'column',
        margin: 0, 
        padding: 0, 
    },
    body: {
        display: 'flex',
        textAlign: 'center',
        color: theme.palette.text.secondary,
        minWidth: '80vw',
    }, 
    reportAside: {
        display: 'flex', 
        flexDirection: 'column',
        flex: 1, 
        justifyItems: 'space-between',
        backgroundColor: theme.palette.primary.main,
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
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        padding: theme.spacing(2),
    },
    loading: {
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'center',
        flex: 4,
        marginTop: theme.spacing(10),
    },
    progress: {
        width: '70%',     
        marginTop: '10px',
        height: '2em',
    }
})); 

const Routes = props => {
    const classes = useStyles(); 

    const { notifications, lookupData, currentUser } = props; 

 	// Essentially what was componentDidMount and componentDidUpdate before Hooks
	useEffect(() => {
        
        // console.log(props);
        console.log(props.history);
        console.log(window.history);
        // console.log(currentUser.isAuthenticated)
        // if(props.location.pathname === '/forcelogout' || props.location.hash === '#/forcelogout'){
        //     props.logout();
        //     props.history.push('/');
        // }
        
        //check user auth
        if(!currentUser.isAuthenticated){
            props.history.push('/');
        } else {
            props.fetchEmployees().then(res => console.log(res));
            props.fetchLogicalHierarchyTree(currentUser.user.logicalHierarchyPath.split('|')[currentUser.user.logicalHierarchyPath.split('|').length-1]);
            props.fetchPhysicalHierarchyTree(currentUser.user.physicalHierarchyPath.split('|')[currentUser.user.physicalHierarchyPath.split('|').length-1]);
            props.fetchGlobalHierarchyAttributes(1000, 'fulltree', '?attributetype=global&enabled=true'); //will be the root hierarchy 
            props.fetchLogicalHierarchyAttributes(currentUser.user.logicalHierarchyId || 1000, 'fulltree', '?attributetype=logical&enabled=true'); 
            props.fetchPhysicalHierarchyAttributes(currentUser.user.physicalHierarchyId || 1000, 'fulltree', '?attributetype=physical&enabled=true'); 
        }
        
        // console.log(currentUser)
		return () => {
            // console.log('Routes Component Unmounting')
            
		}
    }, [currentUser.isAuthenticated, props.history]); //this 2nd arg is important, it tells what to look for changes in, and will re-run the hook when this changes 
    
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
                { currentUser.isAuthenticated ? <AppBar handleLogout={props.logout} { ...props } /> : null }
           
                <div id='body' className={classes.body}>
                    { currentUser.isAuthenticated && Object.keys(lookupData).length >= MIN_LOOKUP_DATA_LEN ? <Hidden smDown><div className={classes.reportAside}><ReportAside /> </div></Hidden> : null }
                    <Switch>
                        <Route path='/' exact component={Homepage} ></Route>
                        <Route path='/logout' component={Logout} ></Route>
                        {currentUser.isAuthenticated && Object.keys(lookupData).length >= MIN_LOOKUP_DATA_LEN
                            ?   
                            <Fragment>
                                <Route path='/dashboard' render={(props) => <div className={classes.main}><Dashboard /> </div> } ></Route>
                                <Route path='/user/profile' exact render={(props) => <div className={classes.main}><UserProfile /> </div> }  ></Route>
                                
                                {/* SAFETY INCIDENTS */}
                                <Route  path='/events/si/new' 
                                        render={(props) => 
                                            <div className={classes.main}>
                                                <Fragment>
                                                    <Dashboard {...props} /> 
                                                    <SafetyEventForm {...props} />
                                                </Fragment>
                                            </div> }>                        
                                </Route>
                                <Route  path='/events/si/:eventId' 
                                        exact 
                                        render={(props) => 
                                            <div className={classes.main}>
                                                <Fragment>
                                                    <Dashboard {...props} /> 
                                                    <SafetyEventForm {...props} />
                                                </Fragment>
                                            </div> }>                        
                                </Route>
                                <Route  path='/events/si/:eventId/step/:stepNo' 
                                        render={(props) => 
                                            <div className={classes.main}>
                                                <Fragment>
                                                    <Dashboard {...props} /> 
                                                    <SafetyEventForm {...props} />
                                                </Fragment>
                                            </div> }>                        
                                </Route>
                                
                                {/* SYS MANAGEMENT */}
                                <Route path='/manage/users' exact render={(props) => <div className={classes.main}><UserManagement /> </div> }  ></Route>
                                <Route path='/manage/users/:userId' exact render={(props) => <div className={classes.main}><UserManagement /> </div> }  ></Route>
                                <Route path='/manage/hierarchies' exact render={(props) => <div className={classes.main}><HierarchyManagement /> </div> }  ></Route>
                                <Route path='/manage/hierarchies/attributes' render={(props) => <div className={classes.main}><AttributeManagement /> </div> }  ></Route>
                                {/* manage approval routings */}

                                {/* REPORTS */}
                                <Route path='/reports' exact render={(props) => <div className={classes.main}><Reports {...props} /> </div> }  ></Route>                    
                                <Route path='/reports/:type' exact render={(props) => <div className={classes.main}><Reports {...props} /> </div> }  ></Route>                    
                                <Route path='/reports/:type/:report' exact render={(props) => <div className={classes.main}><Reports {...props} /> </div> }  ></Route>                   
                                         
                            </Fragment>                
                            : <Fragment>
                                <div className={classes.loading}>
                                    <Typography variant='h3' gutterBottom>Loading Application...</Typography>
                                    <LinearProgress className={classes.progress} variant='determinate' value={100 / (MIN_LOOKUP_DATA_LEN - Object.keys(lookupData).length)} />
                                </div>
                            </Fragment>
                        }
                        
                        <Route component={PageNotFound}></Route>
                    </Switch>
                    { props.currentUser.isAuthenticated && Object.keys(lookupData).length >= MIN_LOOKUP_DATA_LEN ? <div className={classes.userAside}><UserAside /> </div> : null }
                </div>
            </div>
    )
}

function mapStateToProps(state){
    return {
        lookupData: state.lookupData,
        currentUser: state.currentUser,
        notifications: state.notifications, 
    }
}

export default withRouter(
    connect(mapStateToProps,  { 
        logout,
        removeNotification,
        fetchEmployees,
        fetchGlobalHierarchyAttributes, 
        fetchLogicalHierarchyAttributes, 
        fetchPhysicalHierarchyAttributes, 
        fetchLogicalHierarchyTree, 
        fetchPhysicalHierarchyTree, 
})(Routes)); 
