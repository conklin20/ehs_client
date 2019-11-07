import React, { Fragment } from 'react'; 
import { Switch, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { logout } from '../../store/actions/auth';
import { removeError } from '../../store/actions/errors'; 
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
    }, 
    reportAside: {
        display: 'flex', 
        flexDirection: 'column',
        flex: 1, 
        justifyItems: 'space-between',
        backgroundColor: theme.palette.primary.light,
        color: 'white',
        padding: theme.spacing(2),
    },     
    main: {
        flex: 4,
        // backgroundColor: 'green',
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

    return (
        <div className={classes.index}>
            <div className={classes.appBar}>
                { props.currentUser.isAuthenticated ? <AppBar currentUser={props.currentUser} onLogout={props.logout} /> : null }
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
                    {/* /manage/hierarchies */}
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
        errors: state.errors, 
    }
}

export default withRouter(
    connect(mapStateToProps, 
        { 
            logout,
            removeError,
        })(Routes)
); 